/**
 * Shuffle Images for Secondary Cars
 *
 * Re-uploads different image sets to secondary cars that currently share
 * the same first 5 images as their primary car. Primary cars keep images 1-5,
 * secondary cars get images 6-10, 11-15, 16-20, etc.
 *
 * Usage:
 *   npx tsx scripts/shuffle-secondary-images.ts           # Upload shuffled images
 *   npx tsx scripts/shuffle-secondary-images.ts --dry-run  # Preview assignments
 *
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with Editor permissions
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient, type SanityClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

const IMAGES_BASE_PATH = 'imagesToUpload/AMMO STOCK CARS'
const IMAGES_PER_CAR = 5
const MIN_IMAGES_FOR_SHUFFLE = 10 // Need at least 2 unique sets of 5
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

// Same mapping as upload-to-existing-cars.ts
// First slug = primary (keep current images), rest = secondary (re-upload)
const FOLDER_TO_SLUGS_MAP: Record<string, string[]> = {
  'BENTLEY CONTINENTAL': ['bentley-continental', 'bentley-bentayga-s'],
  'LAMBORGHINI AVENTADOR S MATTE BLACK': [
    'lamborghini-aventador-s-roadster',
    'lamborghini-aventador',
  ],
  'LAMBORGHINI AVENTADOR SVJ GREY': [
    'lamborghini-aventador-svj-coupe',
    'lamborghini-aventador-svj-green',
  ],
  'LAMBORGHINI AVENTADOR SVJ YELLOW': [
    'lamborghini-aventador-svj-roadster',
    'lamborghini-aventador-svj-roadster-hire-uk',
  ],
  'LAMBORGHINI HURACAN EVO': [
    'lamborghini-huracan-evo',
    'lamborghini-huracan-evo-green',
    'lamborghini-huracan-evo-spyder',
  ],
  'LAMBORGHINI URUS MATTE BLACK': [
    'lamborghini-urus',
    'lamborghini-urus-satin',
  ],
  'MERCEDES BENZ G-WAGON': [
    'mercedes-grey-g-wagon',
    'mercedes-benz-g-wagon-blue',
    'mercedes-g63',
  ],
  'RANGE ROVER SPORT SVR': [
    'range-rover-sport-svr',
    'range-rover-sport-sv',
    'range-rover-2023',
  ],
  'ROLLS ROYCE CULLINAN BLACK BADGE 1': [
    'rolls-royce-cullinan-black-badge',
    'rolls-royce-cullinan',
    'rolls-royce-black-badge',
  ],
  'ROLLS ROYCE DAWN BLACK': [
    'rolls-royce-dawn-black',
    'rolls-royce-dawn-white',
  ],
  'ROLLS ROYCE PHANTOM 8': [
    'rolls-royce-phantom-8',
    'rolls-royce-phantom',
    'rolls-royce-phantom-ewb',
    'rolls-royce-ghost',
    'rolls-royce-ghost-ewb',
    'rolls-royce-ghost-lwb',
  ],
}

interface UploadedImage {
  _type: 'image'
  _key: string
  asset: {
    _type: 'reference'
    _ref: string
  }
}

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

function sortNumerically(files: string[]): string[] {
  return files.sort((a, b) => {
    const numA = parseInt(path.basename(a, path.extname(a)), 10)
    const numB = parseInt(path.basename(b, path.extname(b)), 10)
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }
    return a.localeCompare(b)
  })
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

async function uploadImage(
  client: SanityClient,
  filePath: string,
  filename: string
): Promise<UploadedImage | null> {
  try {
    const imageBuffer = fs.readFileSync(filePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
    })

    return {
      _type: 'image',
      _key: generateKey(),
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`  ✗ Failed to upload ${filename}:`, error)
    return null
  }
}

async function getCarBySlug(
  client: SanityClient,
  slug: string
): Promise<{ _id: string; name: string } | null> {
  return client.fetch(
    `*[_type == "car" && slug.current == $slug][0]{ _id, name }`,
    { slug }
  )
}

interface SecondaryAssignment {
  slug: string
  folder: string
  imageFiles: string[] // full paths
  imageNames: string[] // just filenames for display
  wrapped: boolean // true if assignment wraps around (overlaps with earlier cars)
}

function buildAssignments(): {
  assignments: SecondaryAssignment[]
  skipped: { folder: string; reason: string }[]
} {
  const assignments: SecondaryAssignment[] = []
  const skipped: { folder: string; reason: string }[] = []

  for (const [folder, slugs] of Object.entries(FOLDER_TO_SLUGS_MAP)) {
    // Only process folders with multiple slugs
    if (slugs.length <= 1) {
      continue
    }

    const folderPath = path.join(IMAGES_BASE_PATH, folder)
    if (!fs.existsSync(folderPath)) {
      skipped.push({ folder, reason: 'folder not found' })
      continue
    }

    const allFiles = fs.readdirSync(folderPath).filter(isImageFile)
    const sortedFiles = sortNumerically(allFiles)

    if (sortedFiles.length < MIN_IMAGES_FOR_SHUFFLE) {
      skipped.push({
        folder,
        reason: `only ${sortedFiles.length} images (need ${MIN_IMAGES_FOR_SHUFFLE}+)`,
      })
      continue
    }

    // Skip index 0 (primary), assign images to secondary slugs
    for (let i = 1; i < slugs.length; i++) {
      const startIdx = (i * IMAGES_PER_CAR) % sortedFiles.length
      const wrapped = startIdx + IMAGES_PER_CAR > sortedFiles.length || startIdx < IMAGES_PER_CAR

      // Grab IMAGES_PER_CAR files, wrapping around if needed
      const selectedFiles: string[] = []
      for (let j = 0; j < IMAGES_PER_CAR; j++) {
        const idx = (startIdx + j) % sortedFiles.length
        selectedFiles.push(sortedFiles[idx])
      }

      assignments.push({
        slug: slugs[i],
        folder,
        imageFiles: selectedFiles.map((f) => path.join(folderPath, f)),
        imageNames: selectedFiles,
        wrapped: startIdx + IMAGES_PER_CAR > sortedFiles.length,
      })
    }
  }

  return { assignments, skipped }
}

async function dryRun(
  assignments: SecondaryAssignment[],
  skipped: { folder: string; reason: string }[]
): Promise<void> {
  console.log('\n🔍 DRY RUN - Image Shuffle Preview')
  console.log('====================================\n')

  // Show skipped folders
  if (skipped.length > 0) {
    console.log('⏭ Skipped folders:')
    for (const s of skipped) {
      console.log(`  ${s.folder}: ${s.reason}`)
    }
    console.log('')
  }

  // Show primary cars (first slug of each multi-slug folder)
  console.log('🔒 Primary cars (no change):')
  for (const [folder, slugs] of Object.entries(FOLDER_TO_SLUGS_MAP)) {
    if (slugs.length > 1) {
      const folderPath = path.join(IMAGES_BASE_PATH, folder)
      if (fs.existsSync(folderPath)) {
        const allFiles = fs.readdirSync(folderPath).filter(isImageFile)
        if (allFiles.length >= MIN_IMAGES_FOR_SHUFFLE) {
          console.log(`  ${slugs[0]} (keeps images 1-5 from ${folder})`)
        }
      }
    }
  }
  console.log('')

  // Show assignments
  console.log('🔄 Secondary cars to re-upload:')
  for (const a of assignments) {
    const wrapNote = a.wrapped ? ' ⚠ wraps around' : ''
    console.log(`\n  ${a.slug}${wrapNote}`)
    console.log(`    Folder: ${a.folder}`)
    console.log(`    Images:`)
    a.imageNames.forEach((name, i) => {
      console.log(`      ${i + 1}. ${name}`)
    })
  }

  console.log('\n====================================')
  console.log('📊 Summary')
  console.log(`  Secondary cars to update: ${assignments.length}`)
  console.log(`  Total images to upload: ${assignments.length * IMAGES_PER_CAR}`)
  console.log(`  Folders skipped: ${skipped.length}`)
  console.log('\nRun without --dry-run to upload images.')
}

async function uploadShuffledImages(
  assignments: SecondaryAssignment[]
): Promise<void> {
  if (!projectId || !dataset) {
    console.error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET'
    )
    process.exit(1)
  }

  if (!token) {
    console.error('Missing SANITY_API_TOKEN - add it to .env.local')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-01-10',
    useCdn: false,
    token,
  })

  console.log('\n🔄 Uploading Shuffled Images to Secondary Cars')
  console.log('================================================')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Cars to update: ${assignments.length}`)
  console.log('')

  const results = {
    updated: [] as string[],
    notFound: [] as string[],
    failed: [] as string[],
    imagesUploaded: 0,
  }

  for (const assignment of assignments) {
    const car = await getCarBySlug(client, assignment.slug)

    if (!car) {
      console.log(`\n✗ Car not found: ${assignment.slug}`)
      results.notFound.push(assignment.slug)
      continue
    }

    console.log(`\n📁 ${car.name} (${assignment.slug})`)
    console.log(`   Folder: ${assignment.folder}`)

    const uploadedImages: UploadedImage[] = []
    for (const filePath of assignment.imageFiles) {
      const filename = path.basename(filePath)
      console.log(`  ↑ Uploading ${filename}...`)
      const uploaded = await uploadImage(client, filePath, filename)
      if (uploaded) {
        uploadedImages.push(uploaded)
        results.imagesUploaded++
        console.log(`  ✓ Uploaded ${filename}`)
      }
    }

    if (uploadedImages.length === 0) {
      console.log(`  ✗ No images uploaded successfully`)
      results.failed.push(car.name)
      continue
    }

    try {
      await client.patch(car._id).set({ images: uploadedImages }).commit()
      console.log(
        `  ✓ Updated ${car.name} with ${uploadedImages.length} images`
      )
      results.updated.push(car.name)
    } catch (error) {
      console.error(`  ✗ Failed to update ${car.name}:`, error)
      results.failed.push(car.name)
    }
  }

  // Summary
  console.log('\n================================================')
  console.log('📊 Summary')
  console.log('================================================')

  if (results.updated.length > 0) {
    console.log(`\n✓ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.notFound.length > 0) {
    console.log(`\n⚠ Not found in Sanity (${results.notFound.length}):`)
    results.notFound.forEach((slug) => console.log(`  - ${slug}`))
  }

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed (${results.failed.length}):`)
    results.failed.forEach((name) => console.log(`  - ${name}`))
  }

  console.log(`\n📸 Total images uploaded: ${results.imagesUploaded}`)
  console.log('\n✅ Done!')
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')

  console.log('🔄 Bespoke Cars - Shuffle Secondary Car Images')
  console.log('===============================================')

  const { assignments, skipped } = buildAssignments()

  if (assignments.length === 0) {
    console.log('\nNo secondary cars to update.')
    if (skipped.length > 0) {
      console.log('Skipped folders:')
      skipped.forEach((s) => console.log(`  ${s.folder}: ${s.reason}`))
    }
    process.exit(0)
  }

  if (isDryRun) {
    await dryRun(assignments, skipped)
  } else {
    await uploadShuffledImages(assignments)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

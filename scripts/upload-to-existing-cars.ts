/**
 * Upload Images to Existing Sanity Cars
 *
 * Uploads local images to Sanity and attaches them to existing car documents.
 *
 * Usage:
 *   npx tsx scripts/upload-to-existing-cars.ts           # Upload images
 *   npx tsx scripts/upload-to-existing-cars.ts --dry-run # Preview without uploading
 *
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with Editor permissions
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient, type SanityClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

// Image folder path
const IMAGES_BASE_PATH = 'imagesToUpload/AMMO STOCK CARS'

// Maximum images to upload per car (hero + 4 gallery)
const MAX_IMAGES_PER_CAR = 5

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

// Hardcoded mapping: folder name -> Sanity slugs (supports multiple cars per folder)
const FOLDER_TO_SLUGS_MAP: Record<string, string[]> = {
  // Exact matches (original mappings)
  'AUDI R8': ['audi-r8-spyder'],
  'BENTLEY CONTINENTAL': ['bentley-continental', 'bentley-bentayga-s'], // Bentayga uses Continental images
  'BUGATTI VEYRON': ['bugatti-veyron'],
  'FERRAARI PUROSANGU': ['ferrari-purosangue'],
  'LA FERRARI FERRARI': ['ferrari-laferrari'],
  'LAMBORGHINI AVENTADOR S MATTE BLACK': [
    'lamborghini-aventador-s-roadster',
    'lamborghini-aventador', // Base Aventador uses S Roadster images
  ],
  'LAMBORGHINI AVENTADOR SVJ BLUE': ['lamborghini-aventador-svj'],
  'LAMBORGHINI AVENTADOR SVJ GREY': [
    'lamborghini-aventador-svj-coupe',
    'lamborghini-aventador-svj-green', // Green SVJ uses Grey images
  ],
  'LAMBORGHINI AVENTADOR SVJ YELLOW': [
    'lamborghini-aventador-svj-roadster',
    'lamborghini-aventador-svj-roadster-hire-uk', // UK variant uses same images
  ],
  'LAMBORGHINI HURACAN EVO': [
    'lamborghini-huracan-evo',
    'lamborghini-huracan-evo-green', // Green Evo uses standard Evo images
    'lamborghini-huracan-evo-spyder', // Spyder uses Evo images
  ],
  'LAMBORGHINI REVUELTO': ['lamborghini-revuelto'],
  'LAMBORGHINI URUS GREEN': ['lamborghini-urus-green'],
  'LAMBORGHINI URUS MATTE BLACK': [
    'lamborghini-urus',
    'lamborghini-urus-satin', // Satin uses Matte Black images
  ],
  'MERCEDES BENZ G-WAGON': [
    'mercedes-grey-g-wagon',
    'mercedes-benz-g-wagon-blue', // Blue G-Wagon uses Grey images
    'mercedes-g63', // G63 is the AMG G-Wagon
  ],
  'PURPLE HURACAN EVO': [
    'lamborghini-huracan-performante',
    'lamborghini-huracan-sto', // STO uses Performante images
  ],
  'RANGE ROVER SPORT SVR': [
    'range-rover-sport-svr',
    'range-rover-sport-sv', // SV uses SVR images
    'range-rover-2023', // 2023 model uses Sport SVR images
  ],
  'ROLLS ROYCE CULLINAN BLACK BADGE 1': [
    'rolls-royce-cullinan-black-badge',
    'rolls-royce-cullinan', // Standard Cullinan uses Black Badge images
    'rolls-royce-black-badge', // Generic Black Badge
  ],
  'ROLLS ROYCE CULLINAN BLACK BADGE 2': [
    'rolls-royce-white-cullinan', // White Cullinan uses folder 2
  ],
  'ROLLS ROYCE DAWN BLACK': [
    'rolls-royce-dawn-black',
    'rolls-royce-dawn-white', // White Dawn uses Black Dawn images
  ],
  'ROLLS ROYCE PHANTOM 8': [
    'rolls-royce-phantom-8',
    'rolls-royce-phantom', // Base Phantom uses Phantom 8 images
    'rolls-royce-phantom-ewb', // EWB uses Phantom 8 images
    'rolls-royce-ghost', // Ghost uses Phantom images (similar sedan)
    'rolls-royce-ghost-ewb', // Ghost EWB
    'rolls-royce-ghost-lwb', // Ghost LWB
  ],
  'URUS PERF AMMO': ['lamborghini-urus-performante'],
  'URUS S': ['lamborghini-urus-s'],
}

interface UploadedImage {
  _type: 'image'
  _key: string
  asset: {
    _type: 'reference'
    _ref: string
  }
}

interface CarInfo {
  slug: string
  folderPath: string
  imageFiles: string[]
}

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

function sortNumerically(files: string[]): string[] {
  // Sort files numerically (1.jpg, 2.jpg, ..., 10.jpg, 11.jpg)
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
): Promise<{ _id: string; name: string; hasImages: boolean } | null> {
  return client.fetch(
    `*[_type == "car" && slug.current == $slug][0]{ _id, name, "hasImages": defined(images) && length(images) > 0 }`,
    { slug }
  )
}

function discoverCars(): Map<string, CarInfo> {
  const carsMap = new Map<string, CarInfo>()

  if (!fs.existsSync(IMAGES_BASE_PATH)) {
    console.error(`Image folder not found: ${IMAGES_BASE_PATH}`)
    process.exit(1)
  }

  const entries = fs.readdirSync(IMAGES_BASE_PATH, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const folderName = entry.name
    const slugs = FOLDER_TO_SLUGS_MAP[folderName]

    if (!slugs || slugs.length === 0) {
      console.log(`⚠ No mapping for folder: ${folderName}`)
      continue
    }

    const folderPath = path.join(IMAGES_BASE_PATH, folderName)
    const allFiles = fs.readdirSync(folderPath).filter(isImageFile)
    const sortedFiles = sortNumerically(allFiles)
    const imageFiles = sortedFiles.slice(0, MAX_IMAGES_PER_CAR)

    if (imageFiles.length === 0) {
      console.log(`⚠ No images in folder: ${folderName}`)
      continue
    }

    // Map each slug to the same folder's images
    for (const slug of slugs) {
      // Skip if already mapped (handles duplicate slugs across folders)
      if (carsMap.has(slug)) {
        continue
      }

      carsMap.set(slug, {
        slug,
        folderPath,
        imageFiles: imageFiles.map((f) => path.join(folderPath, f)),
      })
    }
  }

  return carsMap
}

async function dryRun(carsMap: Map<string, CarInfo>): Promise<void> {
  console.log('\n🔍 DRY RUN - Preview of uploads')
  console.log('================================\n')

  if (!projectId || !dataset) {
    console.error('Missing environment variables for Sanity connection')
    console.log('\nNote: Run without --dry-run to verify car slugs exist in Sanity')
    console.log('')
  }

  let clientAvailable = false
  let client: SanityClient | null = null

  if (projectId && dataset && token) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: '2026-01-10',
      useCdn: false,
      token,
    })
    clientAvailable = true
  }

  let totalImages = 0
  let matchedCars = 0
  let carsWithImages = 0
  let carsToUpdate = 0
  let missingCars: string[] = []
  let skippedCars: string[] = []

  for (const [slug, carInfo] of carsMap) {
    let carName = slug
    let status = '?'

    if (clientAvailable && client) {
      const car = await getCarBySlug(client, slug)
      if (car) {
        carName = car.name
        matchedCars++
        if (car.hasImages) {
          status = '⏭'
          carsWithImages++
          skippedCars.push(carName)
        } else {
          status = '✓'
          carsToUpdate++
          totalImages += carInfo.imageFiles.length
        }
      } else {
        status = '✗'
        missingCars.push(slug)
      }
    }

    console.log(`${status} ${carName} (${slug})`)
    if (status === '⏭') {
      console.log(`  Already has images - will be skipped`)
    } else if (status === '✓') {
      console.log(`  Folder: ${carInfo.folderPath}`)
      console.log(`  Images (${carInfo.imageFiles.length}):`)
      carInfo.imageFiles.forEach((f, i) => {
        console.log(`    ${i + 1}. ${path.basename(f)}`)
      })
    }
    console.log('')
  }

  console.log('================================')
  console.log('📊 Summary')
  console.log('================================')
  console.log(`Total mappings: ${carsMap.size}`)
  if (clientAvailable) {
    console.log(`Cars found in Sanity: ${matchedCars}`)
    console.log(`Cars to update (no images): ${carsToUpdate}`)
    console.log(`Cars to skip (have images): ${carsWithImages}`)
    console.log(`Total images to upload: ${totalImages}`)
    if (missingCars.length > 0) {
      console.log(`\n✗ Cars NOT found in Sanity (${missingCars.length}):`)
      missingCars.forEach((s) => console.log(`  - ${s}`))
    }
    if (skippedCars.length > 0) {
      console.log(`\n⏭ Cars to skip (already have images):`)
      skippedCars.forEach((s) => console.log(`  - ${s}`))
    }
  }
  console.log('\nRun without --dry-run to upload images.')
}

async function uploadImages(carsMap: Map<string, CarInfo>): Promise<void> {
  if (!projectId || !dataset) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
    process.exit(1)
  }

  if (!token) {
    console.error('Missing SANITY_API_TOKEN - add it to .env.local')
    console.error('Create a token at: sanity.io/manage → Your Project → API → Tokens')
    process.exit(1)
  }

  const client: SanityClient = createClient({
    projectId,
    dataset,
    apiVersion: '2026-01-10',
    useCdn: false,
    token,
  })

  console.log('\n🚗 Uploading Images to Existing Cars')
  console.log('=====================================')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Cars to process: ${carsMap.size}`)
  console.log('')

  const results = {
    updated: [] as string[],
    skipped: [] as string[],
    notFound: [] as string[],
    failed: [] as string[],
    imagesUploaded: 0,
  }

  for (const [slug, carInfo] of carsMap) {
    // Find the car in Sanity
    const car = await getCarBySlug(client, slug)

    if (!car) {
      console.log(`\n✗ Car not found: ${slug}`)
      results.notFound.push(slug)
      continue
    }

    // Skip cars that already have images
    if (car.hasImages) {
      console.log(`\n⏭ ${car.name} - already has images, skipping`)
      results.skipped.push(car.name)
      continue
    }

    console.log(`\n📁 ${car.name} (${slug})`)

    // Upload images
    const uploadedImages: UploadedImage[] = []
    for (const filePath of carInfo.imageFiles) {
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

    // Patch the car document with images
    try {
      await client
        .patch(car._id)
        .set({ images: uploadedImages })
        .commit()
      console.log(`  ✓ Updated ${car.name} with ${uploadedImages.length} images`)
      results.updated.push(car.name)
    } catch (error) {
      console.error(`  ✗ Failed to update ${car.name}:`, error)
      results.failed.push(car.name)
    }
  }

  // Summary
  console.log('\n=====================================')
  console.log('📊 Summary')
  console.log('=====================================')

  if (results.updated.length > 0) {
    console.log(`\n✓ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.skipped.length > 0) {
    console.log(`\n⏭ Skipped - already have images (${results.skipped.length}):`)
    results.skipped.forEach((name) => console.log(`  - ${name}`))
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
  console.log('Next steps:')
  console.log('  1. Open Sanity Studio (/studio) to verify images')
  console.log('  2. Visit /cars to see the car gallery')
  console.log('  3. Click on a car to see detail page with hero + gallery')
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')

  console.log('🚗 Bespoke Cars - Upload to Existing Cars')
  console.log('==========================================')

  // Discover cars and images
  const carsMap = discoverCars()

  if (carsMap.size === 0) {
    console.error('\nNo cars with valid mappings found.')
    process.exit(1)
  }

  if (isDryRun) {
    await dryRun(carsMap)
  } else {
    await uploadImages(carsMap)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

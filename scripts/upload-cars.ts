/**
 * Upload Cars Script
 *
 * Uploads car images to Sanity and creates car documents.
 *
 * Usage:
 *   npx tsx scripts/upload-cars.ts /path/to/images-folder
 *
 * Folder structure expected:
 *   /images-folder
 *     /bentley-continental
 *       01.jpg
 *       02.jpg
 *     /lamborghini-huracan
 *       01.jpg
 *       02.jpg
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

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

function folderNameToCarName(folderName: string): string {
  // Convert folder name like "bentley-continental-gt" to "Bentley Continental GT"
  return folderName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function folderNameToSlug(folderName: string): string {
  // Ensure consistent slug format
  return folderName.toLowerCase().replace(/\s+/g, '-')
}

interface UploadedImage {
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
}

async function uploadImage(
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

interface CarDocument {
  _type: 'car'
  name: string
  slug: { _type: 'slug'; current: string }
  images: UploadedImage[]
}

async function processCarFolder(folderPath: string): Promise<CarDocument | null> {
  const folderName = path.basename(folderPath)
  const carName = folderNameToCarName(folderName)
  const slug = folderNameToSlug(folderName)

  console.log(`\n📁 Processing: ${carName}`)

  // Get all image files in the folder
  const files = fs.readdirSync(folderPath).filter(isImageFile).sort()

  if (files.length === 0) {
    console.log('  ⚠ No images found, skipping')
    return null
  }

  console.log(`  Found ${files.length} images`)

  // Upload all images
  const images: UploadedImage[] = []
  for (const file of files) {
    const filePath = path.join(folderPath, file)
    console.log(`  ↑ Uploading ${file}...`)
    const uploaded = await uploadImage(filePath, file)
    if (uploaded) {
      images.push(uploaded)
      console.log(`  ✓ Uploaded ${file}`)
    }
  }

  if (images.length === 0) {
    console.log('  ✗ No images uploaded successfully')
    return null
  }

  return {
    _type: 'car',
    name: carName,
    slug: { _type: 'slug', current: slug },
    images,
  }
}

async function createCarDocument(car: CarDocument): Promise<string | null> {
  try {
    // Check if a car with this slug already exists
    const existing = await client.fetch(
      `*[_type == "car" && slug.current == $slug][0]._id`,
      { slug: car.slug.current }
    )

    if (existing) {
      // Update existing document
      console.log(`  ↻ Updating existing car: ${car.name}`)
      const updated = await client
        .patch(existing)
        .set({ images: car.images })
        .commit()
      return updated._id
    } else {
      // Create new document
      console.log(`  + Creating new car: ${car.name}`)
      const created = await client.create(car)
      return created._id
    }
  } catch (error) {
    console.error(`  ✗ Failed to create/update car ${car.name}:`, error)
    return null
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/upload-cars.ts /path/to/images-folder')
    console.log('')
    console.log('Expected folder structure:')
    console.log('  /images-folder')
    console.log('    /bentley-continental')
    console.log('      01.jpg')
    console.log('      02.jpg')
    console.log('    /lamborghini-huracan')
    console.log('      01.jpg')
    process.exit(1)
  }

  const basePath = args[0]

  if (!fs.existsSync(basePath)) {
    console.error(`Folder not found: ${basePath}`)
    process.exit(1)
  }

  const stat = fs.statSync(basePath)
  if (!stat.isDirectory()) {
    console.error(`Not a directory: ${basePath}`)
    process.exit(1)
  }

  console.log('🚗 Bespoke Cars - Image Upload Script')
  console.log('=====================================')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Source: ${basePath}`)

  // Get all subdirectories
  const entries = fs.readdirSync(basePath, { withFileTypes: true })
  const carFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(basePath, entry.name))

  if (carFolders.length === 0) {
    console.error('\nNo car folders found. Expected subdirectories like:')
    console.error('  bentley-continental/')
    console.error('  lamborghini-huracan/')
    process.exit(1)
  }

  console.log(`\nFound ${carFolders.length} car folders`)

  const results = {
    created: [] as string[],
    updated: [] as string[],
    failed: [] as string[],
  }

  for (const folderPath of carFolders) {
    const car = await processCarFolder(folderPath)

    if (car) {
      const id = await createCarDocument(car)
      if (id) {
        const folderName = path.basename(folderPath)
        // Check if it was an update or create
        const existing = await client.fetch(
          `*[_type == "car" && slug.current == $slug][0]{ name }`,
          { slug: car.slug.current }
        )
        if (existing) {
          results.updated.push(car.name)
        } else {
          results.created.push(car.name)
        }
      } else {
        results.failed.push(path.basename(folderPath))
      }
    } else {
      results.failed.push(path.basename(folderPath))
    }
  }

  console.log('\n=====================================')
  console.log('📊 Summary')
  console.log('=====================================')

  if (results.created.length > 0) {
    console.log(`\n✓ Created (${results.created.length}):`)
    results.created.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.updated.length > 0) {
    console.log(`\n↻ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed (${results.failed.length}):`)
    results.failed.forEach((name) => console.log(`  - ${name}`))
  }

  console.log('\n✅ Done!')
  console.log('Next steps:')
  console.log('  1. Open Sanity Studio (/studio) to review uploaded cars')
  console.log('  2. Add descriptions, categories, and featured flags')
  console.log('  3. Visit /cars to see the results')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

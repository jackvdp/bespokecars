/**
 * Upload Brand Logos to Cars
 *
 * Uploads brand logo files to Sanity and assigns them to every car matching
 * that brand's slug prefix. Each logo is uploaded once and referenced by all
 * cars of that brand.
 *
 * Usage:
 *   npx tsx scripts/upload-logos.ts                          # Upload logos
 *   npx tsx scripts/upload-logos.ts --dry-run                # Preview without uploading
 *   npx tsx scripts/upload-logos.ts --force --only bmw,porsche  # Re-upload specific brands
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

const LOGOS_PATH = 'imagesToUpload/carslogos'

// Logo filename → slug prefix for matching cars
const LOGO_TO_BRAND_PREFIX: Record<string, string> = {
  'audi.avif': 'audi-',
  'bentley.avif': 'bentley-',
  'bugatti.webp': 'bugatti-',
  'ferrari.webp': 'ferrari-',
  'lambo.avif': 'lamborghini-',
  'mercesdes.webp': 'mercedes-',
  'rangerover.webp': 'range-rover-',
  'rollsroyce.webp': 'rolls-royce-',
  'BMW.png': 'bmw-',
  'porsche.png': 'porsche-',
  'chrysler.png': 'chrysler-',
  'Lincoln.png': 'lincoln-',
}

interface SanityCar {
  _id: string
  name: string
  slug: string
  hasLogo: boolean
}

async function fetchCarsByPrefix(
  client: SanityClient,
  prefix: string
): Promise<SanityCar[]> {
  return client.fetch(
    `*[_type == "car" && slug.current match $prefix + "*"]{
      _id,
      name,
      "slug": slug.current,
      "hasLogo": defined(logo.asset)
    } | order(slug asc)`,
    { prefix }
  )
}

async function uploadLogo(
  client: SanityClient,
  filePath: string,
  filename: string
): Promise<string | null> {
  try {
    const buffer = fs.readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, { filename })
    return asset._id
  } catch (error) {
    console.error(`  ✗ Failed to upload ${filename}:`, error)
    return null
  }
}

async function dryRun(client: SanityClient | null): Promise<void> {
  console.log('\n🔍 DRY RUN - Preview of logo assignments')
  console.log('==========================================\n')

  let totalCars = 0
  let totalToUpdate = 0
  let totalSkipped = 0
  const unmatchedBrands: string[] = []

  for (const [filename, prefix] of Object.entries(LOGO_TO_BRAND_PREFIX)) {
    const filePath = path.join(LOGOS_PATH, filename)
    const exists = fs.existsSync(filePath)

    console.log(`📁 ${filename} → slug prefix "${prefix}"`)

    if (!exists) {
      console.log(`  ✗ Logo file not found!\n`)
      continue
    }

    if (!client) {
      console.log(`  (Sanity client unavailable — cannot fetch cars)\n`)
      continue
    }

    const cars = await fetchCarsByPrefix(client, prefix)

    if (cars.length === 0) {
      console.log(`  ⚠ No cars found with this prefix`)
      unmatchedBrands.push(filename)
    } else {
      let brandToUpdate = 0
      let brandSkipped = 0
      for (const car of cars) {
        if (car.hasLogo) {
          console.log(`  ⏭ ${car.name} (${car.slug}) — already has logo`)
          brandSkipped++
        } else {
          console.log(`  ✓ ${car.name} (${car.slug})`)
          brandToUpdate++
        }
      }
      totalCars += cars.length
      totalToUpdate += brandToUpdate
      totalSkipped += brandSkipped
    }

    console.log('')
  }

  console.log('==========================================')
  console.log('📊 Summary')
  console.log('==========================================')
  console.log(`Brands with logos: ${Object.keys(LOGO_TO_BRAND_PREFIX).length}`)
  if (client) {
    console.log(`Total cars matched: ${totalCars}`)
    console.log(`Cars to update (no logo): ${totalToUpdate}`)
    console.log(`Cars to skip (have logo): ${totalSkipped}`)
    if (unmatchedBrands.length > 0) {
      console.log(`\n⚠ Logos with no matching cars:`)
      unmatchedBrands.forEach((b) => console.log(`  - ${b}`))
    }
  }
  console.log('\nRun without --dry-run to upload logos.')
}

async function uploadLogos(client: SanityClient, force: boolean, onlyPrefixes: string[] | null): Promise<void> {
  console.log('\n🚗 Uploading Brand Logos to Cars')
  console.log('=================================')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  if (force) console.log(`Mode: --force (overwrite existing logos)`)
  if (onlyPrefixes) console.log(`Filter: --only ${onlyPrefixes.join(', ')}`)
  console.log('')

  const results = {
    updated: [] as string[],
    skipped: [] as string[],
    noMatch: [] as string[],
    failed: [] as string[],
    logosUploaded: 0,
  }

  for (const [filename, prefix] of Object.entries(LOGO_TO_BRAND_PREFIX)) {
    // Skip brands not in --only filter
    if (onlyPrefixes && !onlyPrefixes.some((o) => prefix.startsWith(o))) {
      continue
    }

    const filePath = path.join(LOGOS_PATH, filename)

    if (!fs.existsSync(filePath)) {
      console.log(`✗ Logo file not found: ${filename}`)
      results.failed.push(filename)
      continue
    }

    console.log(`\n📁 ${filename} → "${prefix}"`)

    // Fetch all cars for this brand
    const cars = await fetchCarsByPrefix(client, prefix)

    if (cars.length === 0) {
      console.log(`  ⚠ No cars found`)
      results.noMatch.push(filename)
      continue
    }

    // Filter to cars that need a logo (or all cars if --force)
    const carsToUpdate = force ? cars : cars.filter((c) => !c.hasLogo)
    const carsToSkip = force ? [] : cars.filter((c) => c.hasLogo)

    for (const car of carsToSkip) {
      console.log(`  ⏭ ${car.name} — already has logo`)
      results.skipped.push(car.name)
    }

    if (carsToUpdate.length === 0) {
      console.log(`  All cars already have logos`)
      continue
    }

    // Upload logo once for this brand
    console.log(`  ↑ Uploading ${filename}...`)
    const assetId = await uploadLogo(client, filePath, filename)

    if (!assetId) {
      for (const car of carsToUpdate) {
        results.failed.push(car.name)
      }
      continue
    }

    results.logosUploaded++
    console.log(`  ✓ Uploaded (${assetId})`)

    // Patch each car with a reference to the same asset
    for (const car of carsToUpdate) {
      try {
        await client
          .patch(car._id)
          .set({
            logo: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: assetId,
              },
            },
          })
          .commit()
        console.log(`  ✓ ${car.name} (${car.slug})`)
        results.updated.push(car.name)
      } catch (error) {
        console.error(`  ✗ Failed to patch ${car.name}:`, error)
        results.failed.push(car.name)
      }
    }
  }

  // Summary
  console.log('\n=================================')
  console.log('📊 Summary')
  console.log('=================================')

  if (results.updated.length > 0) {
    console.log(`\n✓ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.skipped.length > 0) {
    console.log(`\n⏭ Skipped — already have logos (${results.skipped.length}):`)
    results.skipped.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.noMatch.length > 0) {
    console.log(`\n⚠ No matching cars (${results.noMatch.length}):`)
    results.noMatch.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed (${results.failed.length}):`)
    results.failed.forEach((name) => console.log(`  - ${name}`))
  }

  console.log(`\n📸 Logos uploaded: ${results.logosUploaded}`)
  console.log(`🚗 Cars updated: ${results.updated.length}`)
  console.log('\n✅ Done!')
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const force = args.includes('--force')

  // Parse --only bmw,porsche → ['bmw-', 'porsche-']
  const onlyIndex = args.indexOf('--only')
  const onlyPrefixes = onlyIndex !== -1 && args[onlyIndex + 1]
    ? args[onlyIndex + 1].split(',').map((s) => s.trim().toLowerCase() + '-')
    : null

  console.log('🚗 Bespoke Cars - Upload Brand Logos')
  console.log('=====================================')

  if (!fs.existsSync(LOGOS_PATH)) {
    console.error(`Logo folder not found: ${LOGOS_PATH}`)
    process.exit(1)
  }

  if (isDryRun) {
    let client: SanityClient | null = null
    if (projectId && dataset && token) {
      client = createClient({
        projectId,
        dataset,
        apiVersion: '2026-01-10',
        useCdn: false,
        token,
      })
    }
    await dryRun(client)
  } else {
    if (!projectId || !dataset) {
      console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
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

    await uploadLogos(client, force, onlyPrefixes)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

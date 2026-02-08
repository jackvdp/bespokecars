/**
 * Upload Car Prices from CSV
 *
 * Parses imagesToUpload/carprices.csv and patches priceDaily, priceWeekend,
 * and priceWeekly fields on matching Sanity car documents.
 *
 * Usage:
 *   npx tsx scripts/upload-prices.ts              # Upload prices
 *   npx tsx scripts/upload-prices.ts --dry-run    # Preview without patching
 *
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with Editor permissions
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient, type SanityClient } from '@sanity/client'
import * as fs from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

const CSV_PATH = 'imagesToUpload/carprices.csv'

// CSV car name → Sanity slug(s)
const NAME_TO_SLUGS: Record<string, string[]> = {
  'Audi Q7 (7 seater)': ['audi-q7-limo', 'audi-q7-quattro'],
  'BMW X5 (7 seater)': ['bmw-x5-m-sport'],
  'Mercedes S Class (2020)': ['mercedes-benz-s-class'],
  // 'Mercedes S Class (New)' — no matching car in CMS, skipped
  'Range Rover Sport (New)': ['range-rover-sport-svr'],
  'Range Rover Vogue (New)': ['range-rover-2023'],
  'Range Rover SVR': ['range-rover-sport-svr'],
  'Audi RS6': ['audi-rs6'],
  'BMW M3 Touring': ['bmw-m3-touring-competition'],
  'BMW X5-M (Facelift)': ['bmw-x5m'],
  'Range Rover SV (2024)': ['range-rover-sport-sv'],
  'Mercedes G63': ['mercedes-g63'],
  'Audi R8 Spyder': ['audi-r8-spyder'],
  'Bentley Bentayga S': ['bentley-bentayga-s'],
  'Rolls Royce Ghost Black Badge': ['rolls-royce-black-badge'],
  'New Rolls Royce Ghost (Blue)': ['rolls-royce-ghost'],
  'Rolls Royce Cullinan': ['rolls-royce-cullinan'],
  'Lamborghini Urus': ['lamborghini-urus'],
  'Lamborghini Urus S': ['lamborghini-urus-s'],
  'Lamborghini Urus Performante': ['lamborghini-urus-performante'],
  'Porsche 911 Turbo S - Coupe': ['porsche-911-turbo-s'],
  'Porsche 911 Turbo S- Cab': ['porsche-911-turbo-s-black'],
  'Huracan Performante Spyder': ['lamborghini-huracan-performante'],
  'Huracan Spyder EVO': ['lamborghini-huracan-evo-spyder'],
  'Lamborghini Huracan STO': ['lamborghini-huracan-sto'],
  'Ferrari F8 Spider': ['ferrari-f8-spyder'],
  'Lamborghini Aventador S Roadster': ['lamborghini-aventador-s-roadster'],
  'Lamborghini SV Coupe': ['lamborghini-aventador-svj-coupe'],
  'Lamborghini SVJ Roadster': ['lamborghini-aventador-svj-roadster'],
  'Lamborghini Revuelto': ['lamborghini-revuelto'],
  'Ferrari SF90 Spider': ['ferrari-sf90-stradale'],
  'Ferrari Purosangue': ['ferrari-purosangue'],
  'Porsche GT3 RS': ['porsche-gt3-rs'],
}

interface CsvRow {
  name: string
  priceDaily: number
  priceWeekend: number
  priceWeekly: number
}

function parsePrice(raw: string): number {
  // Strip £, €, commas, quotes, whitespace
  const cleaned = raw.replace(/[£€,"\s]/g, '')
  const num = parseInt(cleaned, 10)
  if (isNaN(num)) {
    throw new Error(`Cannot parse price: "${raw}"`)
  }
  return num
}

function parseCsv(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter((l) => l.trim())

  // Skip header row
  const rows: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    // Parse CSV respecting quoted fields
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    fields.push(current.trim())

    const [name, daily, weekend, weekly] = fields

    // Skip section headers (empty price columns)
    if (!daily || !weekend || !weekly) {
      continue
    }

    rows.push({
      name,
      priceDaily: parsePrice(daily),
      priceWeekend: parsePrice(weekend),
      priceWeekly: parsePrice(weekly),
    })
  }

  return rows
}

async function fetchCarBySlug(
  client: SanityClient,
  slug: string
): Promise<{ _id: string; name: string; slug: string } | null> {
  return client.fetch(
    `*[_type == "car" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current
    }`,
    { slug }
  )
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')

  console.log('🚗 Bespoke Cars - Upload Prices from CSV')
  console.log('==========================================')

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found: ${CSV_PATH}`)
    process.exit(1)
  }

  // Parse CSV
  const rows = parseCsv(CSV_PATH)
  console.log(`Parsed ${rows.length} car entries from CSV\n`)

  if (isDryRun) {
    console.log('🔍 DRY RUN - Preview of price uploads\n')
  }

  // Build client (not needed for basic dry run parsing preview, but needed for slug lookups)
  let client: SanityClient | null = null
  if (projectId && dataset && token) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: '2026-01-10',
      useCdn: false,
      token,
    })
  } else if (!isDryRun) {
    if (!projectId || !dataset) {
      console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
      process.exit(1)
    }
    if (!token) {
      console.error('Missing SANITY_API_TOKEN - add it to .env.local')
      process.exit(1)
    }
  }

  const results = {
    updated: [] as string[],
    skipped: [] as string[],
    notMapped: [] as string[],
    notFound: [] as string[],
    failed: [] as string[],
  }

  // Track which slugs have been updated so later CSV rows for the same slug win
  const updatedSlugs = new Set<string>()

  for (const row of rows) {
    const slugs = NAME_TO_SLUGS[row.name]

    if (!slugs) {
      console.log(`⏭ ${row.name} — no slug mapping, skipping`)
      results.notMapped.push(row.name)
      continue
    }

    console.log(`\n📋 ${row.name} → £${row.priceDaily}/£${row.priceWeekend}/£${row.priceWeekly}`)

    for (const slug of slugs) {
      // If a previous CSV row already set prices for this slug, skip
      // (later entries override earlier ones by design — "Range Rover SVR" overrides "Range Rover Sport (New)")
      // We process all rows but let the last one win

      if (isDryRun) {
        if (client) {
          const car = await fetchCarBySlug(client, slug)
          if (car) {
            console.log(`  ✓ ${slug} → ${car.name} (${car._id})`)
          } else {
            console.log(`  ✗ ${slug} — not found in Sanity`)
            results.notFound.push(slug)
          }
        } else {
          console.log(`  → ${slug} (Sanity client unavailable — cannot verify)`)
        }
        continue
      }

      // Live mode
      if (!client) continue

      const car = await fetchCarBySlug(client, slug)
      if (!car) {
        console.log(`  ✗ ${slug} — not found in Sanity`)
        results.notFound.push(slug)
        continue
      }

      try {
        await client
          .patch(car._id)
          .set({
            priceDaily: row.priceDaily,
            priceWeekend: row.priceWeekend,
            priceWeekly: row.priceWeekly,
          })
          .commit()
        console.log(`  ✓ ${car.name} (${slug}) — updated`)
        updatedSlugs.add(slug)
        results.updated.push(`${car.name} (${slug})`)
      } catch (error) {
        console.error(`  ✗ ${car.name} (${slug}) — failed:`, error)
        results.failed.push(`${car.name} (${slug})`)
      }
    }
  }

  // Summary
  console.log('\n==========================================')
  console.log('📊 Summary')
  console.log('==========================================')

  if (results.updated.length > 0) {
    console.log(`\n✓ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.notMapped.length > 0) {
    console.log(`\n⏭ No slug mapping (${results.notMapped.length}):`)
    results.notMapped.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.notFound.length > 0) {
    console.log(`\n⚠ Slug not found in Sanity (${results.notFound.length}):`)
    results.notFound.forEach((slug) => console.log(`  - ${slug}`))
  }

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed (${results.failed.length}):`)
    results.failed.forEach((name) => console.log(`  - ${name}`))
  }

  if (isDryRun) {
    console.log('\nRun without --dry-run to upload prices.')
  } else {
    console.log(`\n🚗 Cars updated: ${results.updated.length}`)
    console.log('\n✅ Done!')
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

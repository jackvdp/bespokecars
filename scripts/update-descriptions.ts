/**
 * Update Car Descriptions from CSV
 *
 * Reads car descriptions from the old Framer site CSV and updates
 * the corresponding Sanity car documents.
 *
 * Usage:
 *   npx tsx scripts/update-descriptions.ts           # Update descriptions
 *   npx tsx scripts/update-descriptions.ts --dry-run  # Preview without updating
 *
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with Editor permissions
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient, type SanityClient } from '@sanity/client'
import * as fs from 'fs'

// Load environment variables from .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

const CSV_PATH = 'imagesToUpload/Cars copy.csv'

interface CsvRow {
  slug: string
  description: string
}

/**
 * Parse a CSV file with quoted fields that may contain newlines.
 * Returns an array of rows, each as an array of field values.
 */
function parseCsv(content: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false
  let i = 0

  while (i < content.length) {
    const char = content[i]

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote ("")
        if (i + 1 < content.length && content[i + 1] === '"') {
          currentField += '"'
          i += 2
          continue
        }
        // End of quoted field
        inQuotes = false
        i++
        continue
      }
      currentField += char
      i++
    } else {
      if (char === '"') {
        inQuotes = true
        i++
      } else if (char === ',') {
        currentRow.push(currentField)
        currentField = ''
        i++
      } else if (char === '\n' || (char === '\r' && i + 1 < content.length && content[i + 1] === '\n')) {
        currentRow.push(currentField)
        currentField = ''
        rows.push(currentRow)
        currentRow = []
        i += char === '\r' ? 2 : 1
      } else if (char === '\r') {
        currentRow.push(currentField)
        currentField = ''
        rows.push(currentRow)
        currentRow = []
        i++
      } else {
        currentField += char
        i++
      }
    }
  }

  // Push last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  return rows
}

function loadCsvData(): CsvRow[] {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found: ${CSV_PATH}`)
    process.exit(1)
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCsv(content)

  if (rows.length === 0) {
    console.error('CSV file is empty')
    process.exit(1)
  }

  // Find column indices from header row
  const headers = rows[0].map((h) => h.trim().toLowerCase())
  const slugIndex = headers.indexOf('slug')
  const descriptionIndex = headers.indexOf('description')

  if (slugIndex === -1 || descriptionIndex === -1) {
    console.error('CSV must have "Slug" and "description" columns')
    console.error(`Found columns: ${rows[0].join(', ')}`)
    process.exit(1)
  }

  const data: CsvRow[] = []
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const slug = row[slugIndex]?.trim()
    const description = row[descriptionIndex]?.trim()

    if (!slug) continue

    data.push({ slug, description: description || '' })
  }

  return data
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')

  console.log('🚗 Bespoke Cars - Update Descriptions from CSV')
  console.log('================================================')

  // Load CSV data
  const csvRows = loadCsvData()
  console.log(`Found ${csvRows.length} cars in CSV`)

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

  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log('')

  const results = {
    updated: [] as string[],
    notFound: [] as string[],
    noDescription: [] as string[],
    failed: [] as string[],
  }

  for (const { slug, description } of csvRows) {
    // Skip rows with no description
    if (!description) {
      console.log(`⏭ ${slug} — no description in CSV, skipping`)
      results.noDescription.push(slug)
      continue
    }

    // Look up the car in Sanity
    const car = await client.fetch(
      `*[_type == "car" && slug.current == $slug][0]{ _id, name, description }`,
      { slug }
    )

    if (!car) {
      console.log(`✗ ${slug} — not found in Sanity`)
      results.notFound.push(slug)
      continue
    }

    if (isDryRun) {
      const preview = description.substring(0, 80).replace(/\n/g, ' ')
      console.log(`✓ ${car.name} (${slug})`)
      console.log(`  "${preview}..."`)
    } else {
      try {
        await client.patch(car._id).set({ description }).commit()
        console.log(`✓ ${car.name} (${slug}) — description updated`)
        results.updated.push(car.name)
      } catch (error) {
        console.error(`✗ ${car.name} (${slug}) — failed:`, error)
        results.failed.push(car.name)
      }
    }
  }

  // Summary
  console.log('\n================================================')
  console.log('📊 Summary')
  console.log('================================================')

  if (isDryRun) {
    const matched = csvRows.length - results.notFound.length - results.noDescription.length
    console.log(`\nMatched in Sanity: ${matched}`)
  }

  if (results.updated.length > 0) {
    console.log(`\n✓ Updated (${results.updated.length}):`)
    results.updated.forEach((name) => console.log(`  - ${name}`))
  }

  if (results.noDescription.length > 0) {
    console.log(`\n⏭ Skipped — no description (${results.noDescription.length}):`)
    results.noDescription.forEach((slug) => console.log(`  - ${slug}`))
  }

  if (results.notFound.length > 0) {
    console.log(`\n✗ Not found in Sanity (${results.notFound.length}):`)
    results.notFound.forEach((slug) => console.log(`  - ${slug}`))
  }

  if (results.failed.length > 0) {
    console.log(`\n✗ Failed (${results.failed.length}):`)
    results.failed.forEach((name) => console.log(`  - ${name}`))
  }

  if (isDryRun) {
    console.log('\nRun without --dry-run to apply updates.')
  } else {
    console.log('\n✅ Done!')
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

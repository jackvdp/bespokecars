import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Write client with token for mutations (uploading images, creating documents)
// IMPORTANT: Never expose this client to the browser - server-side only
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_API_TOKEN,
})

import { client } from '@/sanity/lib/client'
import HomeContent from './HomeContent'

async function getCars() {
  const carIds = [
    'ff74d446-31e5-4fdc-b39a-2c83741e596e',
    '5f259e8a-5e3b-4849-b07b-a5dc72f90c5e',
    '8c75ced5-17b3-45cb-a969-2bab53f10f5f',
    '08998623-64f6-40f0-93e5-59c60b1b29d7',
    '5bf96dbc-649f-4867-8888-9e0ca27fa536',
    'cd7a87c8-703f-4a0a-b0b5-ae6ff7728dc8'
  ]
  
  return client.fetch(`
    *[_type == "car" && _id in $ids] {
      _id,
      name,
      slug,
      category->{ title },
      logoUrl,
      imageUrls
    }
  `, { ids: carIds })
}

export default async function Home() {
  const cars = await getCars()

  return <HomeContent cars={cars} />
}

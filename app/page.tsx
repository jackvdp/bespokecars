import { client } from '@/sanity/lib/client'
import HomeContent from './HomeContent'

async function getCars() {
  return client.fetch(`
    *[_type == "car" && defined(imageUrls[0])] | order(_createdAt desc) [0...6] {
      _id,
      name,
      slug,
      category->{ title },
      logoUrl,
      imageUrls
    }
  `)
}

export default async function Home() {
  const cars = await getCars()

  return <HomeContent cars={cars} />
}

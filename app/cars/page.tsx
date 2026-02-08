import { client } from '@/sanity/lib/client'
import CarsContent from './CarsContent'

async function getCars() {
  return client.fetch(`
    *[_type == "car"] | order(name asc) {
      _id,
      name,
      slug,
      category->{ title, slug },
      logo,
      images
    }
  `)
}

async function getCategories() {
  return client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug
    }
  `)
}

export default async function CarsPage() {
  const [cars, categories] = await Promise.all([getCars(), getCategories()])

  return <CarsContent cars={cars} categories={categories} />
}

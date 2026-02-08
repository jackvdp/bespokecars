import { client } from '@/sanity/lib/client'
import CarsContent from './CarsContent'

async function getCars() {
  return client.fetch(`
    *[_type == "car"] {
      _id,
      name,
      slug,
      category->{ title, slug },
      logo,
      images,
      priceDaily,
      "hasImages": count(images) > 0
    } | order(hasImages asc, name asc)
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

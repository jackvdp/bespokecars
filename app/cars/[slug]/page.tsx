import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import CarDetailContent from './CarDetailContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCar(slug: string) {
  return client.fetch(`
    *[_type == "car" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      category->{ title, slug },
      logoUrl,
      imageUrls
    }
  `, { slug })
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params
  const car = await getCar(slug)

  if (!car) {
    notFound()
  }

  return <CarDetailContent car={car} />
}

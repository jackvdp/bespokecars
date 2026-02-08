'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import PrimaryButton from '@/components/PrimaryButton'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface Car {
  _id: string
  name: string
  slug: { current: string }
  description: string | null
  category: { title: string; slug: { current: string } } | null
  logo: SanityImageSource | null
  images: SanityImageSource[] | null
}

interface CarDetailContentProps {
  car: Car
}

export default function CarDetailContent({ car }: CarDetailContentProps) {
  const images = car.images || []
  const heroImage = images[0] ? urlFor(images[0]).width(1920).height(1080).url() : undefined
  const logoUrl = car.logo ? urlFor(car.logo).width(200).height(200).url() : undefined
  const galleryImages = images.slice(1, 5) // Get images 2-5 for gallery

  const defaultDescription = `Experience the ultimate in luxury and performance with the ${car.name}. This exceptional vehicle combines stunning design with exhilarating power, making every journey an unforgettable experience.`

  return (
    <main className="bg-[var(--background)]">
      <Navbar />

      <PageHero
        label={car.category?.title || 'Luxury Vehicle'}
        title={car.name}
        description={car.description || defaultDescription}
        buttonText="Book Now"
        buttonHref="/contact"
        backgroundImage={heroImage}
        backgroundAlt={car.name}
        logoUrl={logoUrl}
      />

      {/* Description Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-[800px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-6">
              {car.name}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {car.description || defaultDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="relative pb-32 px-6">
          <div className="max-w-[1200px] mx-auto relative z-10">
            {/* Large Image */}
            {galleryImages[0] && (
              <motion.div
                className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={urlFor(galleryImages[0]).width(1680).height(720).url()}
                  alt={`${car.name} gallery 1`}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Three Images Row */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryImages.slice(1, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={urlFor(image).width(560).height(420).url()}
                      alt={`${car.name} gallery ${index + 2}`}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-4">
              Ready to experience the {car.name}?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Contact us today to book this exceptional vehicle for your next event.
            </p>
            <PrimaryButton href="/contact" size="large">
              Get in Touch
            </PrimaryButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

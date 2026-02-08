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
  priceDaily: number | null
  priceWeekend: number | null
  priceWeekly: number | null
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

      {heroImage ? (
        <PageHero
          label={car.category?.title || 'Luxury Vehicle'}
          title={car.name}
          description=""
          buttonText="Book Now"
          buttonHref="/contact"
          backgroundImage={heroImage}
          backgroundAlt={car.name}
          logoUrl={logoUrl}
        />
      ) : (
        <section style={{ position: 'relative', paddingTop: '160px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="max-w-[1200px] mx-auto text-center">
            {logoUrl && (
              <motion.div
                className="mx-auto mb-8 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={logoUrl}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            )}
            <motion.span
              className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-6 block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {car.category?.title || 'Luxury Vehicle'}
            </motion.span>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {car.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PrimaryButton href="/contact" size="large">
                Book Now
              </PrimaryButton>
            </motion.div>
          </div>
        </section>
      )}

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

      {/* Pricing Section */}
      {(car.priceDaily || car.priceWeekend || car.priceWeekly) && (
        <section style={{ position: 'relative', padding: '0 24px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '40px',
                overflow: 'hidden',
              }}
            >
              {/* Cyan accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '40px',
                right: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                opacity: 0.6,
              }} />

              {/* Price columns */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0',
                flexWrap: 'wrap',
              }}>
                {/* Daily */}
                {car.priceDaily && (
                  <>
                    <div style={{
                      flex: '1 1 200px',
                      textAlign: 'center',
                      padding: '16px 24px',
                    }}>
                      <p style={{
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px',
                      }}>
                        Daily (Mon–Thu)
                      </p>
                      <p style={{
                        color: 'var(--foreground)',
                        fontSize: '34px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        letterSpacing: '-0.02em',
                      }}>
                        £{car.priceDaily.toLocaleString()}
                      </p>
                    </div>
                    {(car.priceWeekend || car.priceWeekly) && (
                      <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                        opacity: 0.5,
                        flexShrink: 0,
                      }} />
                    )}
                  </>
                )}

                {/* Weekend */}
                {car.priceWeekend && (
                  <>
                    <div style={{
                      flex: '1 1 200px',
                      textAlign: 'center',
                      padding: '16px 24px',
                    }}>
                      <p style={{
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px',
                      }}>
                        Weekend
                      </p>
                      <p style={{
                        color: 'var(--foreground)',
                        fontSize: '34px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        letterSpacing: '-0.02em',
                      }}>
                        £{car.priceWeekend.toLocaleString()}
                      </p>
                    </div>
                    {car.priceWeekly && (
                      <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                        opacity: 0.5,
                        flexShrink: 0,
                      }} />
                    )}
                  </>
                )}

                {/* Weekly */}
                {car.priceWeekly && (
                  <div style={{
                    flex: '1 1 200px',
                    textAlign: 'center',
                    padding: '16px 24px',
                  }}>
                    <p style={{
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      fontFamily: 'var(--font-body)',
                      marginBottom: '12px',
                    }}>
                      Full Week
                    </p>
                    <p style={{
                      color: 'var(--foreground)',
                      fontSize: '34px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-title)',
                      letterSpacing: '-0.02em',
                    }}>
                      £{car.priceWeekly.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                marginTop: '24px',
              }}>
                Prices are indicative. Contact us for a personalised quote.
              </p>
            </motion.div>
          </div>
        </section>
      )}

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

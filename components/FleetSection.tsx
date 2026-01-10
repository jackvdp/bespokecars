'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import SectionBackground from './SectionBackground'
import PrimaryButton from './PrimaryButton'

interface Car {
  _id: string
  name: string
  slug: { current: string }
  category: { title: string } | null
  logoUrl: string | null
  imageUrls: string[] | null
}

interface FleetSectionProps {
  cars: Car[]
}

export default function FleetSection({ cars }: FleetSectionProps) {
  return (
    <section
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <SectionBackground glowPosition="top" gridFadeDirection="both" />

      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '80px',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              marginBottom: '16px',
            }}
          >
            Explore Our Fleet
          </p>
          <h2
            style={{
              color: 'var(--foreground)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              fontFamily: 'var(--font-title)',
              letterSpacing: '-0.02em',
            }}
          >
            Find your luxury car
          </h2>
        </motion.div>

        {/* Car Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {cars.map((car, index) => (
            <motion.a
              key={car._id}
              href={`/cars/${car.slug.current}`}
              style={{
                position: 'relative',
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--primary)',
                transition: { duration: 0.3 },
              }}
            >
              {/* Car Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  backgroundColor: '#1a1a1a',
                  overflow: 'hidden',
                }}
              >
                {car.imageUrls && car.imageUrls[0] ? (
                  <Image
                    src={car.imageUrls[0]}
                    alt={car.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.3)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              {/* Car Info */}
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {/* Brand Logo */}
                {car.logoUrl && (
                  <div
                    style={{
                      position: 'relative',
                      width: '44px',
                      height: '44px',
                      flexShrink: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '10px',
                      padding: '6px',
                    }}
                  >
                    <Image
                      src={car.logoUrl}
                      alt=""
                      fill
                      style={{ objectFit: 'contain', padding: '6px' }}
                    />
                  </div>
                )}

                {/* Name and Category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '18px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-title)',
                      marginBottom: '4px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {car.name}
                  </h3>
                  {car.category && (
                    <p
                      style={{
                        color: 'var(--primary)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                      }}
                    >
                      {car.category.title}
                    </p>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '60px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PrimaryButton href="/cars" size="large">
            See All Cars
          </PrimaryButton>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface Car {
  _id: string
  name: string
  slug: { current: string }
  category: { title: string } | null
  logo: SanityImageSource | null
  images: SanityImageSource[] | null
}

interface CarCardProps {
  car: Car
  index?: number
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.a
      href={`/cars/${car.slug.current}`}
      style={{
        position: 'relative',
        borderRadius: '24px',
        backgroundColor: 'var(--card-surface)',
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
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        backgroundColor: 'var(--card-surface-hover)',
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
          backgroundColor: 'var(--card-surface)',
          overflow: 'hidden',
        }}
      >
        {car.images && car.images[0] ? (
          <Image
            src={urlFor(car.images[0]).width(800).height(500).url()}
            alt={car.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            {/* Cyan glow */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0, 210, 200, 0.08) 0%, transparent 70%)',
              }}
            />
            {/* Logo or car name */}
            {car.logo ? (
              <div className="relative w-16 h-16 z-10 opacity-40">
                <Image
                  src={urlFor(car.logo).width(128).height(128).url()}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-contain brightness-150 grayscale"
                />
              </div>
            ) : (
              <span className="relative z-10 text-white/20 text-sm font-medium tracking-[0.1em] uppercase font-[var(--font-body)]">
                {car.name}
              </span>
            )}
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
        {car.logo && (
          <div
            style={{
              position: 'relative',
              width: '44px',
              height: '44px',
              flexShrink: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={urlFor(car.logo).width(88).height(88).url()}
              alt=""
              fill
              loading="lazy"
              sizes="44px"
              style={{ objectFit: 'cover' }}
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
  )
}

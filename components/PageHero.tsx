'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import PrimaryButton from '@/components/PrimaryButton'

interface PageHeroProps {
  label: string
  title: string
  description: string
  buttonText: string
  buttonHref?: string
  onButtonClick?: () => void
  backgroundImage?: string
  backgroundAlt?: string
  mapUrl?: string
  logoUrl?: string
}

export default function PageHero({
  label,
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  backgroundImage,
  backgroundAlt = 'Hero background',
  mapUrl,
  logoUrl,
}: PageHeroProps) {
  return (
    <section className="relative min-h-screen">
      {/* Black background with content */}
      <div className="relative z-20 pt-32 pb-48 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          {/* Logo */}
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
            {label}
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {onButtonClick ? (
              <PrimaryButton onClick={onButtonClick} size="large">
                {buttonText}
              </PrimaryButton>
            ) : (
              <PrimaryButton href={buttonHref} size="large">
                {buttonText}
              </PrimaryButton>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - Mouse */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        onClick={onButtonClick}
        whileHover={{ scale: 1.1 }}
      >
        <svg
          width="40"
          height="64"
          viewBox="0 0 40 64"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 10px var(--primary))' }}
        >
          {/* Mouse body */}
          <rect
            x="2"
            y="2"
            width="36"
            height="60"
            rx="18"
            stroke="var(--primary)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Scroll wheel - animated */}
          <motion.rect
            x="17"
            y="14"
            width="6"
            height="12"
            rx="3"
            fill="var(--primary)"
            animate={{ y: [14, 26, 14], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* Background - Map or Image */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent z-10" />
        {mapUrl ? (
          <iframe
            src={mapUrl}
            className="absolute border-0 pointer-events-none"
            style={{
              filter: 'brightness(0.7) contrast(1.1) saturate(0.8)',
              width: '100%',
              height: '100%',
              top: '15%',
              left: 0,
            }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
          />
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0">
            {/* Grid pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              }}
            />
            {/* Cyan glow */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 210, 200, 0.1) 0%, transparent 60%)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

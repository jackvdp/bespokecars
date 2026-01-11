'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import PrimaryButton from '@/components/PrimaryButton'

interface PageHeroProps {
  label: string
  title: string
  description: string
  buttonText: string
  buttonHref: string
  backgroundImage: string
  backgroundAlt?: string
}

export default function PageHero({
  label,
  title,
  description,
  buttonText,
  buttonHref,
  backgroundImage,
  backgroundAlt = 'Hero background',
}: PageHeroProps) {
  return (
    <section className="relative min-h-screen">
      {/* Black background with content */}
      <div className="relative z-20 pt-32 pb-48 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
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
            <PrimaryButton href={buttonHref} size="large">
              {buttonText}
            </PrimaryButton>
          </motion.div>
        </div>
      </div>

      {/* Gradient fade to image */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent z-10" />
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import SectionBackground from './SectionBackground'
import PrimaryButton from './PrimaryButton'
import CarCard, { Car } from './CarCard'

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
            <CarCard key={car._id} car={car} index={index} />
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

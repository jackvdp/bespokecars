'use client'

import { motion, AnimatePresence } from 'framer-motion'
import PrimaryButton from './PrimaryButton'

export interface ServiceItem {
  title: string
  description: string
}

export interface ServiceOverlayData {
  label: string
  heading: string
  services: ServiceItem[]
  startProgress: number
  endProgress: number
}

interface ServiceOverlayProps {
  data: ServiceOverlayData[]
  activeIndex: number
}

export default function ServiceOverlay({ data, activeIndex }: ServiceOverlayProps) {
  const currentData = data[activeIndex]
  
  if (!currentData) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.99 }}
          transition={{ 
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            position: 'relative',
            maxWidth: '900px',
            width: '100%',
            padding: '48px',
            borderRadius: '32px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Grid background inside card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              borderRadius: '32px',
            }}
          />
          
          {/* Top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '48px',
              right: '48px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
              opacity: 0.8,
            }}
          />

          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '200px',
              background: 'radial-gradient(ellipse, var(--primary) 0%, transparent 70%)',
              opacity: 0.1,
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p
                style={{
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '12px',
                }}
              >
                {currentData.label}
              </p>
              <h2
                style={{
                  color: 'var(--foreground)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-title)',
                  letterSpacing: '-0.02em',
                }}
              >
                {currentData.heading}
              </h2>
            </div>

            {/* Services Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
              }}
            >
              {currentData.services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.1 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <h3
                    style={{
                      color: 'var(--foreground)',
                      fontSize: '18px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-title)',
                      marginBottom: '8px',
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.5,
                    }}
                  >
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <PrimaryButton href="#services" size="medium">
                Learn More
              </PrimaryButton>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

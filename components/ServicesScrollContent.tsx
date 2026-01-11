'use client'

import { useState, useEffect } from 'react'
import { useTransform, motion, MotionValue } from 'framer-motion'
import PrimaryButton from './PrimaryButton'

interface ServiceItem {
  title: string
  description: string
}

interface ServiceCard {
  label: string
  heading: string
  services: ServiceItem[]
}

const serviceCards: ServiceCard[] = [
  {
    label: "Our Services",
    heading: "Weddings & Special Occasions",
    services: [
      {
        title: "Wedding Car Hire",
        description: "Stunning arrivals with decorated vehicles and professional chauffeurs"
      },
      {
        title: "Prom & Celebrations",
        description: "Make memories with head-turning arrivals at proms and parties"
      },
      {
        title: "Film & Photoshoots",
        description: "Camera-ready vehicles with flexible scheduling and UK-wide support"
      },
    ],
  },
  {
    label: "Our Services",
    heading: "Corporate & Executive",
    services: [
      {
        title: "Corporate Events",
        description: "Impress clients with premium vehicle displays and executive transport"
      },
      {
        title: "Chauffeur Services",
        description: "Professional drivers for business travel and VIP transportation"
      },
      {
        title: "Close Protection",
        description: "Discreet, secure transportation with trained security-cleared drivers"
      },
    ],
  },
  {
    label: "Our Services",
    heading: "Bespoke Solutions",
    services: [
      {
        title: "Custom Packages",
        description: "Tailored solutions designed around your specific requirements"
      },
      {
        title: "Vehicle Leasing",
        description: "Flexible leasing options to drive your dream car on your terms"
      },
      {
        title: "Nationwide Delivery",
        description: "Professional delivery and collection anywhere in the UK"
      },
    ],
  }
]

interface ServicesScrollContentProps {
  scrollYProgress: MotionValue<number>
}

export default function ServicesScrollContent({ scrollYProgress }: ServicesScrollContentProps) {
  const [screenWidth, setScreenWidth] = useState(1200)
  
  useEffect(() => {
    setScreenWidth(window.innerWidth)
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cardWidth = 900
  // Large gap so only one card visible at a time (full screen width between cards)
  const cardGap = screenWidth
  
  // Total width of all cards and gaps
  const totalCardsWidth = (serviceCards.length * cardWidth) + ((serviceCards.length - 1) * cardGap)
  
  // Start position: first card just off-screen to the right
  const startX = screenWidth
  // End position: last card just off-screen to the left
  const endX = -totalCardsWidth
  
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startX, endX]
  )

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          gap: `${cardGap}px`,
          x,
        }}
      >
        {serviceCards.map((card) => (
          <motion.div
            key={card.heading}
            style={{
              position: 'relative',
              width: `${cardWidth}px`,
              flexShrink: 0,
              padding: '48px',
              borderRadius: '32px',
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Grid background inside card - fades out towards bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                borderRadius: '32px',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70%)',
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
                  {card.label}
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
                  {card.heading}
                </h2>
              </div>

              {/* Services Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                }}
              >
                {card.services.map((service) => (
                  <div
                    key={service.title}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--card-surface)',
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
                  </div>
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
        ))}
      </motion.div>
    </div>
  )
}

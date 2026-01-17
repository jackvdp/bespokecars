'use client'

import {useEffect, useRef, useState} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'
import SectionBackground from './SectionBackground'
import PrimaryButton from './PrimaryButton'
import CarCard, { Car } from './CarCard'
import {contactInfo, mapEmbedUrl} from '@/lib/contactData'

interface FleetContactSectionProps {
  cars: Car[]
}

export default function FleetContactSection({ cars }: FleetContactSectionProps) {
  const sectionRef = useRef(null)
  const fleetPanelRef = useRef<HTMLDivElement>(null)
  const [screenHeight, setScreenHeight] = useState(800)
  const [screenWidth, setScreenWidth] = useState(1200)
  const [fleetPanelHeight, setFleetPanelHeight] = useState(1200)
  
  useEffect(() => {
    setScreenHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
    
    const handleResize = () => {
      setScreenHeight(window.innerHeight)
      setScreenWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    if (fleetPanelRef.current) {
      setFleetPanelHeight(fleetPanelRef.current.scrollHeight)
    }
  }, [cars])
  
  // Calculate scroll amounts
  const verticalScrollAmount = Math.max(0, fleetPanelHeight - screenHeight)
  
  // Total section height
  const totalHeight = fleetPanelHeight + screenWidth + screenHeight

  // Scroll progress for initial entry animation
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  })
  
  // Single scroll progress for the whole section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  // Initial content animations
  const fleetOpacity = useTransform(entryProgress, [0, 0.5], [0, 1])
  const fleetY = useTransform(entryProgress, [0, 0.5], [50, 0])
  
  // Calculate the proportion of scroll dedicated to vertical vs horizontal
  const horizontalStart = verticalScrollAmount / (totalHeight - screenHeight)
  
  // Vertical scroll within fleet panel (content scrolls up)
  const fleetScrollY = useTransform(
    scrollYProgress, 
    [0, horizontalStart], 
    [0, -verticalScrollAmount]
  )
  
  // Horizontal scroll movement (moves content left to reveal contact section)
  const horizontalX = useTransform(
    scrollYProgress, 
    [horizontalStart, 0.95], 
    [0, -screenWidth]
  )
  
  // Map parallax for contact section
  const mapY = useTransform(scrollYProgress, [horizontalStart, 1], ['-5%', '5%'])
  const mapScale = useTransform(scrollYProgress, [horizontalStart, 1], [1.1, 1.2])

  return (
    <section
      ref={sectionRef}
      style={{
        height: `${totalHeight}px`,
        position: 'relative',
      }}
    >
      {/* Sticky container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--background)',
        }}
      >
        {/* Horizontal scrolling container */}
        <motion.div
          style={{
            display: 'flex',
            height: '100%',
            x: horizontalX,
          }}
        >
          {/* First Panel: Fleet Section */}
          <div
            style={{
              width: '100vw',
              height: '100%',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <SectionBackground glowPosition="top" gridFadeDirection="both" />

            <motion.div
              ref={fleetPanelRef}
              style={{
                width: '100%',
                padding: '120px 24px',
                position: 'relative',
                zIndex: 1,
                y: fleetScrollY,
              }}
            >
              <motion.div
                style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  opacity: fleetOpacity,
                  y: fleetY,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '80px',
                  }}
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
                </div>

                {/* Car Grid */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {cars.map((car, index) => (
                    <CarCard key={car._id} car={car} index={index} />
                  ))}
                </div>

                {/* CTA Button */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                  <PrimaryButton href="/cars" size="large">
                    See All Cars
                  </PrimaryButton>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Second Panel: Contact Section */}
          <div
            style={{
              width: '100vw',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              clipPath: 'inset(0)',
            }}
          >
            {/* Map Background with Parallax */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-10%',
                bottom: '-10%',
                left: '10%',
                right: '-10%',
                zIndex: 0,
                y: mapY,
                scale: mapScale,
              }}
            >
              <iframe
                src={mapEmbedUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 0,
                  filter: 'grayscale(100%) invert(92%) contrast(0.9)',
                  pointerEvents: 'none',
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
              />
            </motion.div>
            
            {/* Animated Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 30% 50%, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.8) 70%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            
            {/* Gradient edges for blend - all sides */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  linear-gradient(to bottom, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%),
                  linear-gradient(to right, var(--background) 0%, transparent 30%, transparent 70%, var(--background) 100%)
                `,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            {/* Corner vignette for extra depth */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 20%, var(--background) 80%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            <div
              style={{
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
                position: 'relative',
                zIndex: 3,
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '60px',
                }}
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
                  Contact Us
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
                  Get in touch
                </h2>
              </div>

              {/* Contact Cards */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxWidth: '400px',
                }}
              >
                {contactInfo.map((info) => {
                  const CardWrapper = info.href ? motion.a : motion.div
                  return (
                    <CardWrapper
                      key={info.title}
                      href={info.href}
                      style={{
                        position: 'relative',
                        padding: '24px',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(10, 10, 10, 0.85)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        cursor: info.href ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(10, 10, 10, 0.95)',
                        borderColor: 'var(--primary)',
                        x: 10,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {/* Icon */}
                      <motion.div
                        style={{
                          color: 'var(--primary)',
                          flexShrink: 0,
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                      >
                        {info.icon}
                      </motion.div>

                      {/* Text */}
                      <div>
                        <h3
                          style={{
                            color: 'var(--foreground)',
                            fontSize: '18px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-title)',
                            marginBottom: '8px',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {info.title}
                        </h3>
                        {info.content.map((line) => (
                          <p
                            key={line}
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '14px',
                              fontFamily: 'var(--font-body)',
                              lineHeight: 1.6,
                            }}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </CardWrapper>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

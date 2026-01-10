'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import SectionBackground from './SectionBackground'
import Card from './Card'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'

const steps = [
  {
    number: '01',
    title: 'Search for a car',
    description: 'Browse our curated collection of premium vehicles for special occasions',
  },
  {
    number: '02',
    title: 'Select pick-up date',
    description: 'Choose your dates: Flexible scheduling with white-glove delivery available',
  },
  {
    number: '03',
    title: 'Book your car',
    description: 'Secure your booking: Professional service with full insurance coverage',
  },
]

const logos = [
  { src: '/images/logos/rolls.png', alt: 'Rolls Royce' },
  { src: '/images/logos/bentley.png.webp', alt: 'Bentley' },
  { src: '/images/logos/ferrari.png', alt: 'Ferrari' },
  { src: '/images/logos/benz.png.webp', alt: 'Mercedes-Benz' },
  { src: '/images/logos/range2.png', alt: 'Range Rover' },
  { src: '/images/logos/lambo.png', alt: 'Lambo' },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const [screenWidth, setScreenWidth] = useState(1200)
  
  useEffect(() => {
    setScreenWidth(window.innerWidth)
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Main scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  // Initial content animations (steps and logos slide in during first part of scroll)
  const stepsX = useTransform(scrollYProgress, [0, 0.15], ["100%", "0%"])
  const stepsOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [0, 0.5, 1])
  
  const logosX = useTransform(scrollYProgress, [0.05, 0.2], ["-100%", "0%"])
  const logosOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.2], [0, 0.5, 1])
  
  // Horizontal scroll movement (moves content left to reveal images section)
  // This happens after the initial animations complete
  const horizontalX = useTransform(scrollYProgress, [0.25, 0.85], [0, -screenWidth])

  return (
    <section
      ref={sectionRef}
      style={{
        height: '400vh', // Extra height to allow for horizontal scroll effect
        position: 'relative',
      }}
    >
      {/* Sticky container that stays in view while we scroll */}
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
        <SectionBackground glowPosition="both" gridFadeDirection="down" />
        
        {/* Horizontal scrolling container */}
        <motion.div
          style={{
            display: 'flex',
            width: '200vw', // Two "screens" worth of content
            height: '100%',
            x: horizontalX,
          }}
        >
          {/* First Panel: Steps and Logos */}
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
            }}
          >
            <motion.div 
              style={{ 
                maxWidth: '1200px', 
                width: '100%', 
                margin: '0 auto',
                x: stepsX,
                opacity: stepsOpacity,
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
                  How it Works
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
                  Follow 3 easy steps
                </h2>
              </div>

              {/* Steps */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '40px',
                }}
              >
                {steps.map((step, index) => (
                  <Card key={step.number} index={index} animateOnScroll={false}>
                    {/* Step number */}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '64px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-title)',
                        background: 'linear-gradient(180deg, var(--primary) 0%, rgba(255,255,255,0.1) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                        marginBottom: '24px',
                      }}
                    >
                      {step.number}
                    </span>

                    {/* Title */}
                    <h3
                      style={{
                        color: 'var(--foreground)',
                        fontSize: '24px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        marginBottom: '12px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '16px',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </p>
                  </Card>
                ))}
              </div>

              {/* CTA Button */}
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <PrimaryButton href="#book" size="large">
                  Book Now
                </PrimaryButton>
              </div>
            </motion.div>

            {/* Car Logos */}
            <motion.div
              style={{
                x: logosX,
                opacity: logosOpacity,
                marginTop: '60px',
                width: '100%',
                maxWidth: '1200px',
              }}
            >
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  marginBottom: '30px',
                }}
              >
                Featuring brands you love
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '40px',
                  flexWrap: 'wrap',
                }}
              >
                {logos.map((logo, index) => (
                  <div key={logo.alt} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <motion.div
                      style={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        filter: 'grayscale(100%) brightness(1.5)',
                      }}
                      whileHover={{
                        scale: 1.15,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: 'easeOut',
                      }}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </motion.div>
                    {index < logos.length - 1 && (
                      <div
                        style={{
                          width: '1px',
                          height: '40px',
                          background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Second Panel: Featured Images and About Button */}
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
            }}
          >
            <SectionBackground glowPosition="bottom" gridFadeDirection="up" />
            
            <div
              style={{
                maxWidth: '1200px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Featured Car Images */}
              <div
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px',
                }}
              >
                {/* First Image */}
                <div
                  style={{
                    position: 'relative',
                    height: '450px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/cars/porschelondon.jpeg"
                    alt="Ferrari in London"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      left: '24px',
                      right: '24px',
                      padding: '24px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'var(--foreground)',
                        fontSize: '20px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        marginBottom: '8px',
                      }}
                    >
                      Experience luxury like never before
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.6,
                      }}
                    >
                      Our premium fleet features immaculate vehicles perfect for weddings, photoshoots, and special occasions.
                    </p>
                  </div>
                </div>

                {/* Second Image */}
                <div
                  style={{
                    position: 'relative',
                    height: '450px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/cars/bentley.jpeg"
                    alt="Bentley"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      right: '24px',
                      padding: '24px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'var(--foreground)',
                        fontSize: '20px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        marginBottom: '8px',
                      }}
                    >
                      Professional service you can trust
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.6,
                      }}
                    >
                      Full insurance coverage, convenient pickup and delivery, and personalised attention for every client.
                    </p>
                  </div>
                </div>
              </div>

              {/* About Us Button */}
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <SecondaryButton href="/about" size="large">
                  About Us
                </SecondaryButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

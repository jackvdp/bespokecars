'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

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
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "start 0.1"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  
  // Logos slide in from left (opposite direction)
  const logosX = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"])
  const logosOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0.5, 1])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.div 
        style={{ 
          maxWidth: '1200px', 
          width: '100%', 
          margin: '0 auto',
          x,
          opacity,
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
            <motion.div
              key={step.number}
              style={{
                position: 'relative',
                padding: '40px',
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'var(--primary)',
                transition: { duration: 0.3 },
              }}
            >
              {/* Glow effect on hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                  opacity: 0,
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Car Logos */}
      <motion.div
        style={{
          x: logosX,
          opacity: logosOpacity,
          marginTop: '100px',
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
            marginBottom: '40px',
          }}
        >
          Featuring brands you love
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
            flexWrap: 'wrap',
          }}
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.alt}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                opacity: 0.6,
                filter: 'grayscale(100%) brightness(2)',
                transition: 'all 0.3s ease',
              }}
              whileHover={{
                opacity: 1,
                filter: 'grayscale(0%) brightness(1)',
                scale: 1.1,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

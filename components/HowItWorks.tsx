'use client'

import { useRef } from 'react'
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
  const imagesRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "start 0.1"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  
  // Logos slide in from left (opposite direction)
  const logosX = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"])
  const logosOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 0.5, 1])
  
  // Car images scroll animation
  const { scrollYProgress: imagesScrollProgress } = useScroll({
    target: imagesRef,
    offset: ["start end", "end start"]
  })
  
  const image1X = useTransform(imagesScrollProgress, [0, 0.5], ["-100%", "0%"])
  const image1Opacity = useTransform(imagesScrollProgress, [0, 0.3], [0, 1])
  const image2X = useTransform(imagesScrollProgress, [0, 0.5], ["100%", "0%"])
  const image2Opacity = useTransform(imagesScrollProgress, [0, 0.3], [0, 1])
  const buttonY = useTransform(imagesScrollProgress, [0.1, 0.5], ["50px", "0px"])
  const buttonOpacity = useTransform(imagesScrollProgress, [0.1, 0.4], [0, 1])

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
        position: 'relative',
        zIndex: 1,
      }}
    >
      <SectionBackground glowPosition="both" gridFadeDirection="down" />

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
            <Card key={step.number} index={index}>
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
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
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
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          {logos.map((logo, index) => (
            <div key={logo.alt} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <motion.div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
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

      {/* Featured Car Images */}
      <div
        ref={imagesRef}
        style={{
          marginTop: '120px',
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px',
        }}
      >
        {/* First Image - Slides in from left */}
        <motion.div
          style={{
            position: 'relative',
            height: '500px',
            borderRadius: '24px',
            overflow: 'hidden',
            x: image1X,
            opacity: image1Opacity,
          }}
        >
          <Image
            src="/images/cars/porschelondon.jpeg"
            alt="Ferrari in London"
            fill
            style={{ objectFit: 'cover' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-200px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              Our premium fleet features immaculate vehicles perfect for weddings, photoshoots, and special occasions. Each car is professionally maintained and detailed to perfection.
            </p>
          </motion.div>
        </motion.div>

        {/* Second Image - Slides in from right */}
        <motion.div
          style={{
            position: 'relative',
            height: '500px',
            borderRadius: '24px',
            overflow: 'hidden',
            x: image2X,
            opacity: image2Opacity,
          }}
        >
          <Image
            src="/images/cars/ferrarilondon.jpeg"
            alt="Green Lamborghini"
            fill
            style={{ objectFit: 'cover' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-200px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              Full insurance coverage, convenient pickup and delivery, expert maintenance, and personalised attention for every client's unique needs.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Services CTA Button */}
      <motion.div 
        style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          y: buttonY,
          opacity: buttonOpacity,
        }}
      >
        <SecondaryButton href="#services" size="large">
          View Our Services
        </SecondaryButton>
      </motion.div>
    </section>
  )
}

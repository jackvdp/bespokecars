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

// Shared content components to avoid duplication
function StepsPanel({ animateOnScroll = true }: { animateOnScroll?: boolean }) {
  return (
    <div className="max-w-[1200px] w-full mx-auto relative z-10">
      {/* Header */}
      <div className="text-center mb-10 md:mb-[60px]">
        <p className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase font-[var(--font-body)] mb-4">
          How it Works
        </p>
        <h2 className="text-[var(--foreground)] text-[clamp(32px,5vw,56px)] font-semibold font-[var(--font-title)] tracking-tight">
          Follow 3 easy steps
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {steps.map((step, index) => (
          <Card key={step.number} index={index} animateOnScroll={animateOnScroll}>
            {/* Step number */}
            <span
              className="block text-[64px] font-bold font-[var(--font-title)] leading-none mb-6"
              style={{
                background: 'linear-gradient(180deg, var(--primary) 0%, rgba(255,255,255,0.1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {step.number}
            </span>

            {/* Title */}
            <h3 className="text-[var(--foreground)] text-2xl font-semibold font-[var(--font-title)] mb-3 tracking-tight">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-white/60 text-base font-[var(--font-body)] leading-relaxed">
              {step.description}
            </p>
          </Card>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-12 md:mt-[50px]">
        <PrimaryButton href="#book" size="large">
          Book Now
        </PrimaryButton>
      </div>
    </div>
  )
}

function LogosSection() {
  return (
    <div className="mt-10 md:mt-[60px] w-full max-w-[1200px] relative z-10">
      <p className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase font-[var(--font-body)] text-center mb-6 md:mb-[30px]">
        Featuring brands you love
      </p>
      <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
        {logos.map((logo, index) => (
          <div key={logo.alt} className="flex items-center gap-6 md:gap-10">
            <motion.div
              className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
              style={{ filter: 'grayscale(100%) brightness(1.5)' }}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
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
                className="hidden md:block w-px h-10"
                style={{
                  background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function WhyChoosePanel({ animateOnScroll = true }: { animateOnScroll?: boolean }) {
  return (
    <div className="max-w-[1200px] w-full relative z-10">
      {/* Header */}
      <div className="text-center mb-10 md:mb-[60px]">
        <p className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase font-[var(--font-body)] mb-4">
          About Us
        </p>
        <h2 className="text-[var(--foreground)] text-[clamp(32px,5vw,56px)] font-semibold font-[var(--font-title)] tracking-tight">
          Why choose Bespoke
        </h2>
      </div>

      {/* Featured Car Images */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Image */}
        <motion.div
          className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden"
          initial={animateOnScroll ? { opacity: 0, y: 40 } : undefined}
          whileInView={animateOnScroll ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/cars/porschelondon.jpeg"
            alt="Ferrari in London"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 p-4 md:p-6 rounded-2xl bg-black/70 backdrop-blur-[10px] border border-white/10">
            <h3 className="text-[var(--foreground)] text-lg md:text-xl font-semibold font-[var(--font-title)] mb-2">
              Experience luxury like never before
            </h3>
            <p className="text-white/60 text-sm font-[var(--font-body)] leading-relaxed">
              Our premium fleet features immaculate vehicles perfect for weddings, photoshoots, and special occasions.
            </p>
          </div>
        </motion.div>

        {/* Second Image */}
        <motion.div
          className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden"
          initial={animateOnScroll ? { opacity: 0, y: 40 } : undefined}
          whileInView={animateOnScroll ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/cars/bentley.jpeg"
            alt="Bentley"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 p-4 md:p-6 rounded-2xl bg-black/70 backdrop-blur-[10px] border border-white/10">
            <h3 className="text-[var(--foreground)] text-lg md:text-xl font-semibold font-[var(--font-title)] mb-2">
              Professional service you can trust
            </h3>
            <p className="text-white/60 text-sm font-[var(--font-body)] leading-relaxed">
              Full insurance coverage, convenient pickup and delivery, and personalised attention for every client.
            </p>
          </div>
        </motion.div>
      </div>

      {/* About Us Button */}
      <div className="text-center mt-10 md:mt-[50px]">
        <SecondaryButton href="/about" size="large">
          About Us
        </SecondaryButton>
      </div>
    </div>
  )
}

// Mobile layout - simple vertical sections
function MobileLayout() {
  return (
    <>
      {/* First Section: Steps and Logos */}
      <section className="bg-[var(--background)] py-20 px-6 flex flex-col items-center relative">
        <SectionBackground glowPosition="both" gridFadeDirection="down" />
        <StepsPanel animateOnScroll={true} />
        <LogosSection />
      </section>

      {/* Second Section: Why Choose */}
      <section className="bg-[var(--background)] py-20 px-6 flex flex-col items-center relative">
        <SectionBackground glowPosition="bottom" gridFadeDirection="up" />
        <WhyChoosePanel animateOnScroll={true} />
      </section>
    </>
  )
}

// Desktop layout - horizontal scroll animation
function DesktopLayout() {
  const sectionRef = useRef(null)
  const [screenWidth, setScreenWidth] = useState(1200)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Main scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  // Separate scroll progress for initial animations (starts when section comes into view)
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  })

  // Initial content animations (steps and logos slide in as section enters viewport)
  const stepsX = useTransform(entryProgress, [0, 0.8], ["100%", "0%"])
  const stepsOpacity = useTransform(entryProgress, [0, 0.4, 0.8], [0, 0.5, 1])

  const logosX = useTransform(entryProgress, [0.2, 1], ["-100%", "0%"])
  const logosOpacity = useTransform(entryProgress, [0.2, 0.6, 1], [0, 0.5, 1])

  // Horizontal scroll movement (moves content left to reveal images section)
  // Starts immediately when section is fully in view (scrollYProgress = 0)
  const horizontalX = useTransform(scrollYProgress, [0, 0.9], [0, -screenWidth])

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
              <div className="text-center mb-[60px]">
                <p className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase font-[var(--font-body)] mb-4">
                  How it Works
                </p>
                <h2 className="text-[var(--foreground)] text-[clamp(32px,5vw,56px)] font-semibold font-[var(--font-title)] tracking-tight">
                  Follow 3 easy steps
                </h2>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-10">
                {steps.map((step, index) => (
                  <Card key={step.number} index={index} animateOnScroll={false}>
                    {/* Step number */}
                    <span
                      className="block text-[64px] font-bold font-[var(--font-title)] leading-none mb-6"
                      style={{
                        background: 'linear-gradient(180deg, var(--primary) 0%, rgba(255,255,255,0.1) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {step.number}
                    </span>

                    {/* Title */}
                    <h3 className="text-[var(--foreground)] text-2xl font-semibold font-[var(--font-title)] mb-3 tracking-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 text-base font-[var(--font-body)] leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center mt-[50px]">
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
              <p className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase font-[var(--font-body)] text-center mb-[30px]">
                Featuring brands you love
              </p>
              <div className="flex items-center justify-center gap-10 flex-wrap">
                {logos.map((logo, index) => (
                  <div key={logo.alt} className="flex items-center gap-10">
                    <motion.div
                      className="relative w-[70px] h-[70px]"
                      style={{ filter: 'grayscale(100%) brightness(1.5)' }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
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
                        className="w-px h-10"
                        style={{
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

            <div className="max-w-[1200px] w-full relative z-[1]">
              {/* Header */}
              <div className="text-center mb-[60px]">
                <p className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase font-[var(--font-body)] mb-4">
                  About Us
                </p>
                <h2 className="text-[var(--foreground)] text-[clamp(32px,5vw,56px)] font-semibold font-[var(--font-title)] tracking-tight">
                  Why choose Bespoke
                </h2>
              </div>

              {/* Featured Car Images */}
              <div className="w-full grid grid-cols-2 gap-6">
                {/* First Image */}
                <div className="relative h-[450px] rounded-3xl overflow-hidden">
                  <Image
                    src="/images/cars/porschelondon.jpeg"
                    alt="Ferrari in London"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute top-6 left-6 right-6 p-6 rounded-2xl bg-black/70 backdrop-blur-[10px] border border-white/10">
                    <h3 className="text-[var(--foreground)] text-xl font-semibold font-[var(--font-title)] mb-2">
                      Experience luxury like never before
                    </h3>
                    <p className="text-white/60 text-sm font-[var(--font-body)] leading-relaxed">
                      Our premium fleet features immaculate vehicles perfect for weddings, photoshoots, and special occasions.
                    </p>
                  </div>
                </div>

                {/* Second Image */}
                <div className="relative h-[450px] rounded-3xl overflow-hidden">
                  <Image
                    src="/images/cars/bentley.jpeg"
                    alt="Bentley"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/70 backdrop-blur-[10px] border border-white/10">
                    <h3 className="text-[var(--foreground)] text-xl font-semibold font-[var(--font-title)] mb-2">
                      Professional service you can trust
                    </h3>
                    <p className="text-white/60 text-sm font-[var(--font-body)] leading-relaxed">
                      Full insurance coverage, convenient pickup and delivery, and personalised attention for every client.
                    </p>
                  </div>
                </div>
              </div>

              {/* About Us Button */}
              <div className="text-center mt-[50px]">
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

export default function HowItWorks() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialize = () => {
      setIsMobile(window.innerWidth < 768)
      setMounted(true)
    }
    initialize()
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <section className="min-h-screen bg-[var(--background)]">
        <SectionBackground glowPosition="both" gridFadeDirection="down" />
      </section>
    )
  }

  return isMobile ? <MobileLayout /> : <DesktopLayout />
}

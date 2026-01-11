'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { contactInfo, mapEmbedUrl } from '@/lib/contactData'

export default function ContactSection() {
  const sectionRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Map parallax - moves slower than scroll
  const mapY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const mapScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.15, 1.2])
  
  // Overlay opacity - gets slightly lighter as you scroll in
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.5, 0.6])
  
  // Cards slide in from left with stagger
  const cardsX = useTransform(scrollYProgress, [0, 0.4], ['-100px', '0px'])
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  
  // Header parallax - moves up slightly
  const headerY = useTransform(scrollYProgress, [0, 1], ['0px', '-50px'])

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
      {/* Map Background with Parallax */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-10%',
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
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.8) 70%)',
          pointerEvents: 'none',
          opacity: overlayOpacity,
          zIndex: 1,
        }}
      />
      
      {/* Gradient edges for blend - all sides */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to bottom, var(--background) 0%, transparent 20%, transparent 80%, var(--background) 100%),
            linear-gradient(to right, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%)
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
          background: 'radial-gradient(ellipse at center, transparent 30%, var(--background) 90%)',
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
        {/* Header with parallax */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '80px',
            y: headerY,
          }}
        >
          <motion.p
            style={{
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              marginBottom: '16px',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Contact Us
          </motion.p>
          <motion.h2
            style={{
              color: 'var(--foreground)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              fontFamily: 'var(--font-title)',
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get in touch
          </motion.h2>
        </motion.div>

        {/* Contact Cards with scroll animation */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '400px',
            x: cardsX,
            opacity: cardsOpacity,
          }}
        >
          {contactInfo.map((info, index) => {
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
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
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
        </motion.div>
      </div>
    </section>
  )
}

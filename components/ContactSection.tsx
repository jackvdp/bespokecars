'use client'

import { motion } from 'framer-motion'
import SectionBackground from './SectionBackground'

const contactInfo = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Headquarter Office',
    content: ['123 King\'s Road', 'Chelsea', 'London, UK'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: '+44 (0) 20 2345 6789',
    content: ['Call us'],
    href: 'tel:+442023456789',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: 'support@bespoke.com',
    content: ['Send us an email'],
    href: 'mailto:support@bespoke.com',
  },
]

export default function ContactSection() {
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
      <SectionBackground glowPosition="bottom" gridFadeDirection="up" />

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
        </motion.div>

        {/* Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 400px) 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Contact Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
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
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    cursor: info.href ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'var(--primary)',
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </div>

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

          {/* Map */}
          <motion.div
            style={{
              position: 'relative',
              height: '100%',
              minHeight: '400px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.5504876708474!2d-0.16891492302196045!3d51.48999097181047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760f9b8921b0ef%3A0x9c1f0f8f8f8f8f8f!2sKing&#39;s%20Rd%2C%20London!5e0!3m2!1sen!2suk!4v1704912000000!5m2!1sen!2suk"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

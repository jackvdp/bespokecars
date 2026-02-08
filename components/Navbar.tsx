'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import PrimaryButton from './PrimaryButton'
import { companyWhatsApp } from '@/lib/contactData'

const FloatingWhatsApp = dynamic(
  () => import('react-floating-whatsapp').then(mod => ({ default: mod.FloatingWhatsApp })),
  { ssr: false }
)

const navLinks = [
  { name: 'Fleet', href: '/cars' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

interface NavbarProps {
  backHref?: string
  backLabel?: string
}

export default function Navbar({ backHref, backLabel }: NavbarProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [whatsAppOpen, setWhatsAppOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.open(`https://wa.me/${companyWhatsApp}`, '_blank')
      return
    }
    setWhatsAppOpen(prev => !prev)
  }

  useEffect(() => {
    if (whatsAppOpen) {
      const timer = setTimeout(() => {
        const btn = document.querySelector('.floating-whatsapp-button') as HTMLElement
        if (btn) btn.click()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [whatsAppOpen])

  return (
    <>
      <motion.nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '16px 24px',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          style={{
            position: 'relative',
            maxWidth: '1280px',
            margin: '0 auto',
            borderRadius: '9999px',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderStyle: 'solid',
          }}
          animate={{
            backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
            borderColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Back + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {backHref && (
              <motion.a
                href={backHref}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                whileHover={{
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {backLabel || 'Back'}
              </motion.a>
            )}
          <motion.a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              style={{
                color: 'var(--foreground)',
                fontWeight: 500,
                fontSize: '14px',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.1em',
              }}
              whileHover={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              }}
              transition={{ duration: 0.3 }}
            >
              BESPOKE CARS
            </motion.span>
          </motion.a>
          </div>

          {/* Desktop Navigation - absolutely centered */}
          <div className="hidden md:flex items-center gap-1" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  style={{
                    position: 'relative',
                    padding: '8px 16px',
                    color: isActive ? 'var(--primary)' : 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.025em',
                    fontFamily: 'var(--font-body)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    textShadow: isActive ? '0 0 20px var(--primary)' : 'none',
                  }}
                  whileHover={{
                    color: 'var(--primary)',
                    textShadow: '0 0 20px var(--primary)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.a>
              )
            })}
          </div>

          {/* Right side: WhatsApp + CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* WhatsApp Button - always visible */}
            <motion.button
              onClick={handleWhatsAppClick}
              aria-label="Chat on WhatsApp"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.button>

            {/* CTA Button - Desktop only */}
            <div className="hidden md:flex">
              <PrimaryButton href="/contact" size="small">
                Book Now
              </PrimaryButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="flex md:hidden items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <div style={{ width: '24px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <motion.span
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--foreground)',
                    transformOrigin: 'left',
                    display: 'block',
                  }}
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? -1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--foreground)',
                    display: 'block',
                  }}
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    x: isMobileMenuOpen ? 20 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--foreground)',
                    transformOrigin: 'left',
                    display: 'block',
                  }}
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    style={{
                      fontSize: '36px',
                      fontWeight: 700,
                      color: isActive ? 'var(--primary)' : 'var(--foreground)',
                      letterSpacing: '-0.025em',
                      fontFamily: 'var(--font-title)',
                      textDecoration: 'none',
                      textShadow: isActive ? '0 0 30px var(--primary)' : 'none',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{
                      color: 'var(--primary)',
                      textShadow: '0 0 30px var(--primary)'
                    }}
                  >
                    {link.name}
                  </motion.a>
                )
              })}
              <motion.div
                style={{ marginTop: '16px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PrimaryButton href="/contact" size="large">
                  Book Now
                </PrimaryButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Chat Widget */}
      {whatsAppOpen && (
        <FloatingWhatsApp
          phoneNumber={companyWhatsApp}
          accountName="Bespoke Cars"
          chatMessage="Hello! 👋 How can we help you today?"
          statusMessage="Typically replies within minutes"
          placeholder="Type a message..."
          darkMode={true}
          allowClickAway={true}
          allowEsc={true}
          onClose={() => setWhatsAppOpen(false)}
          buttonStyle={{
            position: 'fixed',
            bottom: '-200px',
            right: '-200px',
            opacity: 0,
            pointerEvents: 'none' as const,
          }}
        />
      )}
    </>
  )
}

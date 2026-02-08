'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PrimaryButton from './PrimaryButton'

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
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

          {/* CTA Button - Desktop only */}
          <div className="hidden md:flex">
            <PrimaryButton href="/cars" size="small">
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
                <PrimaryButton href="/cars" size="large">
                  Book Now
                </PrimaryButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

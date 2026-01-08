'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Fleet', href: '#fleet' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

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
            maxWidth: '1280px',
            margin: '0 auto',
            borderRadius: '16px',
            padding: '12px 24px',
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
          {/* Logo */}
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
                fontWeight: 700,
                fontSize: '18px',
                fontFamily: 'var(--font-title)',
                letterSpacing: '-0.02em',
              }}
              whileHover={{ 
                textShadow: '0 0 30px var(--neon-blue-glow)',
              }}
              transition={{ duration: 0.3 }}
            >
              BESPOKE CARS
            </motion.span>
          </motion.a>

          {/* Desktop Navigation */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                style={{
                  position: 'relative',
                  padding: '8px 16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.025em',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                }}
                onHoverStart={() => setHoveredLink(link.name)}
                onHoverEnd={() => setHoveredLink(null)}
                whileHover={{ color: 'var(--foreground)' }}
              >
                {hoveredLink === link.name && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    layoutId="navHover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 10 }}>{link.name}</span>
              </motion.a>
            ))}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.a
              href="#book"
              style={{
                position: 'relative',
                padding: '10px 20px',
                borderRadius: '9999px',
                overflow: 'hidden',
                textDecoration: 'none',
              }}
              className="hidden sm:flex"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--primary)',
                }}
                whileHover={{ 
                  boxShadow: '0 0 40px var(--neon-blue-glow)',
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                }}
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <span 
                style={{
                  position: 'relative',
                  zIndex: 10,
                  color: 'var(--background)',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '0.025em',
                  fontFamily: 'var(--font-title)',
                }}
              >
                BOOK NOW
              </span>
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="md:hidden"
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
            className="md:hidden"
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
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    letterSpacing: '-0.025em',
                    fontFamily: 'var(--font-title)',
                    textDecoration: 'none',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ 
                    color: 'var(--primary)',
                    textShadow: '0 0 30px var(--neon-blue-glow)'
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#book"
                style={{
                  marginTop: '16px',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--background)',
                  fontWeight: 600,
                  fontSize: '18px',
                  letterSpacing: '0.025em',
                  fontFamily: 'var(--font-title)',
                  textDecoration: 'none',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ 
                  boxShadow: '0 0 40px var(--neon-blue-glow)',
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
              >
                BOOK NOW
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const footerLinks = [
  {
    title: 'Fleet',
    links: [
      { label: 'All Cars', href: '/cars' },
      { label: 'Supercars', href: '/cars?category=supercar' },
      { label: 'Luxury', href: '/cars?category=luxury' },
      { label: '4x4', href: '/cars?category=4x4' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Wedding Hire', href: '/services/wedding' },
      { label: 'Corporate Events', href: '/services/corporate' },
      { label: 'Chauffeur', href: '/services/chauffeur' },
      { label: 'Film & Photoshoots', href: '/services/film' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/bespoke',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@bespoke',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--background)',
        position: 'relative',
      }}
    >
      {/* Accent line divider */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          opacity: 0.6,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px 40px',
        }}
      >
        {/* Main footer content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '60px',
            marginBottom: '60px',
          }}
        >
          {/* Brand column */}
          <div>
            <h3
              style={{
                color: 'var(--foreground)',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'var(--font-title)',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              Bespoke
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              Premium luxury car hire for weddings, events, and special occasions across the UK.
            </p>
            
            {/* Social links */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    transition: { duration: 0.3 },
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4
                style={{
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '20px',
                }}
              >
                {column.title}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {column.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        textDecoration: 'none',
                      }}
                      whileHover={{
                        color: 'var(--foreground)',
                      }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
            }}
          >
            © {new Date().getFullYear()} Bespoke Lifestyle Group. All rights reserved.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            <motion.a
              href="/privacy"
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
              }}
              whileHover={{
                color: 'var(--foreground)',
              }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="/cookies"
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
              }}
              whileHover={{
                color: 'var(--foreground)',
              }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SecondaryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
}

export default function SecondaryButton({ 
  children, 
  href, 
  onClick,
  size = 'medium'
}: SecondaryButtonProps) {
  const sizeStyles = {
    small: {
      padding: '10px 24px',
      fontSize: '12px',
    },
    medium: {
      padding: '14px 36px',
      fontSize: '13px',
    },
    large: {
      padding: '16px 48px',
      fontSize: '14px',
    },
  }

  const style = {
    display: 'inline-block',
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--foreground)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '9999px',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  }

  const hoverAnimation = {
    scale: 1.05,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'var(--primary)',
    boxShadow: '0 0 20px rgba(0, 210, 200, 0.2)',
  }

  const tapAnimation = { scale: 0.98 }

  if (href) {
    return (
      <motion.a
        href={href}
        style={style}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      style={style}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

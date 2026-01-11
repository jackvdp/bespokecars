'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PrimaryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  size = 'medium',
  type = 'button',
  disabled = false,
}: PrimaryButtonProps) {
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
    color: 'var(--background)',
    backgroundColor: 'var(--primary)',
    borderRadius: '9999px',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
  }

  const hoverAnimation = {
    scale: 1.05,
    boxShadow: '0 0 30px var(--primary)',
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
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileHover={disabled ? {} : hoverAnimation}
      whileTap={disabled ? {} : tapAnimation}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

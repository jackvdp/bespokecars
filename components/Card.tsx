'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  index?: number
  showAccentLine?: boolean
  animateOnScroll?: boolean
}

export default function Card({ 
  children, 
  index = 0,
  showAccentLine = true,
  animateOnScroll = true,
}: CardProps) {
  const cardContent = (
    <>
      {/* Top accent line */}
      {showAccentLine && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '40px',
            right: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            opacity: 0.6,
          }}
        />
      )}
      {children}
    </>
  )

  if (animateOnScroll) {
    return (
      <motion.div
        style={{
          position: 'relative',
          padding: '40px',
          borderRadius: '24px',
          backgroundColor: 'rgba(20, 20, 20, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          borderColor: 'var(--primary)',
          transition: { duration: 0.3 },
        }}
      >
        {cardContent}
      </motion.div>
    )
  }

  return (
    <motion.div
      style={{
        position: 'relative',
        padding: '40px',
        borderRadius: '24px',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
      }}
      whileHover={{
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderColor: 'var(--primary)',
        transition: { duration: 0.3 },
      }}
    >
      {cardContent}
    </motion.div>
  )
}

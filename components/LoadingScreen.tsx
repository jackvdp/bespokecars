'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [shouldShow, setShouldShow] = useState(true)

  // Handle progress animation while loading
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isLoading])

  // Handle completion when loading finishes
  useEffect(() => {
    if (isLoading) return

    // Quickly animate to 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return Math.min(100, prev + 5)
      })
    }, 30)

    // Dismiss after animation completes
    const dismissTimeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setShouldShow(false)
      }, 400)
    }, 300)

    return () => {
      clearInterval(interval)
      clearTimeout(dismissTimeout)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed inset-0 overflow-hidden"
          style={{ backgroundColor: '#000000', zIndex: 99999, isolation: 'isolate' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Solid black base layer - ensures no transparency */}
          <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />

          {/* Animated gradient background */}
          <div className="absolute inset-0" style={{ backgroundColor: '#000000' }}>
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(0, 210, 200, 0.15) 100%, transparent 100%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 80% 50%, rgba(0, 210, 200, 0.1) 0%, transparent 50%)',
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 200, 0.05) 0%, transparent 70%)',
              }}
              animate={{
                scale: [0.8, 1.5, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 210, 200, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0, 210, 200, 0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
            }}
          />

          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-12 px-8">
              
              {/* Animated logo */}
              <motion.div className="relative">
                <motion.div
                  className="absolute -inset-20 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 210, 200, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="text-5xl md:text-7xl lg:text-8xl font-[var(--font-title)] font-bold tracking-tight text-white relative"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                  }}
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    textShadow: '0 0 80px rgba(0, 210, 200, 0.5)',
                  }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        '0 0 80px rgba(0, 210, 200, 0.5)',
                        '0 0 120px rgba(0, 210, 200, 0.8)',
                        '0 0 80px rgba(0, 210, 200, 0.5)',
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    BESPOKE
                  </motion.span>
                  {' '}
                  <motion.span
                    className="text-[var(--primary)]"
                    animate={{
                      textShadow: [
                        '0 0 40px rgba(0, 210, 200, 0.8)',
                        '0 0 60px rgba(0, 210, 200, 1)',
                        '0 0 40px rgba(0, 210, 200, 0.8)',
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  >
                    CARS
                  </motion.span>
                </motion.div>
              </motion.div>
              
              {/* Animated tagline */}
              <motion.div
                className="text-sm md:text-base font-[var(--font-body)] tracking-[0.3em] uppercase text-[var(--primary)] text-center max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Where Luxury Meets Your Most Important Moments
                </motion.span>
              </motion.div>
              
              {/* Dynamic loading indicator */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Outer spinning ring */}
                <motion.div 
                  className="w-24 h-24 border-2 border-white/10 rounded-full absolute inset-0"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Middle spinning ring */}
                <motion.div 
                  className="w-20 h-20 border-2 border-[var(--primary)]/30 rounded-full absolute top-2 left-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner pulsing circle */}
                <motion.div 
                  className="w-16 h-16 rounded-full absolute top-4 left-4"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 210, 200, 0.4) 0%, transparent 70%)',
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Center dot */}
                <motion.div 
                  className="w-3 h-3 bg-[var(--primary)] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 210, 200, 0.8)',
                  }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              
              {/* Progress indicator */}
              <motion.div
                className="flex flex-col items-center gap-3 w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className="text-white/40 text-xs font-[var(--font-body)] uppercase tracking-wider">Loading</span>
                  <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-cyan-300"
                      style={{
                        width: `${progress}%`,
                        boxShadow: '0 0 10px rgba(0, 210, 200, 0.5)',
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[var(--primary)] text-2xl font-[var(--font-title)] font-bold min-w-[3ch]">{Math.round(progress)}%</span>
                </div>
                
                {/* Loading text animation */}
                <motion.div
                  className="text-white/30 text-xs tracking-[0.2em] uppercase"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Preparing your luxury experience
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              boxShadow: '0 0 20px rgba(0, 210, 200, 0.5)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
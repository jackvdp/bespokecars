'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface TextOverlay {
  text: string
  subtext?: string
  startProgress: number
  endProgress: number
}

interface ScrollVideoProps {
  src: string
  textOverlays?: TextOverlay[]
  scrollHeight?: string
  showScrollIndicator?: boolean
  overlayGradient?: boolean
  fadeOutStart?: number
}

export default function ScrollVideo({ 
  src, 
  textOverlays = [],
  scrollHeight = "300vh",
  showScrollIndicator = true,
  overlayGradient = true,
  fadeOutStart = 0.95
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showIndicator, setShowIndicator] = useState(true)
  
  // Store values in refs to avoid re-renders
  const videoDurationRef = useRef(8)
  const scrollProgressRef = useRef(0)
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      videoDurationRef.current = video.duration
      setIsLoaded(true)
      video.pause()
      video.currentTime = 0
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    if (video.readyState >= 2) {
      handleLoadedMetadata()
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const getActiveOverlayIndex = useCallback((progress: number) => {
    for (let i = textOverlays.length - 1; i >= 0; i--) {
      const overlay = textOverlays[i]
      if (i === 0) {
        if (progress <= overlay.endProgress) return 0
      } else {
        const midPoint = (overlay.startProgress + textOverlays[i - 1].endProgress) / 2
        if (progress >= midPoint && progress <= overlay.endProgress) return i
      }
    }
    return textOverlays.length - 1
  }, [textOverlays])

  useEffect(() => {
    if (!isLoaded) return

    let rafId: number

    const updateVideoFrame = () => {
      const video = videoRef.current
      if (!video) return

      const scrollableHeight = window.innerHeight * 2
      const scrolled = window.scrollY
      const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1)
      
      scrollProgressRef.current = progress

      // Update video time
      const targetTime = progress * videoDurationRef.current
      if (!isNaN(targetTime) && isFinite(targetTime)) {
        video.currentTime = targetTime
      }

      // Update active overlay - only triggers re-render when overlay changes
      const newIndex = getActiveOverlayIndex(progress)
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }

      // Update scroll indicator visibility
      const shouldShowIndicator = progress < 0.05
      if (shouldShowIndicator !== showIndicator) {
        setShowIndicator(shouldShowIndicator)
      }
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateVideoFrame)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial update
    updateVideoFrame()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isLoaded, activeIndex, showIndicator, getActiveOverlayIndex])

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            src={src}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay gradient for better text visibility */}
          {overlayGradient && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-background/40 pointer-events-none" />
          )}
        </div>
        
        {/* Loading indicator */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-background"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  className="w-12 h-12 border-4 border-foreground/30 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="text-foreground">Loading video...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Text Overlays - simplified animations, no per-character */}
        {isLoaded && textOverlays.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8 max-w-6xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight leading-none uppercase"
                    style={{ 
                      textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                      fontFamily: 'var(--font-title)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {textOverlays[activeIndex]?.text}
                  </h1>
                  {textOverlays[activeIndex]?.subtext && (
                    <p 
                      className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-light tracking-wide"
                      style={{ 
                        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      {textOverlays[activeIndex]?.subtext}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Scroll indicator */}
        <AnimatePresence>
          {showScrollIndicator && isLoaded && showIndicator && (
            <motion.div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-foreground text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.svg 
                className="w-6 h-6 mx-auto opacity-60"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  )
}

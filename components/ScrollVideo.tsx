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
}

export default function ScrollVideo({ 
  src, 
  textOverlays = [],
  scrollHeight = "300vh",
  showScrollIndicator = true,
  overlayGradient = true
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoDuration, setVideoDuration] = useState(8)
  const [scrollProgress, setScrollProgress] = useState(0)
  const animationFrameRef = useRef<number>()
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
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

  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container || !isLoaded) return

    const scrollableHeight = window.innerHeight * 2
    const scrolled = window.scrollY
    const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1)
    
    setScrollProgress(progress)

    const targetTime = progress * videoDuration
    
    if (!isNaN(targetTime) && isFinite(targetTime)) {
      const currentTime = video.currentTime
      const diff = targetTime - currentTime
      
      if (Math.abs(diff) > 0.01) {
        video.currentTime = targetTime
      }
    }
  }, [isLoaded, videoDuration])

  useEffect(() => {
    if (!isLoaded) return

    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(updateVideoFrame)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    updateVideoFrame()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isLoaded, updateVideoFrame])

  const getActiveOverlayIndex = () => {
    // Find which overlay should be active based on scroll progress
    for (let i = textOverlays.length - 1; i >= 0; i--) {
      const overlay = textOverlays[i]
      if (i === 0) {
        // First overlay is active from 0 until its end
        if (scrollProgress <= overlay.endProgress) return 0
      } else {
        // Other overlays become active at their midpoint between start and previous end
        const midPoint = (overlay.startProgress + textOverlays[i - 1].endProgress) / 2
        if (scrollProgress >= midPoint && scrollProgress <= overlay.endProgress) return i
      }
    }
    return textOverlays.length - 1
  }

  const activeIndex = getActiveOverlayIndex()

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
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
        
        {/* Text Overlays */}
        {isLoaded && textOverlays.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8 max-w-6xl relative">
              <AnimatePresence mode="wait">
                {textOverlays.map((overlay, index) => {
                  if (index !== activeIndex) return null
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center justify-center"
                      initial={index === 0 ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 60, scale: 0.9, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <motion.h1 
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight leading-none uppercase"
                        style={{ 
                          textShadow: '0 4px 30px rgba(0,0,0,0.7)',
                          fontFamily: 'var(--font-title)',
                          letterSpacing: '-0.02em'
                        }}
                        initial={index === 0 ? {} : { opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        {overlay.text.split('').map((char, charIndex) => (
                          <motion.span
                            key={charIndex}
                            initial={index === 0 ? {} : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.4,
                              delay: index === 0 ? 0 : 0.02 * charIndex,
                              ease: [0.22, 1, 0.36, 1]
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.h1>
                      {overlay.subtext && (
                        <motion.p 
                          className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-light tracking-wide"
                          style={{ 
                            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                            fontFamily: 'var(--font-body)'
                          }}
                          initial={index === 0 ? {} : { opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index === 0 ? 0 : 0.3 }}
                        >
                          {overlay.subtext}
                        </motion.p>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Scroll indicator */}
        <AnimatePresence>
          {showScrollIndicator && isLoaded && scrollProgress < 0.05 && (
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
        
        {/* Overlay gradient for better text visibility */}
        {overlayGradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-background/40 pointer-events-none" />
        )}
      </div>
    </div>
  )
}

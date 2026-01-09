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
  customOverlay?: (activeIndex: number, progress: number) => React.ReactNode
  contentFadeIn?: number
}

export default function ScrollVideo({ 
  src, 
  textOverlays = [],
  scrollHeight = "300vh",
  showScrollIndicator = true,
  overlayGradient = true,
  customOverlay,
  contentFadeIn = 0
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [contentProgress, setContentProgress] = useState(0)
  const [showIndicator, setShowIndicator] = useState(true)
  const [isInView, setIsInView] = useState(true)
  const [isFullFrame, setIsFullFrame] = useState(true)
  
  const videoDurationRef = useRef(8)
  
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
      const container = containerRef.current
      if (!video || !container) return

      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewportHeight = window.innerHeight
      
      // VIDEO TIMELINE: plays while any part of container is visible
      // Starts when top of container hits bottom of viewport
      // Ends when bottom of container leaves top of viewport
      const totalVideoScrollDistance = containerHeight + viewportHeight
      const videoScrolled = viewportHeight - rect.top
      const videoProgress = Math.min(Math.max(videoScrolled / totalVideoScrollDistance, 0), 1)
      
      // Check if any part is in view
      const isCurrentlyInView = rect.bottom > 0 && rect.top < viewportHeight
      
      if (isCurrentlyInView !== isInView) {
        setIsInView(isCurrentlyInView)
      }
      
      // Update video time based on video progress
      if (isCurrentlyInView) {
        const targetTime = videoProgress * videoDurationRef.current
        if (!isNaN(targetTime) && isFinite(targetTime)) {
          video.currentTime = targetTime
        }
      }
      
      // CONTENT TIMELINE: only when video is 100% in frame
      // Starts when top of container hits top of viewport
      // Ends when bottom of container hits bottom of viewport (next section starting to appear)
      const contentScrollDistance = containerHeight - viewportHeight
      const contentScrolled = -rect.top
      const newContentProgress = Math.min(Math.max(contentScrolled / contentScrollDistance, 0), 1)
      
      // Full frame = top of container is at or below top of viewport AND bottom is at or above bottom of viewport
      const isCurrentlyFullFrame = rect.top <= 0 && rect.bottom >= viewportHeight
      
      if (isCurrentlyFullFrame !== isFullFrame) {
        setIsFullFrame(isCurrentlyFullFrame)
      }
      
      if (Math.abs(newContentProgress - contentProgress) > 0.005) {
        setContentProgress(newContentProgress)
      }

      // Update active overlay based on content progress
      const newIndex = getActiveOverlayIndex(newContentProgress)
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }

      // Update scroll indicator visibility
      const shouldShowIndicator = newContentProgress < 0.05
      if (shouldShowIndicator !== showIndicator) {
        setShowIndicator(shouldShowIndicator)
      }
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateVideoFrame)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateVideoFrame()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isLoaded, activeIndex, showIndicator, isInView, isFullFrame, contentProgress, getActiveOverlayIndex])

  // Content opacity: fade in based on contentFadeIn prop, fade out as we approach end
  const fadeInOpacity = contentFadeIn > 0 && contentProgress < contentFadeIn
    ? contentProgress / contentFadeIn
    : 1
  
  const fadeOutOpacity = contentProgress > 0.85
    ? 1 - ((contentProgress - 0.85) / 0.15)
    : 1
  
  const contentOpacity = isFullFrame ? Math.min(fadeInOpacity, fadeOutOpacity) : 0

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: scrollHeight,
        position: 'relative',
      }}
    >
      {/* Video layer - fixed when in view */}
      <div 
        style={{
          position: isInView ? 'fixed' : 'absolute',
          top: isInView ? 0 : 'auto',
          bottom: isInView ? 'auto' : 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 0,
        }}
      >
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
        
        {/* Text Overlays - only visible when full frame */}
        {isLoaded && textOverlays.length > 0 && !customOverlay && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              opacity: contentOpacity,
              pointerEvents: contentOpacity > 0 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out',
            }}
          >
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
        
        {/* Custom Overlay - only visible when full frame */}
        {isLoaded && customOverlay && (
          <div 
            style={{ 
              opacity: contentOpacity,
              pointerEvents: contentOpacity > 0 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out',
            }}
          >
            {customOverlay(activeIndex, contentProgress)}
          </div>
        )}
        
        {/* Scroll indicator */}
        <AnimatePresence>
          {showScrollIndicator && isLoaded && showIndicator && isFullFrame && (
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

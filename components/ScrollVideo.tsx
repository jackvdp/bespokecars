'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

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

  const getTextOpacity = (startProgress: number, endProgress: number, index: number) => {
    // First overlay starts at full opacity
    if (index === 0 && scrollProgress <= startProgress) return 1
    
    if (scrollProgress < startProgress) return 0
    if (scrollProgress > endProgress) return 0
    
    const fadeInEnd = startProgress + 0.05
    const fadeOutStart = endProgress - 0.05
    
    if (scrollProgress <= fadeInEnd) {
      return (scrollProgress - startProgress) / 0.05
    }
    if (scrollProgress >= fadeOutStart) {
      return (endProgress - scrollProgress) / 0.05
    }
    
    return 1
  }

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
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-foreground/30 border-t-primary rounded-full animate-spin"></div>
              <div className="text-foreground">Loading video...</div>
            </div>
          </div>
        )}
        
        {/* Text Overlays */}
        {isLoaded && textOverlays.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8 max-w-6xl">
              {textOverlays.map((overlay, index) => {
                const opacity = getTextOpacity(overlay.startProgress, overlay.endProgress, index)
                const isEntering = scrollProgress < overlay.startProgress + 0.05
                const isExiting = scrollProgress > overlay.endProgress - 0.05
                
                // First text only fades/scales out, others have full entrance animation
                let translateY = 0
                let scale = 1
                let blur = 0
                
                if (index === 0) {
                  // First text: scale up and blur out as it exits
                  if (isExiting) {
                    const exitProgress = (scrollProgress - (overlay.endProgress - 0.05)) / 0.05
                    scale = 1 + (exitProgress * 0.1)
                    blur = exitProgress * 8
                  }
                } else {
                  // Other texts: slide up and scale in, then scale up and blur out
                  if (isEntering) {
                    const enterProgress = opacity
                    translateY = (1 - enterProgress) * 60
                    scale = 0.9 + (enterProgress * 0.1)
                    blur = (1 - enterProgress) * 4
                  } else if (isExiting) {
                    const exitProgress = (scrollProgress - (overlay.endProgress - 0.05)) / 0.05
                    scale = 1 + (exitProgress * 0.1)
                    blur = exitProgress * 8
                  }
                }
                return (
                  <div
                    key={index}
                    className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
                    style={{ 
                      opacity,
                      transform: `translateY(${translateY}px) scale(${scale})`,
                      filter: `blur(${blur}px)`,
                      pointerEvents: opacity > 0 ? 'auto' : 'none'
                    }}
                  >
                    <h1 
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight leading-none uppercase"
                      style={{ 
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        fontFamily: 'var(--font-title)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {overlay.text}
                    </h1>
                    {overlay.subtext && (
                      <p 
                        className="text-xl sm:text-2xl md:text-3xl text-foreground/90 font-light tracking-wide"
                        style={{ 
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {overlay.subtext}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Scroll indicator */}
        {showScrollIndicator && isLoaded && scrollProgress < 0.05 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-foreground text-center animate-bounce">
            <svg 
              className="w-6 h-6 mx-auto opacity-60"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        )}
        
        {/* Overlay gradient for better text visibility */}
        {overlayGradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-background/40 pointer-events-none" />
        )}
      </div>
    </div>
  )
}

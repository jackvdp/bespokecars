'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useScroll, MotionValue } from 'framer-motion'

interface ScrollVideoSimpleProps {
  src: string
  scrollHeight?: string
  children?: React.ReactNode | ((scrollYProgress: MotionValue<number>) => React.ReactNode)
  lazy?: boolean
  onLoadStart?: () => void
}

export default function ScrollVideoSimple({ 
  src, 
  scrollHeight = '300vh',
  children,
  lazy = false,
  onLoadStart
}: ScrollVideoSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const videoDurationRef = useRef(0)

  // Content timeline: only when sticky container is fully in view (for children)
  const { scrollYProgress: contentProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Trigger lazy load when ready
  useEffect(() => {
    if (lazy && !shouldLoad) {
      onLoadStart?.()
      setShouldLoad(true)
    }
  }, [lazy, shouldLoad, onLoadStart])

  // Handle video ready
  useEffect(() => {
    if (!shouldLoad) return
    
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      videoDurationRef.current = video.duration
      video.pause()
      video.currentTime = 0
      setIsVideoReady(true)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    // Check if already loaded
    if (video.readyState >= 2) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [shouldLoad])

  // Manual scroll handler for video sync (more reliable than Framer Motion's onChange)
  useEffect(() => {
    if (!isVideoReady) return

    let rafId: number

    const updateVideoFrame = () => {
      const video = videoRef.current
      const container = containerRef.current
      if (!video || !container || !videoDurationRef.current) return

      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewportHeight = window.innerHeight
      
      // Video timeline: plays while any part of container is visible
      // Starts when top of container hits bottom of viewport
      // Ends when bottom of container leaves top of viewport
      const totalVideoScrollDistance = containerHeight + viewportHeight
      const videoScrolled = viewportHeight - rect.top
      const videoProgress = Math.min(Math.max(videoScrolled / totalVideoScrollDistance, 0), 1)
      
      // Update video time
      const targetTime = videoProgress * videoDurationRef.current
      if (!isNaN(targetTime) && isFinite(targetTime)) {
        video.currentTime = targetTime
      }
    }

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateVideoFrame)
    }

    // Use the body as scroll container since that's where scroll is now
    const scrollContainer = document.body
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial update
    updateVideoFrame()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isVideoReady])

  return (
    <div
      ref={containerRef}
      style={{
        height: scrollHeight,
        position: 'relative',
      }}
    >
      {/* Sticky video container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Video */}
        {shouldLoad && (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
          }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            pointerEvents: 'none',
          }}
        />

        {/* Children receive the content timeline (shorter, fully in view) */}
        {typeof children === 'function' 
          ? children(contentProgress)
          : children
        }
      </div>
    </div>
  )
}

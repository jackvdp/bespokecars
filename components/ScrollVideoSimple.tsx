'use client'

import { useRef, useEffect } from 'react'
import { useScroll, MotionValue } from 'framer-motion'
import { usePreloadedVideo } from '@/hooks/usePreloadedVideo'

interface ScrollVideoSimpleProps {
  src: string
  scrollHeight?: string
  children?: React.ReactNode | ((scrollYProgress: MotionValue<number>) => React.ReactNode)
  /** Hold the download back until true (e.g. until the hero video has finished downloading) */
  enabled?: boolean
}

export default function ScrollVideoSimple({ 
  src, 
  scrollHeight = '300vh',
  children,
  enabled = true
}: ScrollVideoSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // The video is downloaded in full before it's shown, so scrubbing never waits on the network
  const { videoSrc, isReady: isVideoReady, scrubTo } = usePreloadedVideo(videoRef, src, { enabled })

  // Content timeline: only when sticky container is fully in view (for children)
  const { scrollYProgress: contentProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Manual scroll handler for video sync (more reliable than Framer Motion's onChange)
  useEffect(() => {
    if (!isVideoReady) return

    let rafId: number

    const updateVideoFrame = () => {
      const container = containerRef.current
      if (!container) return

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
      scrubTo(videoProgress)
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
  }, [isVideoReady, scrubTo])

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
        {/* Video - fades in once fully downloaded */}
        <video
          ref={videoRef}
          src={videoSrc ?? undefined}
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
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        />

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

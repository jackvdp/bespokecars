'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface ScrollVideoSimpleProps {
  src: string
  scrollHeight?: string
  children?: React.ReactNode | ((scrollYProgress: MotionValue<number>) => React.ReactNode)
}

export default function ScrollVideoSimple({ 
  src, 
  scrollHeight = '300vh',
  children 
}: ScrollVideoSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  // Video timeline: plays while any part of component is in view
  const { scrollYProgress: videoProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Content timeline: only when sticky container is fully in view
  const { scrollYProgress: contentProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Sync video playback with the longer video timeline
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isVideoReady) return

    const unsubscribe = videoProgress.on('change', (progress) => {
      if (video.duration) {
        video.currentTime = progress * video.duration
      }
    })

    return () => unsubscribe()
  }, [videoProgress, isVideoReady])

  const handleVideoReady = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      setIsVideoReady(true)
    }
  }

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
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoReady}
          onCanPlay={handleVideoReady}
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

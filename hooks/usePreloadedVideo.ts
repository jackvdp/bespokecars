'use client'

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

// Seeks smaller than this aren't worth a decode (well under one frame at 30fps)
const MIN_SEEK_DELTA = 1 / 60

interface UsePreloadedVideoOptions {
  /** Hold the download back until true, e.g. so a later video doesn't compete with the hero for bandwidth */
  enabled?: boolean
}

/**
 * Downloads a video in full before handing it to the <video> element, so that
 * scroll scrubbing only ever seeks within data that is already in memory.
 *
 * Letting the browser stream the file instead means every seek into an
 * unbuffered region triggers a range request, which is what makes scrubbing
 * stutter on a real network.
 */
export function usePreloadedVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
  { enabled = true }: UsePreloadedVideoOptions = {}
) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const durationRef = useRef(0)
  const targetTimeRef = useRef(0)

  // Download the whole file and expose it as an in-memory blob URL
  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()
    let objectUrl: string | null = null

    const download = async () => {
      try {
        const response = await fetch(src, { signal: controller.signal })
        if (!response.ok || !response.body) {
          throw new Error(`Failed to download ${src} (${response.status})`)
        }

        const total = Number(response.headers.get('content-length')) || 0
        const reader = response.body.getReader()
        const chunks: BlobPart[] = []
        let received = 0
        let reported = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          chunks.push(value)
          received += value.length

          // Only re-render on whole percentage steps
          const next = total ? Math.min(received / total, 1) : 0
          if (next - reported >= 0.01) {
            reported = next
            setProgress(next)
          }
        }

        const type = response.headers.get('content-type') || 'video/mp4'
        objectUrl = URL.createObjectURL(new Blob(chunks, { type }))
        setProgress(1)
        setVideoSrc(objectUrl)
      } catch {
        if (controller.signal.aborted) return
        // Fall back to letting the browser stream the file so the page still works
        setVideoSrc(src)
      }
    }

    download()

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src, enabled])

  // Wait for the element to decode the downloaded file
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    let settled = false

    const handleReady = () => {
      if (settled) return
      settled = true
      durationRef.current = isFinite(video.duration) ? video.duration : 0
      video.pause()
      setIsReady(true)
    }

    video.addEventListener('loadeddata', handleReady)
    // A video that can't be decoded shouldn't leave the page stuck behind a loader
    video.addEventListener('error', handleReady)

    if (video.readyState >= 2) {
      handleReady()
    } else {
      // Force load on mobile - browsers ignore preload="auto"
      video.load()

      // Attempt to play (muted videos can autoplay on mobile)
      // This is what gets iOS to decode a frame before any user interaction
      video.play().then(handleReady).catch(() => {
        // Autoplay refused (e.g. Low Power Mode) - metadata is enough to start scrubbing
        if (video.readyState >= 1) {
          handleReady()
        } else {
          video.addEventListener('loadedmetadata', handleReady, { once: true })
        }
      })
    }

    return () => {
      settled = true
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('error', handleReady)
      video.removeEventListener('loadedmetadata', handleReady)
    }
  }, [videoRef, videoSrc])

  // Seek to a point in the video, given as 0-1 progress
  const scrubTo = useCallback((videoProgress: number) => {
    const video = videoRef.current
    const duration = durationRef.current
    if (!video || !duration || isNaN(videoProgress)) return

    const targetTime = Math.min(Math.max(videoProgress, 0), 1) * duration
    targetTimeRef.current = targetTime

    // Never stack a seek on top of one that is still decoding - interrupted seeks
    // don't paint, so the video freezes while scrolling. The 'seeked' handler below
    // picks up the latest target instead.
    if (video.seeking) return
    if (Math.abs(video.currentTime - targetTime) < MIN_SEEK_DELTA) return

    video.currentTime = targetTime
  }, [videoRef])

  // Once a seek lands, catch up with wherever the scroll position has moved to since
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isReady) return

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTimeRef.current) >= MIN_SEEK_DELTA) {
        video.currentTime = targetTimeRef.current
      }
    }

    video.addEventListener('seeked', handleSeeked)
    return () => video.removeEventListener('seeked', handleSeeked)
  }, [videoRef, isReady])

  return { videoSrc, progress, isReady, scrubTo }
}

'use client'

import { useEffect, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
  /** Download progress from 0 to 1 */
  progress: number
}

// Dial geometry, in SVG units - the dial is drawn in a 400 x 400 box and scales with its container
const CENTER = 200
const SWEEP = 270 // degrees covered by the dial, leaving a gap at the bottom
const START_ANGLE = -SWEEP / 2 // measured clockwise from 12 o'clock
const RIM_RADIUS = 190
const TICK_RADIUS = 176
const LABEL_RADIUS = 140
const TICK_COUNT = 50

// Rounded so the server and client render identical markup
const polar = (radius: number, angle: number) => {
  const radians = (angle * Math.PI) / 180
  return {
    x: +(CENTER + radius * Math.sin(radians)).toFixed(2),
    y: +(CENTER - radius * Math.cos(radians)).toFixed(2),
  }
}

const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
  const angle = START_ANGLE + (SWEEP * i) / TICK_COUNT
  const isMajor = i % 5 === 0
  return {
    value: (i * 100) / TICK_COUNT,
    isMajor,
    outer: polar(TICK_RADIUS, angle),
    inner: polar(TICK_RADIUS - (isMajor ? 16 : 8), angle),
    label: i % 10 === 0 ? polar(LABEL_RADIUS, angle) : null,
  }
})

const rimStart = polar(RIM_RADIUS, START_ANGLE)
const rimEnd = polar(RIM_RADIUS, START_ANGLE + SWEEP)
const rimPath = `M ${rimStart.x} ${rimStart.y} A ${RIM_RADIUS} ${RIM_RADIUS} 0 1 1 ${rimEnd.x} ${rimEnd.y}`

const REVEAL_TRANSITION = { duration: 1.1, delay: 0.4, ease: [0.65, 0, 0.35, 1] as const }

export default function LoadingScreen({ isLoading, progress }: LoadingScreenProps) {
  const [shouldShow, setShouldShow] = useState(true)
  const [percent, setPercent] = useState(0)

  // The dial springs towards the real progress, so it sweeps smoothly between download updates
  const target = useMotionValue(0)
  const dial = useSpring(target, { stiffness: 100, damping: 20 })

  useEffect(() => {
    target.set(isLoading ? progress : 1)
  }, [target, isLoading, progress])

  useMotionValueEvent(dial, 'change', (value) => {
    setPercent(Math.min(100, Math.round(value * 100)))
  })

  const isComplete = !isLoading && percent >= 100

  // Reveal the page through a circle opening out from the centre of the dial
  const reveal = useMotionValue(0)

  useEffect(() => {
    if (!isComplete) return

    const controls = animate(reveal, 80, {
      ...REVEAL_TRANSITION,
      onComplete: () => setShouldShow(false),
    })

    return () => controls.stop()
  }, [isComplete, reveal])

  // Stop the page being scrolled behind the loader before the video is ready
  useEffect(() => {
    if (isComplete) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isComplete])

  const revealMask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent calc(${reveal}vmax - 2px), #000 ${reveal}vmax)`
  // A bright neon line on the edge of the opening, with a soft glow behind it
  const revealEdge = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent calc(${reveal}vmax - 2px), rgba(255, 255, 255, 0.9) ${reveal}vmax, rgba(0, 210, 200, 0.9) calc(${reveal}vmax + 3px), rgba(0, 210, 200, 0.25) calc(${reveal}vmax + 14px), rgba(0, 210, 200, 0) calc(${reveal}vmax + 90px))`
  const revealEdgeOpacity = useTransform(reveal, [0, 4, 55, 80], [0, 1, 1, 0])

  const headAngle = useTransform(dial, (value) => START_ANGLE + SWEEP * value)
  const glowOpacity = useTransform(dial, [0, 1], [0.35, 1])

  if (!shouldShow) return null

  return (
    <motion.div
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        backgroundColor: '#000000',
        pointerEvents: isComplete ? 'none' : 'auto',
        maskImage: revealMask,
        WebkitMaskImage: revealMask,
      }}
    >
      {/* Grid pattern - fades out away from the dial */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8) 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8) 0%, transparent 60%)',
        }}
      />

      {/* Glow behind the dial - brightens as the download progresses */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 200, 0.16) 0%, transparent 45%)',
          opacity: glowOpacity,
        }}
      />

      {/* Dial - centred on the screen so the reveal opens from its middle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(420px, 80vw, 50vh)',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 'clamp(28px, 6vh, 56px)',
            // Balances the trailing letter-spacing so the text sits on centre
            paddingLeft: '0.35em',
            whiteSpace: 'nowrap',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(16px, 4.5vw, 26px)',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          Bespoke{' '}
          <span style={{ color: 'var(--primary)', textShadow: '0 0 20px var(--primary)' }}>Cars</span>
        </div>

        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          animate={{ scale: isComplete ? 1.3 : 1 }}
          transition={REVEAL_TRANSITION}
        >
          <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Bezel - turns slowly so the dial never looks frozen on a slow connection */}
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={RIM_RADIUS + 14}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="1 13"
              strokeLinecap="round"
              style={{ stroke: 'rgba(255, 255, 255, 0.3)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            />

            {/* Rim */}
            <path d={rimPath} fill="none" strokeWidth={1.5} style={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
            <motion.path
              d={rimPath}
              fill="none"
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{
                pathLength: dial,
                stroke: 'var(--primary)',
                filter: 'drop-shadow(0 0 6px var(--primary))',
              }}
            />

            {/* Tick marks */}
            {ticks.map((tick) => (
              <line
                key={tick.value}
                x1={tick.inner.x}
                y1={tick.inner.y}
                x2={tick.outer.x}
                y2={tick.outer.y}
                strokeWidth={tick.isMajor ? 2 : 1.5}
                strokeLinecap="round"
                style={{ stroke: 'rgba(255, 255, 255, 0.18)' }}
              />
            ))}

            {/* Tick marks light up as the download passes them */}
            <g style={{ filter: 'drop-shadow(0 0 5px var(--primary))' }}>
              {ticks.map((tick) => (
                <line
                  key={tick.value}
                  x1={tick.inner.x}
                  y1={tick.inner.y}
                  x2={tick.outer.x}
                  y2={tick.outer.y}
                  strokeWidth={tick.isMajor ? 2 : 1.5}
                  strokeLinecap="round"
                  style={{
                    stroke: 'var(--primary)',
                    opacity: tick.value <= percent ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }}
                />
              ))}
            </g>

            {/* Scale */}
            {ticks.map((tick) => tick.label && (
              <text
                key={tick.value}
                x={tick.label.x}
                y={tick.label.y}
                dy={4}
                textAnchor="middle"
                style={{
                  fill: tick.value <= percent ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  transition: 'fill 0.3s ease-out',
                }}
              >
                {tick.value}
              </text>
            ))}

            {/* Readout */}
            <text
              x={CENTER}
              y={232}
              textAnchor="middle"
              style={{
                fill: 'var(--foreground)',
                fontFamily: 'var(--font-title)',
                fontSize: '92px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              {percent}
            </text>
            <text
              x={CENTER}
              y={266}
              textAnchor="middle"
              style={{
                fill: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.2em',
              }}
            >
              PERCENT
            </text>

            {/* Status - sits in the gap at the bottom of the dial */}
            <text
              x={CENTER}
              y={352}
              textAnchor="middle"
              style={{
                fill: 'var(--primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.3em',
              }}
            >
              {isComplete ? 'READY' : 'LOADING'}
            </text>
          </svg>

          {/* Head of the rim - rides round the dial with the progress */}
          <motion.div style={{ position: 'absolute', inset: 0, rotate: headAngle }}>
            <div
              style={{
                position: 'absolute',
                top: `${((CENTER - RIM_RADIUS) / 400) * 100}%`,
                left: '50%',
                width: '8px',
                height: '8px',
                margin: '-4px 0 0 -4px',
                borderRadius: '50%',
                backgroundColor: 'var(--foreground)',
                boxShadow: '0 0 12px 3px var(--primary), 0 0 30px 8px rgba(0, 210, 200, 0.4)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <p
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(560px, 86vw)',
            marginTop: 'clamp(24px, 5vh, 48px)',
            paddingLeft: '0.3em',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.3em',
            lineHeight: 1.8,
            textTransform: 'uppercase',
          }}
        >
          Where Luxury Meets Your Most Important Moments
        </p>
      </div>

      {/* Glowing edge of the reveal */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: revealEdge,
          opacity: revealEdgeOpacity,
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

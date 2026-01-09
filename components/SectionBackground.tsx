'use client'

interface SectionBackgroundProps {
  glowPosition?: 'top' | 'bottom' | 'both'
  gridFadeDirection?: 'down' | 'up' | 'both' | 'none'
}

export default function SectionBackground({ 
  glowPosition = 'both',
  gridFadeDirection = 'down'
}: SectionBackgroundProps) {
  
  const getGridMask = () => {
    switch (gridFadeDirection) {
      case 'down':
        return 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
      case 'up':
        return 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
      case 'both':
        return 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
      case 'none':
        return 'none'
    }
  }

  return (
    <>
      {/* Top glow */}
      {(glowPosition === 'top' || glowPosition === 'both') && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 210, 200, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Bottom glow */}
      {(glowPosition === 'bottom' || glowPosition === 'both') && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0, 210, 200, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          maskImage: getGridMask(),
          WebkitMaskImage: getGridMask(),
        }}
      />
    </>
  )
}

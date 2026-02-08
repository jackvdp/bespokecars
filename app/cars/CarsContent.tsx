'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionBackground from '@/components/SectionBackground'
import CarCard, { Car } from '@/components/CarCard'
import PrimaryButton from '@/components/PrimaryButton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { serviceOptions } from '@/lib/services'

interface Category {
  _id: string
  title: string
  slug: { current: string }
}

interface CarsContentProps {
  cars: Car[]
  categories: Category[]
}

export default function CarsContent({ cars, categories }: CarsContentProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'default' | 'low' | 'high'>('default')
  const [modalOpen, setModalOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/mjggbqnq', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setFormStatus('success')
        form.reset()
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  // Filter buttons - All + specific categories
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'supercar', label: 'Supercar' },
    { id: '4x4', label: '4x4' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'hypercar', label: 'Hypercar' },
    { id: 'limousine', label: 'Limousine' },
  ]

  // Filter cars based on active filter
  const filteredCars = activeFilter === 'all'
    ? cars
    : cars.filter(car =>
        car.category?.title.toLowerCase() === activeFilter.toLowerCase()
      )

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--foreground)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    marginBottom: '8px',
    fontFamily: 'var(--font-body)',
  }

  // Sort cars based on sort order
  const sortedCars = sortOrder === 'default'
    ? filteredCars
    : [...filteredCars].sort((a, b) => {
        const aPrice = a.priceDaily ?? null
        const bPrice = b.priceDaily ?? null
        // Cars without prices go to end
        if (aPrice === null && bPrice === null) return 0
        if (aPrice === null) return 1
        if (bPrice === null) return -1
        return sortOrder === 'low' ? aPrice - bPrice : bPrice - aPrice
      })

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '128px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' }}>
        <SectionBackground glowPosition="top" gridFadeDirection="down" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <motion.div
            style={{ textAlign: 'center', marginBottom: '48px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              marginBottom: '16px',
              display: 'block',
              fontFamily: 'var(--font-body)',
            }}>
              All Cars
            </span>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontFamily: 'var(--font-title)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '24px',
            }}>
              Find your perfect rental
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '18px',
              maxWidth: '672px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
            }}>
              Can&apos;t find what you&apos;re looking for? Our extensive partner network can source it for you.
            </p>
            <PrimaryButton onClick={() => setModalOpen(true)} size="medium">
              Special Request
            </PrimaryButton>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '64px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  padding: isMobile ? '8px 16px' : '10px 24px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: activeFilter === filter.id ? 'var(--primary)' : 'transparent',
                  color: activeFilter === filter.id ? 'black' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: activeFilter === filter.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Sort Buttons */}
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '64px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              fontFamily: 'var(--font-body)',
            }}>
              Sort:
            </span>
            {([
              { id: 'default' as const, label: 'Default' },
              { id: 'low' as const, label: 'Price: Low → High' },
              { id: 'high' as const, label: 'Price: High → Low' },
            ]).map((option) => (
              <button
                key={option.id}
                onClick={() => setSortOrder(option.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: sortOrder === option.id ? 'var(--primary)' : 'transparent',
                  color: sortOrder === option.id ? 'black' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: sortOrder === option.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section style={{ position: 'relative', paddingBottom: '128px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {sortedCars.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {sortedCars.map((car, index) => (
                <CarCard key={car._id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              style={{ textAlign: 'center', padding: '80px 0' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '18px',
                marginBottom: '24px',
                fontFamily: 'var(--font-body)',
              }}>
                No cars found in this category.
              </p>
              <PrimaryButton onClick={() => setModalOpen(true)} size="medium">
                Request This Category
              </PrimaryButton>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Special Request Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent style={{
          backgroundColor: 'var(--background)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          maxWidth: '448px',
        }}>
          <DialogHeader>
            <DialogTitle style={{
              color: 'var(--foreground)',
              fontSize: '24px',
              fontFamily: 'var(--font-title)',
              fontWeight: 600,
            }}>
              Special Request
            </DialogTitle>
            <DialogDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Can&apos;t find what you&apos;re looking for? Tell us what you need and we&apos;ll source it for you.
            </DialogDescription>
          </DialogHeader>

          {formStatus === 'success' ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 210, 200, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 style={{
                fontSize: '20px',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                color: 'var(--foreground)',
                marginBottom: '8px',
              }}>
                Request Sent!
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              }}>
                Thank you for your request. We&apos;ll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <input type="hidden" name="form_type" value="special_request" />

              <div>
                <label htmlFor="name" style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label htmlFor="phone" style={labelStyle}>
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+44 (0) 123 456 7890"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label htmlFor="service" style={labelStyle}>
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value} style={{ backgroundColor: '#000' }}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="car_request" style={labelStyle}>
                  What car are you looking for?
                </label>
                <textarea
                  id="car_request"
                  name="car_request"
                  required
                  rows={3}
                  placeholder="e.g. Ferrari 488 Spider, Rolls Royce Phantom..."
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {formStatus === 'error' && (
                <p style={{
                  color: '#ff4444',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                }}>
                  Something went wrong. Please try again.
                </p>
              )}

              <div style={{ paddingTop: '8px' }}>
                <PrimaryButton
                  type="submit"
                  size="medium"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Submit Request'}
                </PrimaryButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

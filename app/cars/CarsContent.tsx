'use client'

import { useState } from 'react'
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
    <main className="bg-[var(--background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <SectionBackground glowPosition="top" gridFadeDirection="down" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              All Cars
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-6">
              Find your perfect rental
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Can&apos;t find what you&apos;re looking for? Our extensive partner network can source it for you.
            </p>
            <PrimaryButton onClick={() => setModalOpen(true)} size="medium">
              Special Request
            </PrimaryButton>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium tracking-wide uppercase
                  transition-all duration-300 border
                  ${activeFilter === filter.id
                    ? 'bg-[var(--primary)] text-black border-[var(--primary)]'
                    : 'bg-transparent text-white/70 border-white/20 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                  }
                `}
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
      <section className="relative pb-32 px-6">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {sortedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCars.map((car, index) => (
                <CarCard key={car._id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-white/60 text-lg mb-6">
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
        <DialogContent className="bg-[var(--background)] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)] text-2xl font-[var(--font-title)]">
              Special Request
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Can&apos;t find what you&apos;re looking for? Tell us what you need and we&apos;ll source it for you.
            </DialogDescription>
          </DialogHeader>

          {formStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="text-xl font-[var(--font-title)] font-semibold text-[var(--foreground)] mb-2">
                Request Sent!
              </h4>
              <p className="text-white/60 text-sm">
                Thank you for your request. We&apos;ll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              <input type="hidden" name="form_type" value="special_request" />

              <div>
                <label htmlFor="name" className="block text-white/60 text-sm mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/60 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white/60 text-sm mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="+44 (0) 123 456 7890"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-white/60 text-sm mb-2">
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                  }}
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="car_request" className="block text-white/60 text-sm mb-2">
                  What car are you looking for?
                </label>
                <textarea
                  id="car_request"
                  name="car_request"
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  placeholder="e.g. Ferrari 488 Spider, Rolls Royce Phantom..."
                />
              </div>

              {formStatus === 'error' && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}

              <div className="pt-2">
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

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionBackground from '@/components/SectionBackground'
import CarCard, { Car } from '@/components/CarCard'
import PrimaryButton from '@/components/PrimaryButton'

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

  // Filter buttons - All + specific categories
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'supercar', label: 'Supercar' },
    { id: '4x4', label: '4x4' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'hypercar', label: 'Hypercar' },
  ]

  // Filter cars based on active filter
  const filteredCars = activeFilter === 'all'
    ? cars
    : cars.filter(car =>
        car.category?.title.toLowerCase() === activeFilter.toLowerCase()
      )

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
            <PrimaryButton href="/contact" size="medium">
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
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="relative pb-32 px-6">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car, index) => (
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
              <PrimaryButton href="/contact" size="medium">
                Request This Category
              </PrimaryButton>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

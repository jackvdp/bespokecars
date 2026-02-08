'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHero from '@/components/PageHero'
import PrimaryButton from '@/components/PrimaryButton'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { serviceOptions } from '@/lib/services'

interface Car {
  _id: string
  name: string
  slug: { current: string }
  description: string | null
  category: { title: string; slug: { current: string } } | null
  logo: SanityImageSource | null
  images: SanityImageSource[] | null
  priceDaily: number | null
  priceWeekend: number | null
  priceWeekly: number | null
}

interface CarDetailContentProps {
  car: Car
}

export default function CarDetailContent({ car }: CarDetailContentProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const images = car.images || []
  const heroImage = images[0] ? urlFor(images[0]).width(1920).height(1080).url() : undefined
  const logoUrl = car.logo ? urlFor(car.logo).width(200).height(200).url() : undefined
  const galleryImages = images.slice(1, 5) // Get images 2-5 for gallery

  const defaultDescription = `Experience the ultimate in luxury and performance with the ${car.name}. This exceptional vehicle combines stunning design with exhilarating power, making every journey an unforgettable experience.`

  const [modalOpen, setModalOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const indicativePrice = useMemo(() => {
    if (!startDate || !endDate || !car.priceDaily) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    if (days <= 0) return null
    return days * car.priceDaily
  }, [startDate, endDate, car.priceDaily])

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          carName: car.name,
          startDate: formData.get('start_date'),
          endDate: formData.get('end_date'),
          service: formData.get('service'),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          indicativePrice: indicativePrice,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setFormStatus('success')
    } catch {
      setFormStatus('error')
    }
  }

  const handleModalChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      setFormStatus('idle')
      setStartDate('')
      setEndDate('')
    }
  }

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

  return (
    <main style={{ backgroundColor: 'var(--background)' }}>
      <Navbar backHref="/cars" backLabel="All Cars" />

      {heroImage ? (
        <PageHero
          label={car.category?.title || 'Luxury Vehicle'}
          title={car.name}
          description=""
          buttonText="Book Now"
          onButtonClick={() => setModalOpen(true)}
          backgroundImage={heroImage}
          backgroundAlt={car.name}
          logoUrl={logoUrl}
        />
      ) : (
        <section style={{ position: 'relative', paddingTop: '160px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            {logoUrl && (
              <motion.div
                style={{
                  margin: '0 auto 32px',
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                  <Image
                    src={logoUrl}
                    alt=""
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </motion.div>
            )}
            <motion.span
              style={{
                color: 'var(--primary)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                marginBottom: '24px',
                display: 'block',
                fontFamily: 'var(--font-body)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {car.category?.title || 'Luxury Vehicle'}
            </motion.span>
            <motion.h1
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--foreground)',
                marginBottom: '32px',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {car.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PrimaryButton onClick={() => setModalOpen(true)} size="large">
                Book Now
              </PrimaryButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* Description Section */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '48px 16px' : '80px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontFamily: 'var(--font-title)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '24px',
            }}>
              {car.name}
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '18px',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
            }}>
              {car.description || defaultDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      {(car.priceDaily || car.priceWeekend || car.priceWeekly) && (
        <section style={{ position: 'relative', padding: '0 24px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '40px',
                overflow: 'hidden',
              }}
            >
              {/* Cyan accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '40px',
                right: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                opacity: 0.6,
              }} />

              {/* Price columns */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0',
              }}>
                {/* Daily */}
                {car.priceDaily && (
                  <>
                    <div style={{
                      flex: isMobile ? undefined : '1 1 200px',
                      width: isMobile ? '100%' : undefined,
                      textAlign: 'center',
                      padding: '16px 24px',
                    }}>
                      <p style={{
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px',
                      }}>
                        Daily (Mon–Thu)
                      </p>
                      <p style={{
                        color: 'var(--foreground)',
                        fontSize: '34px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        letterSpacing: '-0.02em',
                      }}>
                        £{car.priceDaily.toLocaleString()}
                      </p>
                    </div>
                    {!isMobile && (car.priceWeekend || car.priceWeekly) && (
                      <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                        opacity: 0.5,
                        flexShrink: 0,
                      }} />
                    )}
                  </>
                )}

                {/* Weekend */}
                {car.priceWeekend && (
                  <>
                    <div style={{
                      flex: isMobile ? undefined : '1 1 200px',
                      width: isMobile ? '100%' : undefined,
                      textAlign: 'center',
                      padding: '16px 24px',
                    }}>
                      <p style={{
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const,
                        fontFamily: 'var(--font-body)',
                        marginBottom: '12px',
                      }}>
                        Weekend
                      </p>
                      <p style={{
                        color: 'var(--foreground)',
                        fontSize: '34px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-title)',
                        letterSpacing: '-0.02em',
                      }}>
                        £{car.priceWeekend.toLocaleString()}
                      </p>
                    </div>
                    {!isMobile && car.priceWeekly && (
                      <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(180deg, transparent, var(--primary), transparent)',
                        opacity: 0.5,
                        flexShrink: 0,
                      }} />
                    )}
                  </>
                )}

                {/* Weekly */}
                {car.priceWeekly && (
                  <div style={{
                    flex: isMobile ? undefined : '1 1 200px',
                    width: isMobile ? '100%' : undefined,
                    textAlign: 'center',
                    padding: '16px 24px',
                  }}>
                    <p style={{
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      fontFamily: 'var(--font-body)',
                      marginBottom: '12px',
                    }}>
                      Full Week
                    </p>
                    <p style={{
                      color: 'var(--foreground)',
                      fontSize: '34px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-title)',
                      letterSpacing: '-0.02em',
                    }}>
                      £{car.priceWeekly.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                marginTop: '24px',
              }}>
                Prices are indicative. Contact us for a personalised quote.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section style={{ position: 'relative', paddingBottom: '128px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            {/* Large Image */}
            {galleryImages[0] && (
              <motion.div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '21/9',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={urlFor(galleryImages[0]).width(1680).height(720).url()}
                  alt={`${car.name} gallery 1`}
                  fill
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
            )}

            {/* Three Images Row */}
            {galleryImages.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '24px',
              }}>
                {galleryImages.slice(1, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={urlFor(image).width(560).height(420).url()}
                      alt={`${car.name} gallery ${index + 2}`}
                      fill
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '48px 16px' : '80px 24px',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontFamily: 'var(--font-title)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '16px',
            }}>
              Ready to experience the {car.name}?
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '18px',
              marginBottom: '32px',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}>
              Contact us today to book this exceptional vehicle for your next event.
            </p>
            <PrimaryButton onClick={() => setModalOpen(true)} size="large">
              Get in Touch
            </PrimaryButton>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalChange}>
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
              Book the {car.name}
            </DialogTitle>
            <DialogDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Select your dates and service to request a booking.
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
                Booking Request Sent!
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              }}>
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <input type="hidden" name="form_type" value="booking_request" />
              <input type="hidden" name="car" value={car.name} />

              {/* Date fields side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="booking-start-date" style={labelStyle}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="booking-start-date"
                    name="start_date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      if (endDate && e.target.value > endDate) {
                        setEndDate('')
                      }
                    }}
                    style={{
                      ...inputStyle,
                      colorScheme: 'dark',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>
                <div>
                  <label htmlFor="booking-end-date" style={labelStyle}>
                    End Date
                  </label>
                  <input
                    type="date"
                    id="booking-end-date"
                    name="end_date"
                    required
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      ...inputStyle,
                      colorScheme: 'dark',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>
              </div>

              {/* Service select */}
              <div>
                <label htmlFor="booking-service" style={labelStyle}>
                  Service
                </label>
                <select
                  id="booking-service"
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

              {/* Name */}
              <div>
                <label htmlFor="booking-name" style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  id="booking-name"
                  name="name"
                  required
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="booking-email" style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  id="booking-email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="booking-phone" style={labelStyle}>
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="booking-phone"
                  name="phone"
                  placeholder="+44 (0) 123 456 7890"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {/* Indicative Price */}
              {indicativePrice !== null && (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                }}>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase' as const,
                    fontFamily: 'var(--font-body)',
                    marginBottom: '8px',
                  }}>
                    Indicative Price
                  </p>
                  <p style={{
                    color: 'var(--primary)',
                    fontSize: '28px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-title)',
                    letterSpacing: '-0.02em',
                  }}>
                    £{indicativePrice.toLocaleString()}
                  </p>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    marginTop: '8px',
                  }}>
                    Final price may vary based on service and availability.
                  </p>
                </div>
              )}

              {/* Error message */}
              {formStatus === 'error' && (
                <p style={{
                  color: '#ff4444',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                }}>
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Submit */}
              <div style={{ paddingTop: '8px' }}>
                <PrimaryButton type="submit" size="medium" disabled={formStatus === 'submitting'}>
                  {formStatus === 'submitting' ? 'Sending...' : 'Request Booking'}
                </PrimaryButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

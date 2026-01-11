'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrimaryButton from '@/components/PrimaryButton'
import SectionBackground from '@/components/SectionBackground'
import { contactInfo, mapEmbedUrl } from '@/lib/contactData'

export default function ContactPage() {
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

  return (
    <main className="bg-[var(--background)]">
      <Navbar />

      {/* Hero Section with Map Background */}
      <section className="relative min-h-screen">
        {/* Map Background */}
        <div className="absolute inset-0">
          <iframe
            src={mapEmbedUrl}
            className="w-full h-full border-0"
            style={{
              filter: 'grayscale(100%) invert(92%) contrast(0.9)',
            }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, black 80%)',
        }} />

        {/* Content */}
        <div className="relative z-20 pt-32 pb-48 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <motion.span
              className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-6 block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Contact Us
            </motion.span>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Our team is ready to help
            </motion.h1>
            <motion.p
              className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Whether you need a specific service or have a particular car in mind, just let us know. Don&apos;t see what you&apos;re looking for? Our network can source it for you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PrimaryButton href="#contact-form" size="large">
                Get in touch
              </PrimaryButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Details & Form Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="both" gridFadeDirection="down" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              Contact Details
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)]">
              Get in touch with us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Cards */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {contactInfo.map((info, index) => {
                const CardWrapper = info.href ? motion.a : motion.div
                return (
                  <CardWrapper
                    key={info.title}
                    href={info.href}
                    className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-4 no-underline"
                    style={{ cursor: info.href ? 'pointer' : 'default' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'var(--primary)',
                    }}
                  >
                    <div className="text-[var(--primary)] flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-[var(--foreground)] text-lg font-semibold font-[var(--font-title)] mb-2 tracking-tight">
                        {info.title}
                      </h3>
                      {info.content.map((line) => (
                        <p
                          key={line}
                          className="text-white/60 text-sm font-[var(--font-body)] leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardWrapper>
                )
              })}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              id="contact-form"
              className="relative p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Accent line */}
              <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

              <h3 className="text-2xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-8">
                Send your message
              </h3>

              {formStatus === 'success' ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-[var(--font-title)] font-semibold text-[var(--foreground)] mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-white/60 text-sm">
                    Thank you for reaching out. We&apos;ll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white/60 text-sm font-[var(--font-body)] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] font-[var(--font-body)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white/60 text-sm font-[var(--font-body)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] font-[var(--font-body)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-white/60 text-sm font-[var(--font-body)] mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] font-[var(--font-body)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors"
                      placeholder="+44 (0) 123 456 7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-white/60 text-sm font-[var(--font-body)] mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] font-[var(--font-body)] focus:outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                      }}
                    >
                      <option value="">Select a service</option>
                      <option value="wedding">Wedding Car Hire</option>
                      <option value="photoshoot">Photoshoot & Film Hire</option>
                      <option value="limousine">Limousine Service</option>
                      <option value="self-drive">Self Drive Experience</option>
                      <option value="corporate">Corporate & Event Hire</option>
                      <option value="chauffeur">Private Chauffeur Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white/60 text-sm font-[var(--font-body)] mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[var(--foreground)] font-[var(--font-body)] placeholder-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  {formStatus === 'error' && (
                    <p className="text-red-400 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  )}

                  <div className="pt-2">
                    <PrimaryButton
                      type="submit"
                      size="large"
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

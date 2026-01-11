'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrimaryButton from '@/components/PrimaryButton'
import SectionBackground from '@/components/SectionBackground'
import PageHero from '@/components/PageHero'

const whyChooseUsItems = [
  {
    title: 'Unmatched Experience',
    description: 'With over 25 years in the luxury car rental industry, we understand that every occasion is unique. Our extensive experience has taught us to anticipate needs, exceed expectations, and deliver flawless service when it matters most.',
    image: '/images/about/showroom.avif',
  },
  {
    title: 'Curated Excellence',
    description: 'Every vehicle in our fleet is hand-selected for exceptional quality, performance, and style. From classic wedding cars to cutting-edge supercars, each vehicle undergoes meticulous maintenance and professional detailing to ensure pristine condition.',
    image: '/images/about/bentley.avif',
  },
  {
    title: 'Comprehensive Service',
    description: 'Beyond providing beautiful vehicles, we offer complete peace of mind. Full insurance coverage, flexible scheduling, professional delivery, and 24/7 customer support ensure your experience is seamless from start to finish.',
    image: '/images/about/mclaren.avif',
  },
  {
    title: 'Trusted by Thousands',
    description: 'Our reputation speaks for itself. From intimate weddings to high-profile corporate events, discerning clients across the UK trust us to deliver exceptional vehicles and service for their most important moments.',
    image: '/images/about/backlight.avif',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-[var(--background)]">
      <Navbar />

      <PageHero
        label="About Us"
        title="Where Luxury Meets Your Most Important Moments"
        description="For over 25 years, we've been creating unforgettable experiences through exceptional luxury car rentals and unparalleled service across the UK."
        buttonText="Our Services"
        buttonHref="/#services"
        backgroundImage="/images/cars/ferrarilondon.jpeg"
        backgroundAlt="Ferrari in London"
      />

      {/* Why Choose Us Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="both" gridFadeDirection="down" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)]">
              Your Luxury Experience, Perfected
            </h2>
          </motion.div>

          {/* Alternating rows */}
          <div className="flex flex-col gap-24">
            {whyChooseUsItems.map((item, index) => (
              <motion.div
                key={item.title}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <motion.div
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[var(--primary)]"
                    style={{ boxShadow: '0 0 30px rgba(0, 210, 200, 0.2)' }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-6">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-base md:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Banner */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src="/images/about/driver.avif"
          alt="Professional chauffeur"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30" />
      </section>

      {/* Excellence Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="top" gridFadeDirection="up" />

        <div className="max-w-[900px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-10">
              Excellence in Every Detail
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 text-white/60 text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>
              At the heart of our business is an unwavering commitment to excellence. We believe that luxury isn&#39;t just about the vehicles we provide – it&#39;s about the entire experience we create for our clients.
            </p>
            <p>
              Every interaction, from your initial inquiry to the moment you return your vehicle, is handled with the utmost care and professionalism. We understand that we&#39;re not just renting cars; we&#39;re helping create memories that will last a lifetime.
            </p>
            <p>
              Whether you&#39;re planning your dream wedding, organizing a corporate event, or embarking on a creative project, we&#39;re here to ensure that your transportation is one less thing to worry about – and one more reason to celebrate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="bottom" gridFadeDirection="down" />

        <div className="max-w-[900px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-6">
              Ready to book a car or private service?
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Book one of our luxury vehicles for your special day, arrange professional chauffeur services, or let us source that specific car you&#39;ve been searching for through our extensive network.
            </p>
            <PrimaryButton href="/contact" size="large">
              Contact Us
            </PrimaryButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

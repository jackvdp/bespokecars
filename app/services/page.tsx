'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import SectionBackground from '@/components/SectionBackground'
import PageHero from '@/components/PageHero'

const services = [
  {
    title: 'Wedding Car Hire',
    description: "Make your special day unforgettable with our curated collection of luxury wedding cars. With over 10,000 successful weddings completed, we're the UK's most trusted wedding car specialists, ensuring your arrival is as perfect as your celebration.",
    image: '/images/services/wedding.avif',
    href: '/services/wedding',
  },
  {
    title: 'Photoshoot & Film Hire',
    description: 'Elevate your creative projects with our stunning supercar and luxury vehicle collection. Perfect for high-end photoshoots, commercials, and film productions. Our 15+ years of industry experience ensures seamless service for any creative vision.',
    image: '/images/services/photoshoot.avif',
    href: '/services/photoshoot',
  },
  {
    title: 'Limousine Service',
    description: 'Arrive in ultimate style with our premium limousine service. Perfect for hen and stag parties, prom nights, group celebrations, and special occasions where you want to make a grand entrance. Spacious luxury interiors and professional service for unforgettable group experiences.',
    image: '/images/services/limousine.avif',
    href: '/services/limousine',
  },
  {
    title: 'Self Drive Experience',
    description: "Indulge in the ultimate driving experience with our premium self-drive rentals. Whether it's a weekend adventure or an extended journey, experience luxury and performance as you explore London and beyond in style.",
    image: '/images/services/selfdrive.jpg',
    href: '/services/self-drive',
  },
  {
    title: 'Corporate & Event Hire',
    description: 'Enhance your corporate image with our prestigious vehicle collection. Perfect for executive transportation, marketing campaigns, product launches, and VIP events. Custom branding and decal application available for maximum impact.',
    image: '/images/services/corporate.avif',
    href: '/services/corporate',
  },
  {
    title: 'Private Chauffeur Services',
    description: 'Experience true luxury with our professional chauffeur service. Our expertly trained drivers provide discreet, reliable transportation for business meetings, special occasions, and VIP experiences. Sit back and enjoy the journey while we handle every detail.',
    image: '/images/services/chauffer.avif',
    href: '/services/chauffeur',
  },
]

export default function ServicesPage() {
  return (
    <main className="bg-[var(--background)]">
      <Navbar />

      <PageHero
        label="Our Services"
        title="Premium luxury vehicles and white-glove service for life's most significant occasions"
        description="Trusted by discerning clients across the UK for over two decades."
        buttonText="Book Our Service"
        buttonHref="/contact"
        backgroundImage="/images/services/carglove.jpeg"
        backgroundAlt="Ferrari in London"
      />

      {/* We're Here to Help Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="top" gridFadeDirection="down" />

        <div className="max-w-[900px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-8">
              We're here to help you
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-6">
              Whether you're planning a dream wedding, organising a photoshoot, or need a luxury vehicle for a special occasion, our experienced team is ready to make your vision a reality. Get in touch today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase">
                Premium Service
              </span>
              <span className="hidden sm:block w-px h-4 bg-white/20" />
              <span className="text-white/40 text-sm tracking-wide">
                Over 15 years of excellence
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="both" gridFadeDirection="both" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="group relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.08] hover:border-[var(--primary)] transition-colors duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl md:text-2xl font-[var(--font-title)] font-semibold tracking-tight text-[var(--foreground)] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <SecondaryButton href={service.href} size="small">
                    Our Service
                  </SecondaryButton>
                </div>

                {/* Accent line */}
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Fleet Section */}
      <section className="relative py-[120px] px-6">
        <SectionBackground glowPosition="bottom" gridFadeDirection="up" />

        <div className="max-w-[900px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[var(--primary)] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              Premium Fleet
            </span>
            <div className="space-y-6 text-white/60 text-base md:text-lg leading-relaxed">
              <p>
                Experience unparalleled service tailored to your most important moments. Our commitment to excellence means every detail is carefully managed, from initial consultation to final delivery, ensuring your luxury car rental exceeds expectations.
              </p>
              <p>
                We understand that exceptional occasions deserve exceptional service. Our comprehensive approach includes flexible scheduling, professional vehicle delivery, full insurance coverage, and 24/7 support throughout your rental experience.
              </p>
            </div>
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
              Book one of our luxury vehicles for your special day, arrange professional chauffeur services, or let us source that specific car you've been searching for through our extensive network.
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

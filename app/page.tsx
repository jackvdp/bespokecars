'use client'

import ScrollVideo, { TextOverlay } from "@/components/ScrollVideo";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import ServiceOverlay, { ServiceOverlayData } from "@/components/ServiceOverlay";

const heroOverlays: TextOverlay[] = [
  {
    text: "Trusted by Thousands",
    subtext: "10,000+ successful events across the UK",
    startProgress: 0,
    endProgress: 0.2
  },
  {
    text: "15+ Years of Excellence",
    subtext: "Creating unforgettable experiences since day one",
    startProgress: 0.2,
    endProgress: 0.4
  },
  {
    text: "Hand-Selected Fleet",
    subtext: "Every vehicle curated for quality, performance & style",
    startProgress: 0.4,
    endProgress: 0.6
  },
  {
    text: "Complete Peace of Mind",
    subtext: "Full insurance • 24/7 support • Professional delivery",
    startProgress: 0.6,
    endProgress: 0.8
  },
  {
    text: "Your Vision, Perfected",
    subtext: "Weddings • Film • Corporate • Private hire",
    startProgress: 0.8,
    endProgress: 1
  }
];

const serviceOverlays: ServiceOverlayData[] = [
  {
    label: "Our Services",
    heading: "Wedding Car Hire",
    services: [
      {
        icon: "💒",
        title: "Bridal Arrivals",
        description: "Make a grand entrance on your special day"
      },
      {
        icon: "📸",
        title: "Photo Opportunities",
        description: "Stunning backdrops for your wedding album"
      },
      {
        icon: "🎀",
        title: "Decorated Vehicles",
        description: "Ribbons and flowers to match your theme"
      },
      {
        icon: "👨‍✈️",
        title: "Professional Chauffeurs",
        description: "Immaculately presented, experienced drivers"
      },
    ],
    startProgress: 0,
    endProgress: 0.35
  },
  {
    label: "Our Services",
    heading: "Film & Photoshoot Hire",
    services: [
      {
        icon: "🎬",
        title: "Production Ready",
        description: "Vehicles prepped for camera-ready appearances"
      },
      {
        icon: "🚗",
        title: "Diverse Fleet",
        description: "From vintage classics to modern supercars"
      },
      {
        icon: "📍",
        title: "Location Flexible",
        description: "Delivery anywhere in the UK"
      },
      {
        icon: "⏰",
        title: "Flexible Scheduling",
        description: "Full-day and multi-day bookings available"
      },
    ],
    startProgress: 0.35,
    endProgress: 0.65
  },
  {
    label: "Our Services",
    heading: "Corporate & Events",
    services: [
      {
        icon: "🏢",
        title: "Executive Transport",
        description: "Impress clients with premium arrivals"
      },
      {
        icon: "🎉",
        title: "Event Displays",
        description: "Showcase vehicles at your venue"
      },
      {
        icon: "🏷️",
        title: "Custom Branding",
        description: "Decals and wraps for marketing campaigns"
      },
      {
        icon: "👥",
        title: "Fleet Bookings",
        description: "Multiple vehicles for large events"
      },
    ],
    startProgress: 0.65,
    endProgress: 1
  }
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <ScrollVideo
        src="/videos/cars-optimised.mp4"
        textOverlays={heroOverlays}
        scrollHeight="300vh"
      />
      <HowItWorks />
      <ScrollVideo
        src="/videos/lambo-optimised.mp4"
        scrollHeight="400vh"
        customOverlay={(activeIndex) => (
          <ServiceOverlay data={serviceOverlays} activeIndex={activeIndex} />
        )}
        textOverlays={serviceOverlays.map(s => ({ 
          text: '', 
          startProgress: s.startProgress, 
          endProgress: s.endProgress 
        }))}
      />
    </main>
  );
}

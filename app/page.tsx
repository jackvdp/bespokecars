'use client'

import ScrollVideo, { TextOverlay } from "@/components/ScrollVideo";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import ServiceOverlay, { ServiceOverlayData } from "@/components/ServiceOverlay";

const heroOverlays: TextOverlay[] = [
  {
    text: "Luxury Car Rental",
    subtext: "Premium supercars & classics for your special moments",
    startProgress: 0,
    endProgress: 0.27
  },
  {
    text: "Trusted by Thousands",
    subtext: "10,000+ successful events across the UK",
    startProgress: 0.23,
    endProgress: 0.52
  },
  {
    text: "25+ Years of Excellence",
    subtext: "Creating unforgettable experiences since day one",
    startProgress: 0.48,
    endProgress: 0.77
  },
  {
    text: "Complete Peace of Mind",
    subtext: "Full insurance • 24/7 support • Professional delivery",
    startProgress: 0.73,
    endProgress: 1
  }
];

const serviceOverlays: ServiceOverlayData[] = [
  {
    label: "Our Services",
    heading: "Weddings & Special Occasions",
    services: [
      {
        title: "Wedding Car Hire",
        description: "Stunning arrivals with decorated vehicles and professional chauffeurs"
      },
      {
        title: "Prom & Celebrations",
        description: "Make memories with head-turning arrivals at proms and parties"
      },
      {
        title: "Film & Photoshoots",
        description: "Camera-ready vehicles with flexible scheduling and UK-wide support"
      },
    ],
    startProgress: 0,
    endProgress: 0.38
  },
  {
    label: "Our Services",
    heading: "Corporate & Executive",
    services: [
      {
        title: "Corporate Events",
        description: "Impress clients with premium vehicle displays and executive transport"
      },
      {
        title: "Chauffeur Services",
        description: "Professional drivers for business travel and VIP transportation"
      },
      {
        title: "Close Protection",
        description: "Discreet, secure transportation with trained security-cleared drivers"
      },
    ],
    startProgress: 0.32,
    endProgress: 0.68
  },
  {
    label: "Our Services",
    heading: "Bespoke Solutions",
    services: [
      {
        title: "Custom Packages",
        description: "Tailored solutions designed around your specific requirements"
      },
      {
        title: "Vehicle Leasing",
        description: "Flexible leasing options to drive your dream car on your terms"
      },
      {
        title: "Nationwide Delivery",
        description: "Professional delivery and collection anywhere in the UK"
      },
    ],
    startProgress: 0.62,
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
        contentFadeIn={0.15}
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

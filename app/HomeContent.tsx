'use client'

import { useState, useCallback } from "react";
import ScrollVideo, { TextOverlay } from "@/components/ScrollVideo";
import ScrollVideoSimple from "@/components/ScrollVideoSimple";
import ServicesScrollContent from "@/components/ServicesScrollContent";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import FleetContactSection from "@/components/FleetContactSection";
import Footer from "@/components/Footer";

interface Car {
  _id: string
  name: string
  slug: { current: string }
  category: { title: string } | null
  logoUrl: string | null
  imageUrls: string[] | null
}

interface HomeContentProps {
  cars: Car[]
}

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

export default function HomeContent({ cars }: HomeContentProps) {
  const [isFirstVideoLoaded, setIsFirstVideoLoaded] = useState(false);
  const [isSecondVideoStarted, setIsSecondVideoStarted] = useState(false);

  const handleFirstVideoLoad = useCallback(() => {
    setIsFirstVideoLoaded(true);
    // Start loading second video immediately after first is ready
    setIsSecondVideoStarted(true);
  }, []);

  const handleSecondVideoStart = useCallback(() => {
    console.log('Second video started loading');
  }, []);

  return (
    <main>
      <Navbar />
      <ScrollVideo
        src="/videos/cars-optimised.mp4"
        textOverlays={heroOverlays}
        scrollHeight="750vh"
        priority={true}
        onLoadComplete={handleFirstVideoLoad}
      />
      <HowItWorks />
      <ScrollVideoSimple
        src="/videos/lambo-optimised.mp4"
        scrollHeight="750vh"
        lazy={!isSecondVideoStarted}
        onLoadStart={handleSecondVideoStart}
      >
        {(scrollYProgress) => (
          <ServicesScrollContent scrollYProgress={scrollYProgress} />
        )}
      </ScrollVideoSimple>
      <FleetContactSection cars={cars} />
      <Footer />
      <LoadingScreen isLoading={true} />
    </main>
  );
}

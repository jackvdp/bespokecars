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
import { Car } from "@/components/CarCard";

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
  const [firstVideoProgress, setFirstVideoProgress] = useState(0);
  const [isFirstVideoLoaded, setIsFirstVideoLoaded] = useState(false);

  const handleFirstVideoLoad = useCallback(() => {
    setIsFirstVideoLoaded(true);
  }, []);

  return (
    <main>
      <Navbar />
      <ScrollVideo
        src="/videos/cars-optimised.mp4"
        textOverlays={heroOverlays}
        scrollHeight="750vh"
        onLoadProgress={setFirstVideoProgress}
        onLoadComplete={handleFirstVideoLoad}
      />
      <HowItWorks />
      <ScrollVideoSimple
        src="/videos/lambo-optimised.mp4"
        scrollHeight="750vh"
        // Starts downloading once the first video is fully downloaded, so the two don't compete
        enabled={isFirstVideoLoaded}
      >
        {(scrollYProgress) => (
          <ServicesScrollContent scrollYProgress={scrollYProgress} />
        )}
      </ScrollVideoSimple>
      <FleetContactSection cars={cars} />
      <Footer />
      <LoadingScreen isLoading={!isFirstVideoLoaded} progress={firstVideoProgress} />
    </main>
  );
}

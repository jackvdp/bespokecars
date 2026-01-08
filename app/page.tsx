import ScrollVideo, { TextOverlay } from "@/components/ScrollVideo";

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

export default function Home() {
  return (
    <main>
      <ScrollVideo 
        src="/videos/cars.mp4" 
        textOverlays={heroOverlays}
      />
    </main>
  );
}

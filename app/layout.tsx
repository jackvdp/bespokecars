import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bespoke Cars - Luxury Car Rental UK | Wedding Cars, Chauffeur Service & Supercar Hire",
  description: "Premium luxury car rental with 15+ years of excellence. Trusted for weddings, photoshoots, corporate events & special occasions. Full insurance, 24/7 support, professional delivery across the UK.",
  keywords: "luxury car rental, wedding cars, chauffeur service, supercar hire, limousine service, corporate car hire, photoshoot vehicles, UK car rental, London luxury cars",
  authors: [{ name: "Bespoke Cars" }],
  openGraph: {
    title: "Bespoke Cars - Where Luxury Meets Your Most Important Moments",
    description: "Premium luxury car rental with 15+ years of excellence. 10,000+ successful events completed across the UK. Full insurance, 24/7 support, professional delivery.",
    url: "https://bespokecars.co.uk",
    siteName: "Bespoke Cars",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bespoke Cars - Luxury Car Rental UK",
    description: "Premium luxury car rental for weddings, photoshoots, corporate events & special occasions. 15+ years of excellence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import AIAssistant from '@/components/AIAssistant';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: 'swap',
});

export const viewport = {
  themeColor: "#FFD700",
}

export const metadata: Metadata = {
  metadataBase: new URL('https://car-bazar-two.vercel.app'),
  title: "FRIENDS CAR BAZAR | Best 2nd Hand Cars & Bikes in Khammam",
  description: "Buy and Sell quality second-hand cars and bikes in Khammam. Located near Kotta Busstand, RR Public School Beside, Bypassroad Khammam.",
  keywords: ["second hand cars khammam", "used bikes khammam", "buy car khammam", "friends car bazar", "used cars in telangana", "pre-owned cars khammam"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Car Bazar",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "FRIENDS CAR BAZAR | Best 2nd Hand Cars & Bikes in Khammam",
    description: "Buy and Sell quality second-hand cars and bikes in Khammam. Quality tested vehicles at best prices.",
    url: 'https://car-bazar-two.vercel.app',
    siteName: 'Friends Car Bazar',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FRIENDS CAR BAZAR | Best 2nd Hand Cars & Bikes in Khammam",
    description: "Buy and Sell quality second-hand cars and bikes in Khammam.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-secondary min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          <AIAssistant />
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

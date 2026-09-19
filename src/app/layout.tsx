import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//Components
import Navbar from "@/shared/layouts/Navbar";
import { Footer } from "@/shared/layouts/Footer";
import { AuthNav } from "@/features/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexCoin",
  description: "NexCoin - la dashboard più efficente per gestire le tue crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar authSlot={<AuthNav />} />
        {children}
      <Footer />
      </body>
    </html>
  );
}

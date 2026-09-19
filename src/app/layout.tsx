import type { Metadata } from "next";
import { Suspense } from "react";
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

/** Placeholder the width of the auth control, so the navbar does not jump. */
function AuthNavFallback() {
  return <div className="h-[30px] w-[30px] md:w-24" aria-hidden="true" />;
}

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
      {/*
        AuthNav reads the session, which is a runtime API. Without this
        boundary it would make every route in the app dynamic — under
        cacheComponents it fails the build outright. Inside it, the static
        shell prerenders and only the auth control streams in.
      */}
      <Navbar
        authSlot={
          <Suspense fallback={<AuthNavFallback />}>
            <AuthNav />
          </Suspense>
        }
      />
        {children}
      <Footer />
      </body>
    </html>
  );
}

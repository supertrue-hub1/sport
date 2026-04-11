"use client";

import { Header } from "@/components/sports/Header";
import { HeroSection } from "@/components/sports/HeroSection";
import { LatestNews } from "@/components/sports/LatestNews";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { TrendingWidget } from "@/components/sports/TrendingWidget";
import { LiveTicker } from "@/components/sports/LiveTicker";
import { Footer } from "@/components/sports/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <LiveTicker />
        <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LatestNews />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <StandingsTable />
              <TrendingWidget />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

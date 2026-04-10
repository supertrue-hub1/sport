"use client";

import { Header } from "@/components/sports/Header";
import { HeroSection } from "@/components/sports/HeroSection";
import { LiveTicker } from "@/components/sports/LiveTicker";
import { LatestNews } from "@/components/sports/LatestNews";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { TrendingWidget } from "@/components/sports/TrendingWidget";
import { Footer } from "@/components/sports/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <LiveTicker />
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <HeroSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
            {/* Main Content - News Grid */}
            <div className="lg:col-span-8">
              <LatestNews />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <StandingsTable />
              <TrendingWidget />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

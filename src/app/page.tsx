"use client";

import { Header } from "@/components/sports/Header";
import { HeroSection } from "@/components/sports/HeroSection";
import { LiveTicker } from "@/components/sports/LiveTicker";
import { FeaturedStories } from "@/components/sports/FeaturedStories";
import { DeepStats } from "@/components/sports/DeepStats";
import { PlayerComparison } from "@/components/sports/PlayerComparison";
import { MatchTimeline } from "@/components/sports/MatchTimeline";
import { Gamification } from "@/components/sports/Gamification";
import { LatestNews } from "@/components/sports/LatestNews";
import { Footer } from "@/components/sports/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <LiveTicker />
        <FeaturedStories />
        <DeepStats />
        <PlayerComparison />
        <MatchTimeline />
        <Gamification />
        <LatestNews />
      </main>
      <Footer />
    </div>
  );
}

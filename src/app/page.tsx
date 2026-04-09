"use client";

import { Header } from "@/components/sports/Header";
import { HeroSection } from "@/components/sports/HeroSection";
import { LiveTicker } from "@/components/sports/LiveTicker";
import { FeaturedStories } from "@/components/sports/FeaturedStories";
import { CinematicQuote } from "@/components/sports/CinematicQuote";
import { DeepStats } from "@/components/sports/DeepStats";
import { PlayerComparison } from "@/components/sports/PlayerComparison";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { MatchTimeline } from "@/components/sports/MatchTimeline";
import { CinematicQuote as CinematicQuote2 } from "@/components/sports/CinematicQuote";
import { PowerRankings } from "@/components/sports/PowerRankings";
import { Gamification } from "@/components/sports/Gamification";
import { LatestNews } from "@/components/sports/LatestNews";
import { Footer } from "@/components/sports/Footer";
import { BackToTop } from "@/components/sports/BackToTop";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <LiveTicker />
        <FeaturedStories />
        <CinematicQuote variant={0} />
        <DeepStats />
        <PlayerComparison />
        <StandingsTable />
        <MatchTimeline />
        <CinematicQuote variant={1} />
        <PowerRankings />
        <Gamification />
        <LatestNews />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

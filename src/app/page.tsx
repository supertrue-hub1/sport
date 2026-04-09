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
import { WinProbabilityChart } from "@/components/sports/WinProbabilityChart";
import { PowerRankings } from "@/components/sports/PowerRankings";
import { TopHighlights } from "@/components/sports/TopHighlights";
import { TradeTracker } from "@/components/sports/TradeTracker";
import { InjuryReport } from "@/components/sports/InjuryReport";
import { SportsHistory } from "@/components/sports/SportsHistory";
import { FanPoll } from "@/components/sports/FanPoll";
import { FantasyQuickStart } from "@/components/sports/FantasyQuickStart";
import { StatsBanner } from "@/components/sports/StatsBanner";
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
        <StatsBanner />
        <FeaturedStories />
        <CinematicQuote variant={0} />
        <TopHighlights />
        <DeepStats />
        <PlayerComparison />
        <StandingsTable />
        <MatchTimeline />
        <WinProbabilityChart />
        <CinematicQuote variant={1} />
        <PowerRankings />
        <TradeTracker />
        <InjuryReport />
        <FanPoll />
        <SportsHistory />
        <FantasyQuickStart />
        <Gamification />
        <LatestNews />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

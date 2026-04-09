"use client";

import { Header } from "@/components/sports/Header";
import { HeroSection } from "@/components/sports/HeroSection";
import { LiveTicker } from "@/components/sports/LiveTicker";
import { FeaturedStories } from "@/components/sports/FeaturedStories";
import { CinematicQuote } from "@/components/sports/CinematicQuote";
import { TopHighlights } from "@/components/sports/TopHighlights";
import { DeepStats } from "@/components/sports/DeepStats";
import { PlayerComparison } from "@/components/sports/PlayerComparison";
import { StandingsTable } from "@/components/sports/StandingsTable";
import { MatchTimeline } from "@/components/sports/MatchTimeline";
import { WinProbabilityChart } from "@/components/sports/WinProbabilityChart";
import { UpcomingGames } from "@/components/sports/UpcomingGames";
import { PowerRankings } from "@/components/sports/PowerRankings";
import { TradeTracker } from "@/components/sports/TradeTracker";
import { InjuryReport } from "@/components/sports/InjuryReport";
import { FanPoll } from "@/components/sports/FanPoll";
import { SocialFeed } from "@/components/sports/SocialFeed";
import { SportsHistory } from "@/components/sports/SportsHistory";
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
        <UpcomingGames />
        <StandingsTable />
        <MatchTimeline />
        <WinProbabilityChart />
        <CinematicQuote variant={1} />
        <PowerRankings />
        <TradeTracker />
        <InjuryReport />
        <FanPoll />
        <SocialFeed />
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

"use client";

import { motion } from "framer-motion";

const LIVE_GAMES = [
  { home: "Chiefs", away: "Ravens", homeScore: 24, awayScore: 21, quarter: "Q4 2:31", sport: "NFL" },
  { home: "Lakers", away: "Celtics", homeScore: 98, awayScore: 102, quarter: "Q3 8:15", sport: "NBA" },
  { home: "Yankees", away: "Dodgers", homeScore: 5, awayScore: 3, quarter: "Top 7th", sport: "MLB" },
  { home: "Oilers", away: "Panthers", homeScore: 3, awayScore: 2, quarter: "2nd 14:22", sport: "NHL" },
  { home: "Eagles", away: "Cowboys", homeScore: 17, awayScore: 14, quarter: "Q2 6:45", sport: "NFL" },
  { home: "Bucks", away: "76ers", homeScore: 85, awayScore: 82, quarter: "HALF", sport: "NBA" },
];

export function LiveTicker() {
  const doubled = [...LIVE_GAMES, ...LIVE_GAMES];

  return (
    <section className="relative border-y border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center">
        {/* LIVE Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 border-r border-white/5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 pulse-glow-red" />
          </span>
          <span className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase">
            Live
          </span>
        </div>

        {/* Ticker */}
        <div className="overflow-hidden flex-1">
          <div className="ticker-animate flex whitespace-nowrap">
            {doubled.map((game, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 px-6 py-3 border-r border-white/5"
              >
                <span className="text-[10px] font-bold tracking-wider text-gold/80 uppercase">
                  {game.sport}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {game.away}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  {game.awayScore}
                </span>
                <span className="text-xs text-muted-foreground/50">at</span>
                <span className="text-sm font-bold text-foreground">
                  {game.home}
                </span>
                <span className="text-sm font-bold text-gold">
                  {game.homeScore}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                  {game.quarter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

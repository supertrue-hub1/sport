"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronLeft, ChevronRight, Calendar, Trophy, Zap, Star } from "lucide-react";

const HISTORY_EVENTS = [
  {
    year: 2024,
    month: 2,
    day: 11,
    title: "Mahomes' 3rd Super Bowl",
    description: "Patrick Mahomes leads Kansas City Chiefs to a 25-22 overtime victory over the 49ers in Super Bowl LVIII, cementing a dynasty.",
    sport: "NFL",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 2023,
    month: 6,
    day: 12,
    title: "Nuggets Win First NBA Title",
    description: "Nikola Jokić delivers a historic triple-double performance to secure Denver's first-ever NBA championship in five games over Miami.",
    sport: "NBA",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 2022,
    month: 11,
    day: 15,
    title: "Messi's World Cup Glory",
    description: "Lionel Messi fulfills his destiny, leading Argentina to World Cup victory in one of the greatest finals ever played.",
    sport: "Soccer",
    icon: Star,
    impact: "legendary",
  },
  {
    year: 2020,
    month: 1,
    day: 26,
    title: "Kobe Bryant's Legacy",
    description: "The world mourns the loss of Kobe Bryant, his daughter Gianna, and seven others in a tragic helicopter crash. Mamba Forever.",
    sport: "NBA",
    icon: Star,
    impact: "historic",
  },
  {
    year: 2019,
    month: 10,
    day: 15,
    title: "Washington Nationals Complete Miracle",
    description: "From 19-31 to World Series Champions. The Nationals complete one of the most improbable playoff runs in MLB history.",
    sport: "MLB",
    icon: Zap,
    impact: "historic",
  },
  {
    year: 2016,
    month: 6,
    day: 19,
    title: "The Block, The Shot, The Break",
    description: "LeBron James delivers the greatest defensive play in NBA Finals history as Cleveland erases a 3-1 deficit against the 73-win Warriors.",
    sport: "NBA",
    icon: Zap,
    impact: "legendary",
  },
  {
    year: 2012,
    month: 9,
    day: 5,
    title: "Replacement Refs Debacle",
    description: "The 'Fail Mary' game. Golden Tate's controversial game-winning touchdown for Seattle exposes the chaos of the NFL referee lockout.",
    sport: "NFL",
    icon: History,
    impact: "historic",
  },
  {
    year: 2004,
    month: 10,
    day: 27,
    title: "Red Sox Break the Curse",
    description: "Boston completes an impossible comeback from 0-3 down against the Yankees, then sweep the Cardinals for their first title in 86 years.",
    sport: "MLB",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 1998,
    month: 3,
    day: 26,
    title: "The Shot — Jordan Over Russell",
    description: "Michael Jordan hits 'The Last Shot' to win Game 6 of the NBA Finals, capping off the Bulls' second three-peat in legendary fashion.",
    sport: "NBA",
    icon: Star,
    impact: "legendary",
  },
  {
    year: 1980,
    month: 2,
    day: 22,
    title: "Miracle on Ice",
    description: "A group of American college kids defeats the Soviet Union 4-3 in the greatest upset in hockey history at the Lake Placid Olympics.",
    sport: "NHL",
    icon: Zap,
    impact: "legendary",
  },
  {
    year: 1969,
    month: 10,
    day: 16,
    title: "The Impossible Dream",
    description: "The 'Amazin' Mets' complete the most shocking season turnaround in sports history, going from worst to first to win the World Series.",
    sport: "MLB",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 1958,
    month: 12,
    day: 28,
    title: "The Greatest Game Ever Played",
    description: "Baltimore Colts defeat the New York Giants 23-17 in sudden death overtime, a game that put professional football on the national map.",
    sport: "NFL",
    icon: History,
    impact: "historic",
  },
];

const SPORT_COLORS: Record<string, string> = {
  NFL: "text-red-400 border-red-500/20 bg-red-500/5",
  NBA: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  MLB: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  NHL: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  Soccer: "text-purple-400 border-purple-500/20 bg-purple-500/5",
};

const IMPACT_COLORS: Record<string, { text: string; bg: string }> = {
  legendary: { text: "text-gold", bg: "bg-gold/10 border-gold/20" },
  historic: { text: "text-foreground/70", bg: "bg-white/5 border-white/10" },
};

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export function SportsHistory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HISTORY_EVENTS.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HISTORY_EVENTS.length) % HISTORY_EVENTS.length);
  };

  const event = HISTORY_EVENTS[currentIndex];
  const EventIcon = event.icon;

  return (
    <section id="history" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.015] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase flex items-center gap-2">
            Vault
            <History className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            THIS DAY IN <span className="text-gradient-gold">SPORTS</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            The moments that transcended the game. Relive the plays, the upsets,
            and the legends that shaped sports history.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Main card */}
        <div className="glass-card rounded-2xl overflow-hidden relative">
          {/* Year watermark */}
          <div className="absolute top-4 right-6 sm:top-6 sm:right-8 text-[80px] sm:text-[120px] font-black text-white/[0.03] leading-none select-none pointer-events-none">
            {event.year}
          </div>

          <div className="p-6 sm:p-8 lg:p-10 relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Top row: date + badges */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2 text-gold">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {event.month}/{event.day}/{event.year}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${SPORT_COLORS[event.sport] || "text-muted-foreground bg-white/5 border-white/10"}`}>
                    {event.sport}
                  </span>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${IMPACT_COLORS[event.impact]?.bg || "bg-white/5 border-white/10"} ${IMPACT_COLORS[event.impact]?.text || "text-muted-foreground"}`}>
                    {event.impact}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <EventIcon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {event.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button
                onClick={prev}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {HISTORY_EVENTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentIndex
                        ? "w-6 h-2 bg-gold"
                        : "w-2 h-2 bg-white/10 hover:bg-white/20"
                    }`}
                    aria-label={`Go to event ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline mini-strip */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {HISTORY_EVENTS.map((e, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                i === currentIndex
                  ? "bg-gold/10 border border-gold/20 text-gold"
                  : "bg-white/[0.02] border border-transparent text-muted-foreground/40 hover:text-muted-foreground hover:bg-white/[0.04]"
              }`}
            >
              {e.year}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

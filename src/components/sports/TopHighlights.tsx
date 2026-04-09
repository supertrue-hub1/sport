"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
  Film,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HIGHLIGHTS = [
  {
    id: 1,
    title: "Mahomes' No-Look Pass for the Ages",
    description: "The Chiefs QB breaks ankles with a no-look touchdown pass that had the internet in meltdown.",
    category: "NFL",
    duration: "0:47",
    views: "12.4M",
    trend: "trending",
    thumbnail: "linear-gradient(135deg, #1a0a0a 0%, #3d1515 50%, #1a0a0a 100%)",
    accent: "text-red-400",
  },
  {
    id: 2,
    title: "LeBron's Buzzer-Beater in Boston",
    description: "LeBron James silences TD Garden with a game-winning three at the horn. King things.",
    category: "NBA",
    duration: "1:23",
    views: "8.7M",
    trend: "trending",
    thumbnail: "linear-gradient(135deg, #1a100a 0%, #3d2a15 50%, #1a100a 100%)",
    accent: "text-orange-400",
  },
  {
    id: 3,
    title: "Ohtani's 500th Home Run",
    description: "Shohei Ohtani launches a moonshot into the Dodger Stadium bleachers. History made.",
    category: "MLB",
    duration: "2:15",
    views: "6.2M",
    trend: "hot",
    thumbnail: "linear-gradient(135deg, #0a1a0e 0%, #153d20 50%, #0a1a0e 100%)",
    accent: "text-emerald-400",
  },
  {
    id: 4,
    title: "McDavid's End-to-End Overtime Winner",
    description: "Connor McDavid skates through five defenders to score the most spectacular OT goal of the season.",
    category: "NHL",
    duration: "1:08",
    views: "4.9M",
    trend: "hot",
    thumbnail: "linear-gradient(135deg, #0a101a 0%, #15203d 50%, #0a101a 100%)",
    accent: "text-cyan-400",
  },
  {
    id: 5,
    title: "The Block: LeBron's Iconic Chase-Down",
    description: "From behind. The greatest defensive play in NBA Finals history. Iggy never saw it coming.",
    category: "NBA",
    duration: "0:32",
    views: "22.1M",
    trend: "legendary",
    thumbnail: "linear-gradient(135deg, #1a120a 0%, #3d2a15 50%, #1a120a 100%)",
    accent: "text-gold",
  },
  {
    id: 6,
    title: "Hurts' Tush Push Obsession",
    description: "Jalen Hurts and the Eagles weaponize the most controversial play in football — and it's unstoppable.",
    category: "NFL",
    duration: "3:44",
    views: "5.1M",
    trend: "trending",
    thumbnail: "linear-gradient(135deg, #1a0a0a 0%, #2d1010 50%, #1a0a0a 100%)",
    accent: "text-red-400",
  },
];

const TREND_ICONS: Record<string, typeof Flame> = {
  trending: TrendingUp,
  hot: Flame,
  legendary: Star,
};

const TREND_COLORS: Record<string, string> = {
  trending: "text-emerald-400",
  hot: "text-orange-400",
  legendary: "text-gold",
};

function Star({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const iVar = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function TopHighlights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const visibleCount = 3;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HIGHLIGHTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const TrendIcon = TREND_ICONS[HIGHLIGHTS[currentIndex]?.trend] || TrendingUp;

  return (
    <section id="highlights" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.015] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase flex items-center gap-2">
            Replays
            <Film className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            TOP <span className="text-gradient-gold">HIGHLIGHTS</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            The plays that broke the internet. Every jaw-dropping moment from this
            week in sports, curated for your viewing pleasure.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Featured highlight card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden mb-6 hover-sweep"
        >
          <div
            className="relative aspect-video sm:aspect-[21/9] flex items-center justify-center cursor-pointer group"
            style={{ background: HIGHLIGHTS[currentIndex].thumbnail }}
          >
            {/* Animated mesh bg */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
            </div>

            {/* Play button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/60 transition-all"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gold ml-1" fill="currentColor" />
              <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping opacity-30" />
            </motion.div>

            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] text-foreground font-medium">
              <Clock className="w-3 h-3" />
              {HIGHLIGHTS[currentIndex].duration}
            </div>

            {/* Trend badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant="outline" className="border-white/10 text-[9px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm">
                {HIGHLIGHTS[currentIndex].category}
              </Badge>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-sm ${TREND_COLORS[HIGHLIGHTS[currentIndex].trend]}`}>
                <TrendIcon className="w-3 h-3" />
                {HIGHLIGHTS[currentIndex].trend}
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
              {HIGHLIGHTS[currentIndex].title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {HIGHLIGHTS[currentIndex].description}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {HIGHLIGHTS[currentIndex].views} views
              </span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{HIGHLIGHTS[currentIndex].duration}</span>
            </div>
          </div>
        </motion.div>

        {/* Carousel dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {HIGHLIGHTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`View highlight ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="ml-3 text-[10px] font-bold tracking-wider text-muted-foreground hover:text-gold transition-colors uppercase"
          >
            {isAutoPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Thumbnails strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {HIGHLIGHTS.map((highlight, i) => {
            const isActive = i === currentIndex;
            return (
              <motion.button
                key={highlight.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  isActive ? "ring-2 ring-gold/40 shadow-lg shadow-gold/5" : "ring-1 ring-white/5 hover:ring-white/15"
                }`}
              >
                <div
                  className="aspect-video flex items-center justify-center"
                  style={{ background: highlight.thumbnail }}
                >
                  <Play className={`w-5 h-5 ${isActive ? "text-gold" : "text-white/30"} transition-colors`} fill="currentColor" />
                </div>
                <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[9px] font-semibold text-foreground truncate">{highlight.title}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

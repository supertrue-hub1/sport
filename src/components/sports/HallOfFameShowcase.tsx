"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, ChevronLeft, ChevronRight, Sparkles, Quote } from "lucide-react";

interface Legend {
  name: string;
  sport: "NFL" | "NBA" | "MLB" | "NHL";
  position: string;
  years: string;
  team: string;
  careerHighlight: string;
  stats: { label: string; value: string }[];
  quote: string;
  accolades: string[];
  avatar: string;
}

const LEGENDS: Legend[] = [
  {
    name: "Michael Jordan",
    sport: "NBA",
    position: "Защитник",
    years: "1984–2003",
    team: "Chicago Bulls",
    careerHighlight: "6× чемпион NBA, 6× MVP финала, 5× MVP NBA, 10× лучший снайпер",
    stats: [
      { label: "PPG", value: "30.1" },
      { label: "RPG", value: "6.2" },
      { label: "APG", value: "5.3" },
      { label: "Rings", value: "6" },
    ],
    quote: "I can accept failure, everyone fails at something. But I can't accept not trying.",
    accolades: ["Зал славы 2009", "Лучший снайпер всех времён", "Оборонительный POY '88"],
    avatar: "🏀"
  },
  {
    name: "Tom Brady",
    sport: "NFL",
    position: "Квотербэк",
    years: "2000–2022",
    team: "New England Patriots / Tampa Bay Buccaneers",
    careerHighlight: "7× чемпион Super Bowl, 5× MVP Super Bowl, 3× MVP NFL",
    stats: [
      { label: "TDs", value: "649" },
      { label: "Yards", value: "89,214" },
      { label: "Wins", value: "251" },
      { label: "Rings", value: "7" },
    ],
    quote: "You know what the difference is between winning and losing? It's who shows up.",
    accolades: ["Лидер по ярдам за карьеру", "Лидер по тачдаунам", "Больше всего побед в Super Bowl"],
    avatar: "🏈"
  },
  {
    name: "Derek Jeter",
    sport: "MLB",
    position: "Шортстоп",
    years: "1995–2014",
    team: "New York Yankees",
    careerHighlight: "5× чемпион Мировой серии, 14× All-Star, капитан Yankees",
    stats: [
      { label: "Hits", value: "3,465" },
      { label: "AVG", value: ".310" },
      { label: "All-Star", value: "14×" },
      { label: "Rings", value: "5" },
    ],
    quote: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.",
    accolades: ["Зал славы 2020", "Мистер Ноябрь", "Клуб 3000 хитов"],
    avatar: "⚾"
  },
  {
    name: "Wayne Gretzky",
    sport: "NHL",
    position: "Центральный",
    years: "1979–1999",
    team: "Edmonton Oilers / Los Angeles Kings",
    careerHighlight: "4× чемпион Stanley Cup, 9× Hart Trophy, 61 рекорд NHL",
    stats: [
      { label: "Goals", value: "894" },
      { label: "Assists", value: "1,963" },
      { label: "Points", value: "2,857" },
      { label: "Cups", value: "4" },
    ],
    quote: "You miss 100% of the shots you don't take.",
    accolades: ["Величайший", "Больше всего очков", "Больше всего передач"],
    avatar: "🏒"
  },
  {
    name: "Kobe Bryant",
    sport: "NBA",
    position: "Защитник",
    years: "1996–2016",
    team: "Los Angeles Lakers",
    careerHighlight: "5× чемпион NBA, 2× MVP финала, 18× All-Star",
    stats: [
      { label: "PPG", value: "25.0" },
      { label: "RPG", value: "5.2" },
      { label: "APG", value: "4.7" },
      { label: "Rings", value: "5" },
    ],
    quote: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.",
    accolades: ["Зал славы 2020", "Игра на 81 очко", "2× MVP финала"],
    avatar: "🐍"
  },
  {
    name: "Lawrence Taylor",
    sport: "NFL",
    position: "Лайнбекер",
    years: "1981–1993",
    team: "New York Giants",
    careerHighlight: "2× чемпион Super Bowl, MVP NFL 1986 (единственный защитник), 10× Pro Bowl",
    stats: [
      { label: "Sacks", value: "132.5" },
      { label: "Pro Bowl", value: "10×" },
      { label: "INTs", value: "9" },
      { label: "Rings", value: "2" },
    ],
    quote: "I want to create chaos on the field.",
    accolades: ["Зал славы 1999", "'86 MVP NFL", "Изменил NFL"],
    avatar: "🦅"
  },
];

const SPORT_CONFIG = {
  NFL: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: "🏈" },
  NBA: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: "🏀" },
  MLB: { color: "bg-sky-500/20 text-sky-400 border-sky-500/30", icon: "⚾" },
  NHL: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: "🏒" },
};

export function HallOfFameShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSport, setActiveSport] = useState<"ALL" | "NFL" | "NBA" | "MLB" | "NHL">("ALL");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const filteredLegends = activeSport === "ALL"
    ? LEGENDS
    : LEGENDS.filter(l => l.sport === activeSport);

  useEffect(() => {
    if (!isAutoPlaying || activeSport !== "ALL") return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filteredLegends.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeSport, filteredLegends.length]);

  const handleSportChange = useCallback((sport: "ALL" | "NFL" | "NBA" | "MLB" | "NHL") => {
    setActiveSport(sport);
    setActiveIndex(0);
  }, []);

  const current = filteredLegends[activeIndex] || filteredLegends[0];

  if (!current) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.015] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gold/60 bg-gold/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
            <Crown className="w-3.5 h-3.5" /> ЗАЛ СЛАВЫ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            <span className="text-gradient-gold">ПАНТЕОН</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            Титаны, перешагнувшие за рамки спорта и ставшие культурными иконами.
          </p>
        </div>

        {/* Sport Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {(["ALL", "NFL", "NBA", "MLB", "NHL"] as const).map(sport => (
            <button
              key={sport}
              onClick={() => handleSportChange(sport)}
              className={`px-4 py-2 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-all duration-200 focus-gold ${
                activeSport === sport
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-muted text-muted-foreground border border-border dark:bg-white/[0.03] dark:border-white/[0.06] hover:bg-muted/80 dark:hover:bg-white/[0.06]"
              }`}
            >
              {sport !== "ALL" && <span className="mr-1.5">{SPORT_CONFIG[sport].icon}</span>}
              {sport === "ALL" ? "Все виды спорта" : sport}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="glass-card-premium rounded-2xl p-6 sm:p-8 lg:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left - Player Identity */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl sm:text-6xl animate-float">{current.avatar}</div>
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full border ${SPORT_CONFIG[current.sport].color}`}>
                      {current.sport}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-wider text-muted-foreground ml-2">
                      {current.years}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
                  {current.name}
                </h3>
                <p className="text-gold/70 font-bold text-sm mb-1">
                  {current.position} · {current.team}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {current.careerHighlight}
                </p>

                {/* Quote */}
                <div className="relative p-4 rounded-xl bg-muted border border-border dark:bg-white/[0.02] dark:border-white/[0.04]">
                  <Quote className="absolute top-3 left-3 w-4 h-4 text-gold/20" />
                  <p className="text-sm italic text-foreground/70 pl-5 leading-relaxed">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right - Stats & Accolades */}
              <div className="lg:col-span-7">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {current.stats.map(stat => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-4 rounded-xl bg-muted border border-border dark:bg-white/[0.03] dark:border-white/[0.06]"
                    >
                      <div className="text-2xl sm:text-3xl font-black text-gradient-gold stat-glow">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Accolades */}
                <div className="flex flex-wrap gap-2">
                  {current.accolades.map((accolade, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full bg-muted border border-border dark:bg-white/[0.03] dark:border-white/[0.06] text-foreground/60"
                    >
                      {i < 1 ? <Trophy className="w-3 h-3 text-gold/50" /> : <Sparkles className="w-3 h-3 text-gold/30" />}
                      {accolade}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIndex(prev => (prev - 1 + filteredLegends.length) % filteredLegends.length);
            }}
            className="w-10 h-10 rounded-full border border-border dark:border-white/[0.08] bg-muted dark:bg-white/[0.03] flex items-center justify-center hover:bg-muted/80 dark:hover:bg-white/[0.06] hover:border-gold/20 transition-all focus-gold"
            aria-label="Предыдущая легенда"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {filteredLegends.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 bg-gold"
                    : "w-1.5 bg-muted hover:bg-muted/80 dark:bg-white/10 dark:hover:bg-white/20"
                }`}
                aria-label={`Перейти к легенде ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIndex(prev => (prev + 1) % filteredLegends.length);
            }}
            className="w-10 h-10 rounded-full border border-border dark:border-white/[0.08] bg-muted dark:bg-white/[0.03] flex items-center justify-center hover:bg-muted/80 dark:hover:bg-white/[0.06] hover:border-gold/20 transition-all focus-gold"
            aria-label="Следующая легенда"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`ml-2 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all ${
              isAutoPlaying
                ? "text-gold/70 border-gold/20 bg-gold/5"
                : "text-muted-foreground border-border dark:border-white/[0.06] hover:text-foreground/60"
            }`}
          >
            {isAutoPlaying ? "АВТО" : "ПАУЗА"}
          </button>
        </div>
      </div>
    </section>
  );
}

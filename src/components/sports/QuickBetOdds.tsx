"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Sport = "ALL" | "NFL" | "NBA" | "MLB" | "NHL";

interface BetOption {
  label: string;
  value: string;
  isBest: boolean;
  isFavorite: boolean;
}

interface GameMatchup {
  id: number;
  sport: Sport;
  teamA: string;
  teamB: string;
  abbrA: string;
  abbrB: string;
  colorA: string;
  colorB: string;
  dateTime: string;
  bets: BetOption[];
}

const GAMES: GameMatchup[] = [
  {
    id: 1,
    sport: "NFL",
    teamA: "Kansas City Chiefs",
    teamB: "Buffalo Bills",
    abbrA: "KC",
    abbrB: "BUF",
    colorA: "#e31837",
    colorB: "#00338d",
    dateTime: "Вс, 15 дек · 18:00",
    bets: [
      { label: "Победа KC", value: "-150", isBest: true, isFavorite: true },
      { label: "Победа BUF", value: "+130", isBest: false, isFavorite: false },
      { label: "Тотал", value: "O 51.5 / U 51.5", isBest: false, isFavorite: false },
    ],
  },
  {
    id: 2,
    sport: "NFL",
    teamA: "San Francisco 49ers",
    teamB: "Detroit Lions",
    abbrA: "SF",
    abbrB: "DET",
    colorA: "#aa0000",
    colorB: "#0076b6",
    dateTime: "Вс, 15 дек · 21:25",
    bets: [
      { label: "Победа SF", value: "-130", isBest: false, isFavorite: true },
      { label: "Победа DET", value: "+110", isBest: true, isFavorite: false },
      { label: "Фора", value: "SF -2.5", isBest: false, isFavorite: false },
    ],
  },
  {
    id: 3,
    sport: "NFL",
    teamA: "Dallas Cowboys",
    teamB: "Philadelphia Eagles",
    abbrA: "DAL",
    abbrB: "PHI",
    colorA: "#041e42",
    colorB: "#004c54",
    dateTime: "Сб, 14 дек · 22:00",
    bets: [
      { label: "Победа DAL", value: "+145", isBest: false, isFavorite: false },
      { label: "Победа PHI", value: "-175", isBest: true, isFavorite: true },
      { label: "Фора", value: "PHI -3.5", isBest: false, isFavorite: false },
    ],
  },
  {
    id: 4,
    sport: "NBA",
    teamA: "Oklahoma City Thunder",
    teamB: "Boston Celtics",
    abbrA: "OKC",
    abbrB: "BOS",
    colorA: "#007ac1",
    colorB: "#007a33",
    dateTime: "Пн, 16 дек · 01:30",
    bets: [
      { label: "Победа OKC", value: "+105", isBest: false, isFavorite: false },
      { label: "Победа BOS", value: "-125", isBest: false, isFavorite: true },
      { label: "Тотал", value: "O 224.5 / U 224.5", isBest: true, isFavorite: false },
    ],
  },
  {
    id: 5,
    sport: "NBA",
    teamA: "Denver Nuggets",
    teamB: "Milwaukee Bucks",
    abbrA: "DEN",
    abbrB: "MIL",
    colorA: "#0e2240",
    colorB: "#00471b",
    dateTime: "Пн, 16 дек · 04:00",
    bets: [
      { label: "Победа DEN", value: "-110", isBest: false, isFavorite: true },
      { label: "Победа MIL", value: "-110", isBest: false, isFavorite: false },
      { label: "Фора", value: "DEN -1.5", isBest: true, isFavorite: false },
    ],
  },
  {
    id: 6,
    sport: "NHL",
    teamA: "Edmonton Oilers",
    teamB: "Florida Panthers",
    abbrA: "EDM",
    abbrB: "FLA",
    colorA: "#003876",
    colorB: "#041e42",
    dateTime: "Вс, 15 дек · 03:00",
    bets: [
      { label: "Победа EDM", value: "+120", isBest: true, isFavorite: false },
      { label: "Победа FLA", value: "-140", isBest: false, isFavorite: true },
      { label: "Тотал", value: "O 6.5 / U 6.5", isBest: false, isFavorite: false },
    ],
  },
];

const TABS: { key: Sport; label: string }[] = [
  { key: "ALL", label: "ВСЕ" },
  { key: "NFL", label: "NFL" },
  { key: "NBA", label: "NBA" },
  { key: "MLB", label: "MLB" },
  { key: "NHL", label: "NHL" },
];

const SPORT_ACCENT: Record<string, string> = {
  NFL: "border-red-500/30 text-red-400",
  NBA: "border-orange-500/30 text-orange-400",
  MLB: "border-emerald-500/30 text-emerald-400",
  NHL: "border-cyan-500/30 text-cyan-400",
};

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const iVar = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

const exitVar = {
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.25 } },
};

export function QuickBetOdds() {
  const [activeTab, setActiveTab] = useState<Sport>("ALL");

  const filteredGames =
    activeTab === "ALL" ? GAMES : GAMES.filter((g) => g.sport === activeTab);

  return (
    <section id="odds" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gold/[0.025] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.015] blur-3xl" />
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
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
              КОЭФФИЦИЕНТЫ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            КОЭФФИЦИЕНТЫ <span className="text-gradient-gold">НА МАТЧИ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl">
            Актуальные линии и коэффициенты на ближайшие игры главных лиг.
            Сравнивайте ставки и находите лучшие предложения.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === "ALL"
                ? GAMES.length
                : GAMES.filter((g) => g.sport === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300",
                  isActive
                    ? "bg-gold/10 text-gold border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:border-white/15 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span
                    className={cn(
                      "text-[10px] tabular-nums px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-gold/20 text-gold"
                        : "bg-white/[0.06] text-muted-foreground/60"
                    )}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Games Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={cVar}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                variants={iVar}
                className="glass-card-interactive rounded-xl p-5 flex flex-col gap-4"
              >
                {/* Sport badge + Date */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border text-[9px] font-bold tracking-wider uppercase px-1.5 py-0",
                      SPORT_ACCENT[game.sport] ?? "border-white/10 text-muted-foreground"
                    )}
                  >
                    {game.sport}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {game.dateTime}
                  </span>
                </div>

                {/* Teams matchup */}
                <div className="flex items-center gap-3">
                  {/* Team A */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/10 flex-shrink-0"
                      style={{
                        backgroundColor: `${game.colorA}18`,
                        color: game.colorA,
                      }}
                    >
                      {game.abbrA}
                    </div>
                    <span className="text-sm font-bold text-foreground truncate leading-tight">
                      {game.teamA}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="flex-shrink-0 px-1">
                    <span className="text-[10px] font-black tracking-widest text-gold/60">VS</span>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-sm font-bold text-foreground truncate leading-tight text-right">
                      {game.teamB}
                    </span>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/10 flex-shrink-0"
                      style={{
                        backgroundColor: `${game.colorB}18`,
                        color: game.colorB,
                      }}
                    >
                      {game.abbrB}
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                {/* Bet options */}
                <div className="space-y-2">
                  {game.bets.map((bet, betIdx) => (
                    <div
                      key={betIdx}
                      className={cn(
                        "relative flex items-center justify-between rounded-lg px-3 py-2.5 border transition-all duration-200",
                        bet.isFavorite
                          ? "border-gold/[0.12] bg-gold/[0.04]"
                          : "border-emerald-500/[0.08] bg-emerald-500/[0.03]"
                      )}
                    >
                      {/* Best badge */}
                      {bet.isBest && (
                        <span className="absolute -top-2 left-2 bg-gold text-black text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-md shadow-lg shadow-gold/20 flex items-center gap-0.5">
                          <Award className="w-2.5 h-2.5" />
                          ЛУЧШИЙ
                        </span>
                      )}

                      <span className="text-[11px] font-semibold text-muted-foreground pr-3">
                        {bet.label}
                      </span>

                      <span
                        className={cn(
                          "text-sm font-black tabular-nums stat-glow",
                          bet.isFavorite ? "text-gold" : "text-emerald-400"
                        )}
                      >
                        {bet.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer indicator */}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 pt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Информация обновлена</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-start gap-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] px-5 py-4"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-amber-500/80">Информационные коэффициенты.</span>{" "}
            Азартные игры могут вызывать зависимость. Играйте ответственно и только на законных платформах.
            Данный контент носит исключительно образовательный характер.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

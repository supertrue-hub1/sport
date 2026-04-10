"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Sport = "NFL" | "NBA" | "MLB" | "NHL";
type SportFilter = "ВСЕ" | Sport;
type Trend = "up" | "down" | "stable";

interface SeasonLeader {
  id: number;
  rank: number;
  name: string;
  team: string;
  teamCode: string;
  sport: Sport;
  statValue: string;
  statLabel: string;
  trend: Trend;
}

const SPORT_COLORS: Record<Sport, { bg: string; text: string; border: string; dot: string }> = {
  NFL: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/25",
    dot: "bg-red-400",
  },
  NBA: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/25",
    dot: "bg-orange-400",
  },
  MLB: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    border: "border-sky-500/25",
    dot: "bg-sky-400",
  },
  NHL: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500/25",
    dot: "bg-cyan-400",
  },
};

const LEADERS: SeasonLeader[] = [
  {
    id: 1,
    rank: 1,
    name: "Patrick Mahomes",
    team: "Kansas City Chiefs",
    teamCode: "KC",
    sport: "NFL",
    statValue: "4,183",
    statLabel: "ЯРДОВ ПЕРЕДАЧ",
    trend: "up",
  },
  {
    id: 2,
    rank: 2,
    name: "Derrick Henry",
    team: "Baltimore Ravens",
    teamCode: "BAL",
    sport: "NFL",
    statValue: "1,921",
    statLabel: "ЯРДОВ НА БЫСТРЫХ",
    trend: "up",
  },
  {
    id: 3,
    rank: 3,
    name: "Luka Doncic",
    team: "Dallas Mavericks",
    teamCode: "DAL",
    sport: "NBA",
    statValue: "33.4",
    statLabel: "ОЧКОВ ЗА ИГРУ",
    trend: "up",
  },
  {
    id: 4,
    rank: 4,
    name: "Giannis Antetokounmpo",
    team: "Milwaukee Bucks",
    teamCode: "MIL",
    sport: "NBA",
    statValue: "31.2 / 11.5",
    statLabel: "ПОДБОРА + ПОДАЧ",
    trend: "stable",
  },
  {
    id: 5,
    rank: 5,
    name: "Aaron Judge",
    team: "New York Yankees",
    teamCode: "NYY",
    sport: "MLB",
    statValue: "54",
    statLabel: "ХОМ-РАНОВ",
    trend: "up",
  },
  {
    id: 6,
    rank: 6,
    name: "Shohei Ohtani",
    team: "Los Angeles Dodgers",
    teamCode: "LAD",
    sport: "MLB",
    statValue: "44 / 3.31",
    statLabel: "ХОМ-РАНОВ + ERA",
    trend: "up",
  },
  {
    id: 7,
    rank: 7,
    name: "Nikita Kucherov",
    team: "Tampa Bay Lightning",
    teamCode: "TBL",
    sport: "NHL",
    statValue: "128",
    statLabel: "ОЧКОВ",
    trend: "stable",
  },
  {
    id: 8,
    rank: 8,
    name: "Connor McDavid",
    team: "Edmonton Oilers",
    teamCode: "EDM",
    sport: "NHL",
    statValue: "100+",
    statLabel: "ОЧКОВ",
    trend: "down",
  },
];

const FILTER_TABS: SportFilter[] = ["ВСЕ", "NFL", "NBA", "MLB", "NHL"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.96,
    transition: { duration: 0.25 },
  },
};

function TrendIcon({ trend }: { trend: Trend }) {
  switch (trend) {
    case "up":
      return (
        <div className="flex items-center gap-0.5 text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">+12%</span>
        </div>
      );
    case "down":
      return (
        <div className="flex items-center gap-0.5 text-red-400">
          <TrendingDown className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">-5%</span>
        </div>
      );
    case "stable":
      return (
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <Minus className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">0%</span>
        </div>
      );
  }
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        number: "text-gradient-gold text-3xl sm:text-4xl",
        ring: "ring-yellow-500/30",
        badge: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
      };
    case 2:
      return {
        number: "text-gradient-silver text-3xl sm:text-4xl",
        ring: "ring-gray-400/25",
        badge: "bg-gradient-to-br from-gray-300/20 to-gray-500/10 border-gray-400/30",
      };
    case 3:
      return {
        number: "text-gradient-bronze text-3xl sm:text-4xl",
        ring: "ring-amber-700/25",
        badge: "bg-gradient-to-br from-amber-700/20 to-amber-800/10 border-amber-700/30",
      };
    default:
      return {
        number: "text-2xl sm:text-3xl text-muted-foreground/30",
        ring: "ring-border dark:ring-white/[0.04]",
        badge: "bg-muted border-border dark:bg-white/[0.03] dark:border-white/[0.06]",
      };
  }
}

export function MVPLeaders() {
  const [activeFilter, setActiveFilter] = useState<SportFilter>("ВСЕ");

  const filteredLeaders = activeFilter === "ВСЕ"
    ? LEADERS
    : LEADERS.filter((p) => p.sport === activeFilter);

  return (
    <section id="mvp-leaders" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.025] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/[0.015] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.25em] uppercase text-gold/70 bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20 mb-4">
            <Star className="w-3.5 h-3.5" />
            ЗВЁЗДЫ
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            ЛИДЕРЫ{" "}
            <span className="text-gradient-gold">СЕЗОНА</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
            Лучшие игроки четырёх главных лиг сезона. Статистика, тренды и&nbsp;доминирование — всё в&nbsp;одном месте.
          </p>

          <div className="gradient-divider w-32 mx-auto mt-6" />
        </motion.div>

        {/* Sport filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-200 focus-gold press-effect",
                activeFilter === tab
                  ? "bg-gold/15 text-gold border border-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                  : "bg-muted border-border dark:bg-white/[0.03] dark:border-white/[0.06] hover:bg-muted/80 dark:hover:bg-white/[0.06] hover:text-foreground/70",
              )}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Leader cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredLeaders.map((leader) => {
              const sportStyle = SPORT_COLORS[leader.sport];
              const rankStyle = getRankStyle(leader.rank);

              return (
                <motion.div
                  key={leader.id}
                  variants={cardVariants}
                  layout
                  className="glass-card-interactive rounded-xl p-5 sm:p-6 relative overflow-hidden group cursor-default"
                >
                  {/* Subtle top glow for top 3 */}
                  {leader.rank <= 3 && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                      style={{
                        background:
                          leader.rank === 1
                            ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)"
                            : leader.rank === 2
                              ? "linear-gradient(90deg, transparent, rgba(192,192,192,0.3), transparent)"
                              : "linear-gradient(90deg, transparent, rgba(180,120,60,0.3), transparent)",
                      }}
                    />
                  )}

                  {/* Rank + Trend row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-black tabular-nums border ring-1",
                        rankStyle.badge,
                        rankStyle.ring,
                      )}
                    >
                      <span
                        className={cn(
                          "leading-none",
                          rankStyle.number,
                          leader.rank === 2 && "bg-gradient-to-b from-gray-200 via-gray-400 to-gray-300 bg-clip-text",
                          leader.rank === 3 && "bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 bg-clip-text",
                        )}
                        style={
                          leader.rank === 2
                            ? {
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }
                            : leader.rank === 3
                              ? {
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }
                              : undefined
                        }
                      >
                        {leader.rank}
                      </span>
                    </div>

                    <TrendIcon trend={leader.trend} />
                  </div>

                  {/* Sport badge */}
                  <div className="mb-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border",
                        sportStyle.bg,
                        sportStyle.text,
                        sportStyle.border,
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", sportStyle.dot)} />
                      {leader.sport}
                    </span>
                  </div>

                  {/* Player name */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight group-hover:text-gold transition-colors duration-300">
                    {leader.name}
                  </h3>

                  {/* Team */}
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    {leader.team}{" "}
                    <span className="text-foreground/40 font-bold">{leader.teamCode}</span>
                  </p>

                  {/* Stat value */}
                  <div className="mt-5 pt-4 border-t border-border dark:border-white/[0.05]">
                    <div className="text-3xl sm:text-4xl font-black text-gradient-gold stat-glow leading-none">
                      {leader.statValue}
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mt-2">
                      {leader.statLabel}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredLeaders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Star className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Нет данных для выбранного фильтра
            </p>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-[10px] font-medium tracking-wider uppercase text-muted-foreground/40 mt-10 sm:mt-14"
        >
          Статистика актуальна на текущий игровой день · Обновляется еженедельно
        </motion.p>
      </div>
    </section>
  );
}

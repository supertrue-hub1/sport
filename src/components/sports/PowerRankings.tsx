"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flame, TrendingUp, Zap, Medal, ArrowUpRight } from "lucide-react";

const TEAMS = [
  {
    rank: 1, prev: 1, team: "Kansas City Chiefs", abbr: "KC", record: "15-2",
    trend: "+0", hot: true, icon: "👑",
    blurb: "Династия не собирается сбавлять обороты. Mahomes и компания выходят на пик в идеальный момент.",
    sport: "NFL", color: "#d4af37",
  },
  {
    rank: 2, prev: 3, team: "Oklahoma City Thunder", abbr: "OKC", record: "57-10",
    trend: "+2", hot: true, icon: "⚡",
    blurb: "SGA доказывает своё право на MVP с неумолимой эффективностью. Thunder пугающе сильны.",
    sport: "NBA", color: "#007ac1",
  },
  {
    rank: 3, prev: 2, team: "Buffalo Bills", abbr: "BUF", record: "13-4",
    trend: "-1", hot: false, icon: "🦬",
    blurb: "Josh Allen удерживает Buffalo в борьбе за чемпионство. Защите нужно прибавить.",
    sport: "NFL", color: "#00338d",
  },
  {
    rank: 4, prev: 5, team: "Los Angeles Dodgers", abbr: "LAD", record: "98-64",
    trend: "+3", hot: true, icon: "🌊",
    blurb: "Двустороннее великолепие Ohtani питает глубокую игру в плей-офф. NL West — их, если они сами не упустят.",
    sport: "MLB", color: "#005a9c",
  },
  {
    rank: 5, prev: 4, team: "Baltimore Ravens", abbr: "BAL", record: "12-5",
    trend: "-1", hot: false, icon: "🐦",
    blurb: "Lamar Jackson по-прежнему электричен, но составу нужно подкрепление для глубокой игры.",
    sport: "NFL", color: "#241773",
  },
  {
    rank: 6, prev: 8, team: "Florida Panthers", abbr: "FLA", record: "52-22-8",
    trend: "+4", hot: true, icon: "🐊",
    blurb: "Действующие чемпионы Кубка Стэнли идут полным ходом. Bobrovsky снова творит чудеса.",
    sport: "NHL", color: "#041e42",
  },
  {
    rank: 7, prev: 6, team: "Boston Celtics", abbr: "BOS", record: "55-14",
    trend: "-1", hot: false, icon: "🍀",
    blurb: "Действующие чемпионы идут уверенно. Tatum и Brown строят нечто особенное.",
    sport: "NBA", color: "#007a33",
  },
  {
    rank: 8, prev: 7, team: "Cincinnati Bengals", abbr: "CIN", record: "11-6",
    trend: "+2", hot: false, icon: "🐯",
    blurb: "Joe Burrow здоров, и нападение разрушительно. Тёмная лошадка в плей-офф AFC.",
    sport: "NFL", color: "#fb4f14",
  },
  {
    rank: 9, prev: 10, team: "Edmonton Oilers", abbr: "EDM", record: "49-25-8",
    trend: "+3", hot: true, icon: "🛢️",
    blurb: "McDavid и Draisaitl делают то, что делают McDavid и Draisaitl. Западная конференция предупреждена.",
    sport: "NHL", color: "#003876",
  },
  {
    rank: 10, prev: 9, team: "New York Yankees", abbr: "NYY", record: "94-68",
    trend: "-1", hot: false, icon: "⚾",
    blurb: "Judge снова в ударе. Переходы Yankees перед дедлайном могут стать решающими в октябре.",
    sport: "MLB", color: "#003087",
  },
];

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const iVar = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

export function PowerRankings() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="rankings" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.02] blur-3xl" />
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
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            ИЕРАРХИЯ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            СИЛОВОЙ <span className="text-gradient-gold">РЕЙТИНГ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Четыре главные лиги — один безоговорочный рейтинг. Здесь
            элита отделяется от остальных.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Rankings List */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-3"
        >
          {TEAMS.map((team, idx) => {
            const isHot = team.hot;
            const moved = parseInt(team.trend);
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={team.abbr}
                variants={iVar}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "glass-card rounded-xl p-4 sm:p-5 transition-all duration-300 cursor-default group",
                  isHovered && "border-gold/20 scale-[1.01]"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex flex-col items-center flex-shrink-0 w-10 sm:w-12">
                    <span className={cn(
                      "text-2xl sm:text-3xl font-black tabular-nums leading-none",
                      team.rank <= 3 ? "text-gradient-gold" : "text-muted-foreground/40"
                    )}>
                      {team.rank}
                    </span>
                    {moved !== 0 && (
                      <span className={cn(
                        "text-[10px] font-bold mt-1 flex items-center gap-0.5",
                        moved > 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {moved > 0 ? "▲" : "▼"}{Math.abs(moved)}
                      </span>
                    )}
                    {isHot && (
                      <span className="mt-0.5">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {/* Sport badge */}
                      <Badge
                        variant="outline"
                        className="border-border dark:border-white/10 text-[9px] font-bold tracking-wider px-1.5 py-0"
                      >
                        {team.sport}
                      </Badge>

                      {/* Team */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm font-black border border-border dark:border-white/10 flex-shrink-0"
                          style={{ backgroundColor: `${team.color}15`, color: team.color }}
                        >
                          {team.abbr}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-gold transition-colors leading-tight">
                            {team.team}
                          </h3>
                          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                            {team.record}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blurb */}
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {team.blurb}
                    </p>
                  </div>

                  {/* Medal for top 3 */}
                  {team.rank <= 3 && (
                    <div className="hidden sm:flex items-center">
                      <Medal className={cn("w-8 h-8", team.rank === 1 ? "text-gold" : team.rank === 2 ? "text-gray-300" : "text-amber-700")} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

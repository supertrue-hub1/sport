"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowUp, ArrowDown, Minus, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const NFL_STANDINGS = [
  { rank: 1, team: "KC", name: "Chiefs", w: 15, l: 2, pct: ".882", streak: "W6", pf: 468, pa: 312, change: 0 },
  { rank: 2, team: "BUF", name: "Bills", w: 13, l: 4, pct: ".765", streak: "W3", pf: 441, pa: 328, change: 1 },
  { rank: 3, team: "BAL", name: "Ravens", w: 12, l: 5, pct: ".706", streak: "L1", pf: 429, pa: 334, change: -1 },
  { rank: 4, team: "CIN", name: "Bengals", w: 11, l: 6, pct: ".647", streak: "W2", pf: 403, pa: 356, change: 2 },
  { rank: 5, team: "HOU", name: "Texans", w: 10, l: 7, pct: ".588", streak: "W1", pf: 372, pa: 341, change: 0 },
  { rank: 6, team: "PIT", name: "Steelers", w: 10, l: 7, pct: ".588", streak: "L2", pf: 358, pa: 361, change: -1 },
  { rank: 7, team: "DEN", name: "Broncos", w: 9, l: 8, pct: ".529", streak: "W1", pf: 341, pa: 332, change: 1 },
  { rank: 8, team: "LAC", name: "Chargers", w: 9, l: 8, pct: ".529", streak: "L1", pf: 367, pa: 348, change: -2 },
  { rank: 9, team: "CLE", name: "Browns", w: 8, l: 9, pct: ".471", streak: "L3", pf: 329, pa: 358, change: 0 },
  { rank: 10, team: "NYJ", name: "Jets", w: 7, l: 10, pct: ".412", streak: "W1", pf: 312, pa: 378, change: 1 },
  { rank: 11, team: "MIA", name: "Dolphins", w: 6, l: 11, pct: ".353", streak: "L4", pf: 328, pa: 392, change: 0 },
  { rank: 12, team: "NE", name: "Patriots", w: 4, l: 13, pct: ".235", streak: "L5", pf: 261, pa: 402, change: 0 },
  { rank: 13, team: "IND", name: "Colts", w: 4, l: 13, pct: ".235", streak: "L2", pf: 278, pa: 389, change: 0 },
  { rank: 14, team: "JAX", name: "Jaguars", w: 3, l: 14, pct: ".176", streak: "L7", pf: 248, pa: 421, change: 0 },
  { rank: 15, team: "TEN", name: "Titans", w: 3, l: 14, pct: ".176", streak: "L6", pf: 268, pa: 401, change: 0 },
  { rank: 16, team: "NYG", name: "Giants", w: 2, l: 15, pct: ".118", streak: "L8", pf: 218, pa: 432, change: 0 },
];

function ChangeIcon({ change }: { change: number }) {
  if (change > 0) return <ArrowUp className="w-3 h-3 text-emerald-400" />;
  if (change < 0) return <ArrowDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground/40" />;
}

function rowStyle(rank: number) {
  if (rank <= 3) return "border-l-2 border-l-gold/50 bg-gold/[0.02]";
  if (rank <= 7) return "border-l-2 border-l-emerald-500/30";
  return "border-l-2 border-l-transparent";
}

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const rVar = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function StandingsTable() {
  return (
    <section id="standings" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Рейтинг</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ТУРНИРНАЯ ТАБЛИЦА <span className="text-gradient-gold">AFC</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Поле битвы, определяющее Американскую футбольную конференцию. Каждая победа на вес золота. Каждое поражение отдаётся эхом.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 mb-5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gold/15 border border-gold/40" />
            <span>Лидеры дивизионов / Уайлд-кард</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30" />
            <span>В борьбе</span>
          </div>
        </div>

        {/* Table */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="glass-card rounded-xl overflow-hidden"
        >
          {/* Column headers */}
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_2.5rem_2.5rem_3.5rem_3rem_3.5rem_2rem] sm:grid-cols-[2.5rem_minmax(0,2fr)_3rem_3rem_4rem_3.5rem_4rem_2.5rem] gap-0 px-3 sm:px-5 py-2.5 border-b border-border dark:border-white/5 bg-muted dark:bg-white/[0.02]">
            {["#", "КОМАНДА", "В", "П", "% ПОБЕД", "СЕРИЯ", "ЗП/ПП", ""].map((h) => (
              <span key={h} className="text-[9px] sm:text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase text-center">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {NFL_STANDINGS.map((row) => (
            <motion.div
              key={row.team}
              variants={rVar}
              className={cn(
                "grid grid-cols-[2rem_minmax(0,1fr)_2.5rem_2.5rem_3.5rem_3rem_3.5rem_2rem] sm:grid-cols-[2.5rem_minmax(0,2fr)_3rem_3rem_4rem_3.5rem_4rem_2.5rem] gap-0 px-3 sm:px-5 py-2.5 border-b border-border dark:border-white/[0.03] hover:bg-muted dark:hover:bg-white/[0.03] transition-colors group cursor-default",
                rowStyle(row.rank)
              )}
            >
              <div className="flex items-center">
                <span className={cn("text-xs sm:text-sm font-bold tabular-nums", row.rank <= 3 ? "text-gold" : row.rank <= 7 ? "text-foreground" : "text-muted-foreground/60")}>
                  {row.rank}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-black border flex-shrink-0", row.rank <= 3 ? "bg-gold/10 border-gold/30 text-gold" : "bg-muted border-border dark:bg-white/5 dark:border-white/10 text-muted-foreground")}>
                  {row.team}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-gold transition-colors truncate">
                  {row.name}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold tabular-nums text-foreground">{row.w}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xs sm:text-sm tabular-nums text-muted-foreground">{row.l}</span>
              </div>
              <div className="hidden sm:flex items-center justify-center">
                <span className="text-[10px] sm:text-xs tabular-nums text-muted-foreground font-mono">{row.pct}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className={cn("text-[10px] sm:text-[11px] font-bold tabular-nums", row.streak[0] === "W" ? "text-emerald-400" : "text-red-400")}>
                  {row.streak}
                </span>
              </div>
              <div className="hidden sm:flex items-center justify-center gap-0.5">
                <span className="text-[10px] sm:text-[11px] font-semibold tabular-nums text-foreground">{row.pf}</span>
                <span className="text-[8px] text-muted-foreground/40">-</span>
                <span className="text-[10px] sm:text-[11px] tabular-nums text-muted-foreground">{row.pa}</span>
              </div>
              <div className="flex items-center justify-center">
                <ChangeIcon change={row.change} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom insight bar */}
        <div className="flex flex-wrap gap-6 mt-5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span>Наибольшее количество очков: <strong className="text-foreground">KC</strong> — 468 ЗП</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Лучшая серия: <strong className="text-foreground">KC</strong> — W6</span>
          </div>
        </div>
      </div>
    </section>
  );
}

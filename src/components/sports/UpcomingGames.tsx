"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Tv,
  Zap,
  ChevronRight,
} from "lucide-react";

const UPCOMING_GAMES = [
  {
    id: 1,
    sport: "NFL",
    away: { abbr: "KC", name: "Chiefs", record: "15-2" },
    home: { abbr: "BUF", name: "Bills", record: "13-4" },
    date: "Воскресенье",
    time: "6:30 PM ET",
    venue: "Highmark Stadium",
    network: "CBS",
    countdown: { days: 2, hours: 14, mins: 32 },
    primetime: true,
  },
  {
    id: 2,
    sport: "NBA",
    away: { abbr: "OKC", name: "Thunder", record: "57-10" },
    home: { abbr: "BOS", name: "Celtics", record: "55-14" },
    date: "Среда",
    time: "7:30 PM ET",
    venue: "TD Garden",
    network: "TNT",
    countdown: { days: 0, hours: 5, mins: 47 },
    primetime: true,
  },
  {
    id: 3,
    sport: "MLB",
    away: { abbr: "LAD", name: "Dodgers", record: "98-64" },
    home: { abbr: "NYY", name: "Yankees", record: "94-68" },
    date: "Суббота",
    time: "1:05 PM ET",
    venue: "Yankee Stadium",
    network: "FOX",
    countdown: { days: 5, hours: 9, mins: 15 },
    primetime: false,
  },
  {
    id: 4,
    sport: "NHL",
    away: { abbr: "EDM", name: "Oilers", record: "49-25-8" },
    home: { abbr: "FLA", name: "Panthers", record: "52-22-8" },
    date: "Четверг",
    time: "8:00 PM ET",
    venue: "Amerant Bank Arena",
    network: "ESPN+",
    countdown: { days: 1, hours: 22, mins: 8 },
    primetime: false,
  },
  {
    id: 5,
    sport: "NFL",
    away: { abbr: "SF", name: "49ers", record: "12-5" },
    home: { abbr: "DET", name: "Lions", record: "15-2" },
    date: "Воскресенье",
    time: "1:00 PM ET",
    venue: "Ford Field",
    network: "FOX",
    countdown: { days: 2, hours: 8, mins: 32 },
    primetime: true,
  },
];

const SPORT_COLORS: Record<string, string> = {
  NFL: "text-red-400 bg-red-500/10 border-red-500/20",
  NBA: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  MLB: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  NHL: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const SPORT_BORDER: Record<string, string> = {
  NFL: "border-l-red-500",
  NBA: "border-l-orange-500",
  MLB: "border-l-emerald-500",
  NHL: "border-l-cyan-500",
};

function CountdownTimer({ countdown }: { countdown: { days: number; hours: number; mins: number } }) {
  const [time, setTime] = useState(countdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, mins } = prev;
        mins--;
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; mins = 0; }
        return { days, hours, mins };
      });
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="flex items-center gap-1.5">
      {[
        { value: time.days, label: "D" },
        { value: time.hours, label: "H" },
        { value: time.mins, label: "M" },
      ].map((unit, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="text-center">
            <span className="text-sm sm:text-base font-black text-gold tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-muted-foreground block leading-none">
              {unit.label}
            </span>
          </div>
          {i < 2 && <span className="text-muted-foreground/30 text-xs font-bold -mt-2">:</span>}
        </div>
      ))}
    </div>
  );
}

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const iVar = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function UpcomingGames() {
  const [filter, setFilter] = useState<string>("ALL");

  const sports = ["ALL", "NFL", "NBA", "MLB", "NHL"];
  const filtered = filter === "ALL"
    ? UPCOMING_GAMES
    : UPCOMING_GAMES.filter((g) => g.sport === filter);

  return (
    <section id="schedule" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            РАСПИСАНИЕ
            <Calendar className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            БЛИЖАЙШИЕ <span className="text-gradient-gold">ИГРЫ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Не пропустите ни мгновения. Ваш путеводитель по самым крупным
            матчам всех четырёх главных лиг на этой неделе.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Sport filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all border ${
                s === filter
                  ? "bg-gold/10 border-gold/30 text-gold"
                  : "bg-white/[0.02] border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Games list */}
        <motion.div
          key={filter}
          variants={cVar}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filtered.map((game) => (
            <motion.div
              key={game.id}
              variants={iVar}
              className={`glass-card rounded-xl overflow-hidden border-l-2 ${SPORT_BORDER[game.sport] || "border-l-gold"}`}
            >
              <div className="p-4 sm:p-5">
                {/* Top row: sport badge + primetime + countdown */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`border text-[9px] font-bold tracking-wider uppercase ${SPORT_COLORS[game.sport] || ""}`}
                    >
                      {game.sport}
                    </Badge>
                    {game.primetime && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 border border-gold/15">
                        <Zap className="w-2.5 h-2.5 text-gold" />
                        <span className="text-[8px] font-bold tracking-wider uppercase text-gold">
                          ПРАЙМТАЙМ
                        </span>
                      </div>
                    )}
                  </div>
                  <CountdownTimer countdown={game.countdown} />
                </div>

                {/* Matchup */}
                <div className="flex items-center justify-between gap-4">
                  {/* Away team */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] sm:text-xs font-black text-muted-foreground flex-shrink-0">
                      {game.away.abbr}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-foreground truncate">
                        {game.away.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{game.away.record}</p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase">
                      {game.date}
                    </span>
                    <span className="text-xs font-bold text-gold/60">VS</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{game.time}</span>
                  </div>

                  {/* Home team */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-foreground truncate">
                        {game.home.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{game.home.record}</p>
                    </div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] sm:text-xs font-black text-muted-foreground flex-shrink-0">
                      {game.home.abbr}
                    </div>
                  </div>
                </div>

                {/* Bottom row: venue + network */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {game.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Tv className="w-3 h-3" />
                    <span className="font-semibold">{game.network}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <button className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gold hover:text-gold/80 transition-colors group">
            <Calendar className="w-3.5 h-3.5" />
            ПОЛНОЕ РАСПИСАНИЕ
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

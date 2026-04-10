"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Clock, Flame, TrendingUp, AlertCircle } from "lucide-react";

const TRADES = [
  {
    id: 1,
    status: "confirmed",
    timestamp: "2 часа назад",
    fromTeam: "SF", fromTeamName: "49ers",
    toTeam: "DEN", toTeamName: "Broncos",
    player: "Deebo Samuel",
    position: "WR",
    picks: "2025 3rd Round Pick",
    sport: "NFL",
    hot: true,
  },
  {
    id: 2,
    status: "confirmed",
    timestamp: "5 часов назад",
    fromTeam: "CHI", fromTeamName: "Bears",
    toTeam: "LAR", toTeamName: "Rams",
    player: "Keenan Allen",
    position: "WR",
    picks: "2025 4th Round Pick",
    sport: "NFL",
    hot: true,
  },
  {
    id: 3,
    status: "rumor",
    timestamp: "8 часов назад",
    fromTeam: "BKN", fromTeamName: "Nets",
    toTeam: "HOU", toTeamName: "Rockets",
    player: "Cameron Johnson",
    position: "SF",
    picks: "Multiple 2nd Round Picks",
    sport: "NBA",
    hot: false,
  },
  {
    id: 4,
    status: "rumor",
    timestamp: "12 часов назад",
    fromTeam: "TOR", fromTeamName: "Blue Jays",
    toTeam: "NYY", toTeamName: "Yankees",
    player: "Vladimir Guerrero Jr.",
    position: "1B",
    picks: "3 Top Prospects",
    sport: "MLB",
    hot: true,
  },
  {
    id: 5,
    status: "confirmed",
    timestamp: "1 день назад",
    fromTeam: "ANA", fromTeamName: "Ducks",
    toTeam: "CAR", toTeamName: "Hurricanes",
    player: "Trevor Zegras",
    position: "C",
    picks: "2025 1st + 3rd Round Picks",
    sport: "NHL",
    hot: false,
  },
  {
    id: 6,
    status: "rumor",
    timestamp: "1 день назад",
    fromTeam: "DET", fromTeamName: "Lions",
    toTeam: "DAL", toTeamName: "Cowboys",
    player: "Amon-Ra St. Brown",
    position: "WR",
    picks: "Under Discussion",
    sport: "NFL",
    hot: false,
  },
];

const SPORT_COLORS: Record<string, string> = {
  NFL: "border-red-500/30 bg-red-500/5",
  NBA: "border-orange-500/30 bg-orange-500/5",
  MLB: "border-emerald-500/30 bg-emerald-500/5",
  NHL: "border-cyan-500/30 bg-cyan-500/5",
};

const SPORT_TEXT: Record<string, string> = {
  NFL: "text-red-400",
  NBA: "text-orange-400",
  MLB: "text-emerald-400",
  NHL: "text-cyan-400",
};

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const iVar = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function TradeTracker() {
  return (
    <section id="trades" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
              НОВОСТНАЯ ЛИНИЯ
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            ТРЕКЕР <span className="text-gradient-gold">ОБМЕНОВ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Каждая громкая сделка, каждый тихий слух. Будьте на шаг впереди
            с аналитикой обменов в реальном времени из всех четырёх главных лиг.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Trades list */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-3"
        >
          {TRADES.map((trade) => (
            <motion.div
              key={trade.id}
              variants={iVar}
              className="glass-card rounded-xl p-4 sm:p-5 hover:border-gold/15 transition-all duration-300 group cursor-default"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Status indicator */}
                <div className="flex flex-col items-center gap-1.5 pt-1 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${trade.status === "confirmed" ? "bg-emerald-400 pulse-ring" : "bg-amber-400 animate-pulse"}`} style={{ color: trade.status === "confirmed" ? "#34d399" : "#fbbf24", position: "relative" }} />
                  <div className={`w-px h-6 ${trade.status === "confirmed" ? "bg-emerald-500/20" : "bg-amber-500/20"}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge
                      variant="outline"
                      className={`border text-[9px] font-bold tracking-wider uppercase ${SPORT_COLORS[trade.sport]}`}
                    >
                      {trade.sport}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={trade.status === "confirmed"
                        ? "border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-wider"
                        : "border-amber-500/30 text-amber-400 text-[9px] font-bold tracking-wider"
                      }
                    >
                      {trade.status === "confirmed" ? "ПОДТВЕРЖДЕНО" : "СЛУХ"}
                    </Badge>
                    {trade.hot && (
                      <Flame className="w-3 h-3 text-orange-400" />
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {trade.timestamp}
                    </span>
                  </div>

                  {/* Trade details */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {/* From team */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-muted-foreground">
                        {trade.fromTeam}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {trade.fromTeamName}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ArrowRightLeft className="w-4 h-4 text-gold/50 flex-shrink-0" />

                    {/* To team */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-muted-foreground">
                        {trade.toTeam}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {trade.toTeamName}
                      </span>
                    </div>

                    {/* Player */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                        {trade.position}
                      </span>
                      <span className={`text-sm sm:text-base font-bold ${SPORT_TEXT[trade.sport]}`}>
                        {trade.player}
                      </span>
                    </div>
                  </div>

                  {/* Return value */}
                  <p className="text-[11px] text-muted-foreground mt-2">
                    В обмен: <span className="text-foreground/80 font-medium">{trade.picks}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ChevronDown,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INJURIES = [
  {
    id: 1,
    player: "Joe Burrow",
    team: "CIN",
    teamName: "Bengals",
    position: "QB",
    sport: "NFL",
    status: "Questionable",
    detail: "Right wrist — limited practice",
    impact: "HIGH",
    lastUpdate: "Updated 3h ago",
  },
  {
    id: 2,
    player: "Anthony Davis",
    team: "LAL",
    teamName: "Lakers",
    position: "PF",
    sport: "NBA",
    status: "Out",
    detail: "Left foot — plantar fasciitis",
    impact: "MEDIUM",
    lastUpdate: "Updated 6h ago",
  },
  {
    id: 3,
    player: "Shohei Ohtani",
    team: "LAD",
    teamName: "Dodgers",
    position: "DH",
    sport: "MLB",
    status: "Day-to-Day",
    detail: "Right shoulder fatigue",
    impact: "HIGH",
    lastUpdate: "Updated 1h ago",
  },
  {
    id: 4,
    player: "Connor McDavid",
    team: "EDM",
    teamName: "Oilers",
    position: "C",
    sport: "NHL",
    status: "Probable",
    detail: "Lower body — expected to play",
    impact: "LOW",
    lastUpdate: "Updated 2h ago",
  },
  {
    id: 5,
    player: "Tyreek Hill",
    team: "MIA",
    teamName: "Dolphins",
    position: "WR",
    sport: "NFL",
    status: "Out",
    detail: "Ankle — will miss 2-3 weeks",
    impact: "HIGH",
    lastUpdate: "Updated 8h ago",
  },
  {
    id: 6,
    player: "Jayson Tatum",
    team: "BOS",
    teamName: "Celtics",
    position: "SF",
    sport: "NBA",
    status: "Probable",
    detail: "Knee soreness — full practice",
    impact: "LOW",
    lastUpdate: "Updated 4h ago",
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Out: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", dot: "bg-red-500" },
  Questionable: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
  "Day-to-Day": { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", dot: "bg-orange-500" },
  Probable: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500" },
};

const IMPACT_STYLES: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: "bg-red-500/15", text: "text-red-400" },
  MEDIUM: { bg: "bg-amber-500/15", text: "text-amber-400" },
  LOW: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
};

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const iVar = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function InjuryReport() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="injuries" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase flex items-center gap-2">
            Medical Room
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            INJURY <span className="text-gradient-gold">REPORT</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            The bodies that define the game. Track every setback, recovery, and
            return across all four major leagues.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Summary chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { label: "Out", count: INJURIES.filter((i) => i.status === "Out").length, color: "text-red-400 border-red-500/20 bg-red-500/5" },
            { label: "Questionable", count: INJURIES.filter((i) => i.status === "Questionable").length, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
            { label: "Day-to-Day", count: INJURIES.filter((i) => i.status === "Day-to-Day").length, color: "text-orange-400 border-orange-500/20 bg-orange-500/5" },
            { label: "Probable", count: INJURIES.filter((i) => i.status === "Probable").length, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
          ].map((chip) => (
            <Badge key={chip.label} variant="outline" className={cn("text-[10px] font-bold tracking-wider uppercase border px-2.5 py-1", chip.color)}>
              {chip.label}: {chip.count}
            </Badge>
          ))}
        </motion.div>

        {/* Injury cards */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-3"
        >
          {INJURIES.map((injury) => {
            const status = STATUS_STYLES[injury.status] || STATUS_STYLES["Questionable"];
            const impact = IMPACT_STYLES[injury.impact] || IMPACT_STYLES["LOW"];
            const isExpanded = expandedId === injury.id;

            return (
              <motion.div
                key={injury.id}
                variants={iVar}
                onClick={() => setExpandedId(isExpanded ? null : injury.id)}
                className={cn(
                  "glass-card rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group",
                  isExpanded && "border-gold/20"
                )}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Team badge */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] sm:text-xs font-black text-muted-foreground flex-shrink-0">
                      {injury.team}
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-gold transition-colors truncate">
                          {injury.player}
                        </h3>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                          {injury.position}
                        </span>
                        <Badge variant="outline" className="border-white/10 text-[9px] tracking-wider px-1.5 py-0 hidden sm:inline-flex">
                          {injury.sport}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{injury.teamName}</p>
                    </div>

                    {/* Status badge */}
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border", status.bg)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                      <span className={cn("text-[10px] sm:text-[11px] font-bold tracking-wider uppercase", status.text)}>
                        {injury.status}
                      </span>
                    </div>

                    {/* Impact badge */}
                    <div className={cn("hidden sm:flex items-center gap-1 px-2 py-1 rounded", impact.bg)}>
                      <TrendingUp className="w-3 h-3" />
                      <span className={cn("text-[10px] font-bold tracking-wider", impact.text)}>
                        {injury.impact}
                      </span>
                    </div>

                    {/* Expand arrow */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Injury:</span>
                          <span className="text-foreground font-medium">{injury.detail}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:ml-auto">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{injury.lastUpdate}</span>
                        </div>
                      </div>
                    </motion.div>
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

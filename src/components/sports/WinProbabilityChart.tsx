"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const WIN_PROB_DATA = [
  { label: "Kickoff", time: "0:00", chiefs: 55, ravens: 45, play: "Начало матча" },
  { label: "Q1", time: "8:34", chiefs: 72, ravens: 28, play: "Тачдаун-приём Kelce" },
  { label: "Q1", time: "2:10", chiefs: 65, ravens: 35, play: "Попытка филд-гола Ravens" },
  { label: "Q2", time: "6:12", chiefs: 78, ravens: 22, play: "Jones вынуждает фамбл" },
  { label: "Q2", time: "2:45", chiefs: 58, ravens: 42, play: "Тачдаун Andrews от Jackson" },
  { label: "Q2", time: "0:00", chiefs: 52, ravens: 48, play: "Перерыв" },
  { label: "Q3", time: "9:18", chiefs: 62, ravens: 38, play: "Филд-гол Butker" },
  { label: "Q3", time: "4:00", chiefs: 55, ravens: 45, play: "Раш Jackson" },
  { label: "Q4", time: "5:02", chiefs: 28, ravens: 72, play: "67-ярдовый раш-TD Jackson" },
  { label: "Q4", time: "3:15", chiefs: 35, ravens: 65, play: "Перехват Mahomes" },
  { label: "Q4", time: "1:47", chiefs: 68, ravens: 32, play: "Сник-тачдаун Mahomes" },
  { label: "Q4", time: "0:00", chiefs: 100, ravens: 0, play: "ФИНАЛ: Chiefs 17-14" },
];

const GOLD = "#d4af37";
const GOLD_DIM = "rgba(212, 175, 55, 0.15)";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/95 border border-gold/20 rounded-lg px-3 py-2.5 text-xs shadow-xl">
        <p className="text-gold font-bold mb-1">{data.play}</p>
        <div className="flex items-center gap-3">
          <span className="text-foreground">KC: <strong>{data.chiefs}%</strong></span>
          <span className="text-muted-foreground">BAL: <strong>{data.ravens}%</strong></span>
        </div>
        <p className="text-muted-foreground/60 mt-0.5">{data.time}</p>
      </div>
    );
  }
  return null;
};

export function WinProbabilityChart() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // Find biggest swing play
  const biggestSwing = WIN_PROB_DATA.reduce((max, d) => {
    const swing = Math.abs((d.chiefs - 50) - (max.chiefs - 50));
    return swing > Math.abs((d.chiefs - 50)) ? max : d;
  });

  return (
    <section id="winprob" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
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
            Искусство данных
            <Activity className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ВЕРОЯТНОСТЬ <span className="text-gradient-gold">ПОБЕДЫ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Как менялся расклад сил в триллере Chiefs против Ravens.
            Каждый розыгрыш перестраивал математику победы.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Team score bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-[10px] font-black text-gold">
              KC
            </div>
            <span className="text-sm font-bold text-foreground">Chiefs</span>
            <span className="text-lg font-black text-gradient-gold">17</span>
          </div>
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs font-bold tracking-wider text-muted-foreground">ФИНАЛ</span>
          <div className="flex-1 h-px bg-white/5" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-red-400">14</span>
            <span className="text-sm font-bold text-foreground">Ravens</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-400">
              BAL
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-xl p-4 sm:p-6"
        >
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={WIN_PROB_DATA}
                onMouseLeave={() => setActivePoint(null)}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#666", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#666", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={50} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="ravens"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#redGradient)"
                  strokeDasharray="4 4"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="chiefs"
                  stroke={GOLD}
                  strokeWidth={2.5}
                  fill="url(#goldGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key moments bar */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {[
                { play: "Kelce TD", detail: "KC 72%", type: "up" },
                { play: "Fumble", detail: "KC 78%", type: "up" },
                { play: "Jackson Rush TD", detail: "BAL 72%", type: "down" },
                { play: "Mahomes Sneak TD", detail: "KC 68%", type: "up" },
              ].map((moment) => (
                <div
                  key={moment.play}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  {moment.type === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-gold" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-[10px] font-semibold text-foreground">{moment.play}</span>
                  <span className="text-[9px] text-muted-foreground">{moment.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

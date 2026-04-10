"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { TrendingUp, PieChartIcon, Target } from "lucide-react";

// NBA Top Scorers
const SCORING_DATA = [
  { name: "Giannis", pts: 31.5 },
  { name: "Luka", pts: 29.8 },
  { name: "KD", pts: 28.4 },
  { name: "Tatum", pts: 27.1 },
  { name: "SGA", pts: 26.8 },
  { name: "LeBron", pts: 25.7 },
];

// NFL AFC Standings
const AFC_DATA = [
  { name: "Chiefs", value: 14, color: "#d4af37" },
  { name: "Ravens", value: 13, color: "#8b6914" },
  { name: "Bills", value: 12, color: "#a0855c" },
  { name: "Bengals", value: 10, color: "#6b5b3e" },
  { name: "Texans", value: 10, color: "#4a3f2a" },
  { name: "Others", value: 15, color: "#2a2518" },
];

// Player Comparison Radar
const RADAR_DATA = [
  { stat: "Скорость", mahomes: 85, allen: 88 },
  { stat: "Бросок", mahomes: 95, allen: 92 },
  { stat: "Точность", mahomes: 93, allen: 87 },
  { stat: "Ключевые", mahomes: 97, allen: 84 },
  { stat: "Выносливость", mahomes: 72, allen: 91 },
  { stat: "Видение", mahomes: 96, allen: 88 },
];

const GOLD = "#d4af37";
const GOLD_DIM = "rgba(212, 175, 55, 0.3)";
const CARD_STYLE =
  "glass-card rounded-xl p-5 sm:p-6 hover:border-gold/20 transition-all duration-300";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background/95 border border-gray-200 dark:border-gold/20 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-foreground font-semibold">{label}</p>
        <p className="text-gold">{payload[0].value} {payload[0].value > 100 ? "ярдов" : "PPG"}</p>
      </div>
    );
  }
  return null;
};

export function DeepStats() {
  return (
    <section id="stats" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            Аналитика
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ГЛУБИННАЯ <span className="text-gradient-gold">СТАТИСТИКА</span>
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Scoring Leaders Chart */}
          <motion.div variants={itemVariants} className={`${CARD_STYLE} lg:col-span-1`}>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                ЛУЧШИЕ БОМБАРДИРЫ NBA
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SCORING_DATA} layout="vertical" barCategoryGap="25%">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="pts" radius={[0, 4, 4, 0]}>
                    {SCORING_DATA.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? GOLD : GOLD_DIM} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AFC Standings Pie */}
          <motion.div variants={itemVariants} className={`${CARD_STYLE} lg:col-span-1`}>
            <div className="flex items-center gap-2 mb-5">
              <PieChartIcon className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                РАСПРЕДЕЛЕНИЕ ПОБЕД AFC
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={AFC_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {AFC_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-background/95 border border-gray-200 dark:border-gold/20 rounded-lg px-3 py-2 text-xs">
                            <p className="text-foreground font-semibold">
                              {payload[0].name}
                            </p>
                            <p className="text-gold">{payload[0].value} побед</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Player Radar */}
          <motion.div variants={itemVariants} className={`${CARD_STYLE} lg:col-span-1`}>
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                СРАВНЕНИЕ КВ
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="stat"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar
                    name="Mahomes"
                    dataKey="mahomes"
                    stroke={GOLD}
                    fill={GOLD}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Allen"
                    dataKey="allen"
                    stroke="#888"
                    fill="#888"
                    fillOpacity={0.05}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
                    iconType="circle"
                    iconSize={6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

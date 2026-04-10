"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Star, Zap, ChevronRight, Filter } from "lucide-react";

interface Prospect {
  rank: number;
  name: string;
  position: string;
  school: string;
  conference: string;
  height: string;
  weight: number;
  compositeScore: number;
  grade: string;
  trend: "up" | "down" | "stable";
  highlight: string;
  comparison: string;
  badge?: "generational" | "elite" | "riser" | "sleeper";
}

const PROSPECTS: Prospect[] = [
  {
    rank: 1, name: "Travis Hunter", position: "CB/WR", school: "Colorado",
    conference: "Big 12", height: "6'1\"", weight: 195, compositeScore: 98.7,
    grade: "A+", trend: "up",
    highlight: "Двусторонний феномен, переопределяющий ценность позиций в современном NFL",
    comparison: "Prime Deion Sanders встречает Chase Young",
    badge: "generational"
  },
  {
    rank: 2, name: "Abdul Carter", position: "EDGE", school: "Penn State",
    conference: "Big Ten", height: "6'3\"", weight: 252, compositeScore: 97.2,
    grade: "A+", trend: "stable",
    highlight: "Доминирующий пас-рашер с элитным сгибом и силовыми приёмами",
    comparison: "Дизраптор уровня Micah Parsons",
    badge: "elite"
  },
  {
    rank: 3, name: "Cam Ward", position: "QB", school: "Miami",
    conference: "ACC", height: "6'2\"", weight: 218, compositeScore: 96.1,
    grade: "A", trend: "up",
    highlight: "Рекордный сезон с потрясающими навыками импровизации",
    comparison: "Вайбы по плёнке Patrick Mahomes в колледже",
    badge: "riser"
  },
  {
    rank: 4, name: "Shedeur Sanders", position: "QB", school: "Colorado",
    conference: "Big 12", height: "6'2\"", weight: 215, compositeScore: 95.4,
    grade: "A", trend: "down",
    highlight: "Элитное нахождение в кармане и скорость обработки под давлением",
    comparison: "Точность Drew Brees с талантом руки Josh Allen",
    badge: "elite"
  },
  {
    rank: 5, name: "Mason Graham", position: "DT", school: "Michigan",
    conference: "Big Ten", height: "6'3\"", weight: 318, compositeScore: 94.8,
    grade: "A", trend: "stable",
    highlight: "Внутренний разрушитель с редкой резкостью для своих габаритов",
    comparison: "Aaron Donald-lite с лучшим потенциалом в пас-раше",
    badge: "elite"
  },
  {
    rank: 6, name: "Jahdae Barron", position: "CB", school: "Texas",
    conference: "SEC", height: "5'11\"", weight: 195, compositeScore: 93.5,
    grade: "A-", trend: "up",
    highlight: "Специалист по закрывающему прикрытию с инстинктами перехватчика",
    comparison: "Jaire Alexander с лучшими тэклами",
    badge: "riser"
  },
  {
    rank: 7, name: "Tyler Warren", position: "TE", school: "Penn State",
    conference: "Big Ten", height: "6'6\"", weight: 257, compositeScore: 92.9,
    grade: "A-", trend: "up",
    highlight: "Швейцарский нож — ставился повсюду и доминировал в каждом матчапе",
    comparison: "Потолок Kyle Pitts с менталитетом George Kittle",
    badge: "riser"
  },
  {
    rank: 8, name: "James Pearce Jr.", position: "EDGE", school: "Tennessee",
    conference: "SEC", height: "6'5\"", weight: 245, compositeScore: 92.1,
    grade: "A-", trend: "stable",
    highlight: "Длина и атлетизм с края, которые нельзя блокировать один на один",
    comparison: "Nick Bosa с большим атлетическим потенциалом",
  },
  {
    rank: 9, name: "Luther Burden III", position: "WR", school: "Missouri",
    conference: "SEC", height: "6'0\"", weight: 208, compositeScore: 91.4,
    grade: "B+", trend: "down",
    highlight: "Элитная игра после ловли и отточенная техника маршрутов",
    comparison: "Deebo Samuel в принимающем корпусе, которому нужен #1",
    badge: "sleeper"
  },
  {
    rank: 10, name: "Kenneth Grant", position: "DT", school: "Michigan",
    conference: "Big Ten", height: "6'4\"", weight: 339, compositeScore: 90.8,
    grade: "B+", trend: "up",
    highlight: "Массивный стоппер бега, добавивший разрушительный спин-движение в пас-раш",
    comparison: "Двигатель Dannell Ellerbe в рамке Vince Wilfork",
    badge: "riser"
  },
];

const POSITION_FILTERS = ["ALL", "QB", "WR", "TE", "EDGE", "DT", "CB", "RB", "OT", "S"];

const BADGE_CONFIG = {
  generational: { label: "ГЕНЕРАЦИОННЫЙ", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
  elite: { label: "ЭЛИТНЫЙ", color: "bg-gold/20 text-gold border border-gold/30" },
  riser: { label: "РАСТУЩИЙ", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  sleeper: { label: "ЦЕННЫЙ ВЫБОР", color: "bg-sky-500/20 text-sky-400 border border-sky-500/30" },
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-amber-400",
  "A": "text-emerald-400",
  "A-": "text-emerald-300",
  "B+": "text-sky-400",
};

export function DraftBigBoard() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedRank, setExpandedRank] = useState<number | null>(null);

  const filteredProspects = activeFilter === "ALL"
    ? PROSPECTS
    : PROSPECTS.filter(p => p.position.includes(activeFilter));

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gold/60 bg-gold/10 px-3 py-1 rounded-full">
                DRAFT HQ
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-400 bg-red-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> 2025
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              DRAFT <span className="text-gradient-gold">БОРД</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg">
              Итоговый скаутинг-отчёт. Композитные оценки на основе изучения плёнки, аналитики и инсайдерской информации.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <span>{filteredProspects.length} проспект{filteredProspects.length !== 1 ? "ов" : ""}</span>
          </div>
        </div>

        {/* Position Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {POSITION_FILTERS.map(pos => (
            <button
              key={pos}
              onClick={() => setActiveFilter(pos)}
              className={`px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-md transition-all duration-200 focus-gold ${
                activeFilter === pos
                  ? "bg-gold/15 text-gold border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-muted text-muted-foreground border border-border dark:bg-white/[0.03] dark:border-white/[0.06] hover:bg-muted/80 dark:hover:bg-white/[0.06] hover:text-foreground/80"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Prospect Cards */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {filteredProspects.map((prospect, index) => (
              <motion.div
                key={prospect.rank}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <button
                  onClick={() => setExpandedRank(expandedRank === prospect.rank ? null : prospect.rank)}
                  className="w-full text-left glass-card-interactive rounded-xl p-4 sm:p-5 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                        prospect.rank <= 3
                          ? "bg-gradient-to-br from-gold/20 to-gold/5 text-gold border border-gold/20"
                          : prospect.rank <= 5
                          ? "bg-muted text-foreground border border-border dark:bg-white/[0.05] dark:border-white/[0.08]"
                          : "bg-muted text-muted-foreground border border-border dark:bg-white/[0.03] dark:border-white/[0.05]"
                      }`}>
                        {prospect.rank <= 3 ? (
                          <span className="flex items-center gap-1">
                            {prospect.rank === 1 && <Star className="w-3.5 h-3.5 text-amber-400" />}
                            {prospect.rank}
                          </span>
                        ) : prospect.rank}
                      </div>
                      {prospect.trend === "up" && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                      {prospect.trend === "down" && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        </div>
                      )}
                      {prospect.trend === "stable" && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <Minus className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                          {prospect.name}
                        </h3>
                        {prospect.badge && (
                          <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full ${BADGE_CONFIG[prospect.badge].color}`}>
                            {BADGE_CONFIG[prospect.badge].label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="font-bold text-gold/70">{prospect.position}</span>
                        <span className="w-px h-3 bg-foreground/10 dark:bg-white/10" />
                        <span>{prospect.school}</span>
                        <span className="hidden sm:inline text-border dark:text-white/10">|</span>
                        <span className="hidden sm:inline">{prospect.height} · {prospect.weight} lbs</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl sm:text-3xl font-black stat-glow text-gradient-gold">
                        {prospect.compositeScore}
                      </div>
                      <div className={`text-[11px] font-bold tracking-wider ${GRADE_COLORS[prospect.grade] || "text-muted-foreground"}`}>
                        {prospect.grade}
                      </div>
                    </div>

                    {/* Expand Chevron */}
                    <ChevronRight className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 ${
                      expandedRank === prospect.rank ? "rotate-90 text-gold" : "group-hover:text-muted-foreground"
                    }`} />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedRank === prospect.rank && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border dark:border-white/[0.06]">
                          <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            {prospect.highlight}
                          </p>
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted border border-border dark:bg-white/[0.02] dark:border-white/[0.04]">
                            <Zap className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-gold/60">ПРО-СРАВНЕНИЕ</span>
                              <p className="text-sm text-foreground/70 mt-0.5">{prospect.comparison}</p>
                            </div>
                          </div>
                          {/* Score Bar Visualization */}
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prospect.compositeScore}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-gold/60 via-gold to-amber-400"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground tracking-wider">
                              {prospect.conference}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60 mb-3">
            Композитные оценки обновляются еженедельно · Анализ плёнки от 42 скаутов NFL
          </p>
          <button className="text-xs font-bold tracking-wider uppercase text-gold/60 hover:text-gold transition-colors gold-underline focus-gold">
            Полный список из 300 игроков
          </button>
        </div>
      </div>
    </section>
  );
}

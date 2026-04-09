"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronLeft, ChevronRight, Calendar, Trophy, Zap, Star } from "lucide-react";

const HISTORY_EVENTS = [
  {
    year: 2024,
    month: 2,
    day: 11,
    title: "3-й Супербоул Mahomes",
    description: "Patrick Mahomes выводит Kansas City Chiefs к победе 25-22 в овертайме над 49ers в Супербоуле LVIII, закрепляя династию.",
    sport: "NFL",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 2023,
    month: 6,
    day: 12,
    title: "Nuggets выигрывают первый чемпионский титул NBA",
    description: "Nikola Jokić выдаёт исторический трипл-дабл и приносит Denver первый чемпионский титул NBA за пять игр против Miami.",
    sport: "NBA",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 2022,
    month: 11,
    day: 15,
    title: "Триумф Messi на чемпионате мира",
    description: "Lionel Messi исполняет свою судьбу, выводя Аргентину к победе на чемпионате мира в одном из величайших финалов в истории.",
    sport: "Soccer",
    icon: Star,
    impact: "legendary",
  },
  {
    year: 2020,
    month: 1,
    day: 26,
    title: "Наследие Kobe Bryant",
    description: "Мир скорбит о потере Kobe Bryant, его дочери Джанны и ещё семи человек в трагической крушении вертолёта. Mamba Forever.",
    sport: "NBA",
    icon: Star,
    impact: "historic",
  },
  {
    year: 2019,
    month: 10,
    day: 15,
    title: "Washington Nationals завершают чудо",
    description: "От 19-31 до чемпионов Мировой серии. Nationals завершают один из самых невероятных плей-офф заузов в истории MLB.",
    sport: "MLB",
    icon: Zap,
    impact: "historic",
  },
  {
    year: 2016,
    month: 6,
    day: 19,
    title: "Блок, бросок, прорыв",
    description: "LeBron James совершает величайший защитный розыгрыш в истории финалов NBA, когда Cleveland отыгрывает отставание 1-3 против Warriors с 73 победами.",
    sport: "NBA",
    icon: Zap,
    impact: "legendary",
  },
  {
    year: 2012,
    month: 9,
    day: 5,
    title: "Катастрофа с заменяющими судьями",
    description: "Игра 'Fail Mary'. Спорный решающий тачдаун Golden Tate за Seattle обнажает хаос локаута судей NFL.",
    sport: "NFL",
    icon: History,
    impact: "historic",
  },
  {
    year: 2004,
    month: 10,
    day: 27,
    title: "Red Sox прерывают проклятие",
    description: "Boston совершает невозможный камбэк от 0-3 против Yankees, а затем разгромом обыгрывают Cardinals и выигрывают первый титул за 86 лет.",
    sport: "MLB",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 1998,
    month: 3,
    day: 26,
    title: "Бросок — Jordan над Russell",
    description: "Michael Jordan забивает 'Последний бросок', выигрывая 6-ю игру финала NBA и завершая второй трёхкратный чемпионский цикл Bulls в легендарном стиле.",
    sport: "NBA",
    icon: Star,
    impact: "legendary",
  },
  {
    year: 1980,
    month: 2,
    day: 22,
    title: "Чудо на льду",
    description: "Группа американских студентов побеждает СССР 4-3 в величайшей сенсации в истории хоккея на Олимпиаде в Лейк-Плэсиде.",
    sport: "NHL",
    icon: Zap,
    impact: "legendary",
  },
  {
    year: 1969,
    month: 10,
    day: 16,
    title: "Невозможная мечта",
    description: "'Потрясающие Mets' совершают самый шокирующий разворот сезона в истории спорта, пройдя путь от худших к лучшим и выиграв Мировую серию.",
    sport: "MLB",
    icon: Trophy,
    impact: "legendary",
  },
  {
    year: 1958,
    month: 12,
    day: 28,
    title: "Величайшая игра в истории",
    description: "Baltimore Colts побеждают New York Giants 23-17 в овертайме до первой реализации, в матче, который поставил профессиональный футбол на карту страны.",
    sport: "NFL",
    icon: History,
    impact: "historic",
  },
];

const SPORT_COLORS: Record<string, string> = {
  NFL: "text-red-400 border-red-500/20 bg-red-500/5",
  NBA: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  MLB: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  NHL: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  Soccer: "text-purple-400 border-purple-500/20 bg-purple-500/5",
};

const IMPACT_COLORS: Record<string, { text: string; bg: string }> = {
  legendary: { text: "text-gold", bg: "bg-gold/10 border-gold/20" },
  historic: { text: "text-foreground/70", bg: "bg-white/5 border-white/10" },
};

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

export function SportsHistory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HISTORY_EVENTS.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HISTORY_EVENTS.length) % HISTORY_EVENTS.length);
  };

  const event = HISTORY_EVENTS[currentIndex];
  const EventIcon = event.icon;

  return (
    <section id="history" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background */}
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
            Архив
            <History className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ЭТОТ ДЕНЬ В <span className="text-gradient-gold">СПОРТЕ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Моменты, перешагнувшие за рамки игры. Переживите снова решающие
            розыгрыши, сенсации и легенды, сформировавшие историю спорта.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Main card */}
        <div className="glass-card rounded-2xl overflow-hidden relative">
          {/* Year watermark */}
          <div className="absolute top-4 right-6 sm:top-6 sm:right-8 text-[80px] sm:text-[120px] font-black text-white/[0.03] leading-none select-none pointer-events-none">
            {event.year}
          </div>

          <div className="p-6 sm:p-8 lg:p-10 relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Top row: date + badges */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  <div className="flex items-center gap-2 text-gold">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {event.month}/{event.day}/{event.year}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${SPORT_COLORS[event.sport] || "text-muted-foreground bg-white/5 border-white/10"}`}>
                    {event.sport}
                  </span>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${IMPACT_COLORS[event.impact]?.bg || "bg-white/5 border-white/10"} ${IMPACT_COLORS[event.impact]?.text || "text-muted-foreground"}`}>
                    {event.impact === "legendary" ? "Легендарный" : "Исторический"}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <EventIcon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {event.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
              <button
                onClick={prev}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Назад</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {HISTORY_EVENTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentIndex
                        ? "w-6 h-2 bg-gold"
                        : "w-2 h-2 bg-white/10 hover:bg-white/20"
                    }`}
                    aria-label={`Перейти к событию ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
              >
                <span className="hidden sm:inline">Далее</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline mini-strip */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {HISTORY_EVENTS.map((e, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                i === currentIndex
                  ? "bg-gold/10 border border-gold/20 text-gold"
                  : "bg-white/[0.02] border border-transparent text-muted-foreground/40 hover:text-muted-foreground hover:bg-white/[0.04]"
              }`}
            >
              {e.year}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

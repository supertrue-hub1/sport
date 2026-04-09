"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ExternalLink } from "lucide-react";

interface BreakingNews {
  id: number;
  headline: string;
  source: string;
  sport: "NFL" | "NBA" | "MLB" | "NHL";
  urgency: "breaking" | "developing" | "confirmed";
  time: string;
  isLive: boolean;
}

const BREAKING_NEWS: BreakingNews[] = [
  {
    id: 1,
    headline: "Срочно: Chiefs и 49ers договорились о масштабном обмене, отправляющем защитника Pro Bowl в Канзас-Сити",
    source: "Adam Schefter",
    sport: "NFL",
    urgency: "breaking",
    time: "2 мин назад",
    isLive: true,
  },
  {
    id: 2,
    headline: "Звезда Lakers Энтони Дэвис прошёл МРТ голеностопа — первичный диагноз не выявил структурных повреждений",
    source: "Shams Charania",
    sport: "NBA",
    urgency: "developing",
    time: "15 мин назад",
    isLive: true,
  },
  {
    id: 3,
    headline: "Сёхей Отани получил допуск к программе бросков — Dodgers ожидают его возвращения к середине апреля",
    source: "Jeff Passan",
    sport: "MLB",
    urgency: "confirmed",
    time: "42 мин назад",
    isLive: false,
  },
  {
    id: 4,
    headline: "Oilers приобрели элитного защитника у Hurricanes, изменив расклад сил в Западной конференции",
    source: "Elliotte Friedman",
    sport: "NHL",
    urgency: "confirmed",
    time: "1 ч назад",
    isLive: false,
  },
  {
    id: 5,
    headline: "Комитет NFL предлагает крупные изменения правил, включая автоматическое удаление за targeting",
    source: "Ian Rapoport",
    sport: "NFL",
    urgency: "developing",
    time: "2 ч назад",
    isLive: false,
  },
  {
    id: 6,
    headline: "Celtics продлили контракт главного тренера до 2028 года — самый дорогой контракт в истории NBA",
    source: "Adrian Wojnarowski",
    sport: "NBA",
    urgency: "confirmed",
    time: "3 ч назад",
    isLive: false,
  },
];

const SPORT_COLORS = {
  NFL: { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-500" },
  NBA: { bg: "bg-orange-500/15", text: "text-orange-400", dot: "bg-orange-500" },
  MLB: { bg: "bg-sky-500/15", text: "text-sky-400", dot: "bg-sky-500" },
  NHL: { bg: "bg-cyan-500/15", text: "text-cyan-400", dot: "bg-cyan-500" },
};

const URGENCY_CONFIG = {
  breaking: { label: "СРОЧНО", pulse: true, color: "bg-red-500 text-white" },
  developing: { label: "РАЗВИВАЕТСЯ", pulse: false, color: "bg-amber-500/80 text-black" },
  confirmed: { label: "ПОДТВЕРЖДЕНО", pulse: false, color: "bg-emerald-500/80 text-black" },
};

export function BreakingNewsTicker() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % BREAKING_NEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  if (!isVisible) return null;

  const current = BREAKING_NEWS[currentIndex];
  const sportConfig = SPORT_COLORS[current.sport];
  const urgencyConfig = URGENCY_CONFIG[current.urgency];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative border-b border-white/[0.06]"
      >
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 ${sportConfig.bg} opacity-30`} />

          <div className="relative px-4 py-2.5 sm:py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              {/* Breaking Badge */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <div className={`px-2.5 py-1 rounded-md ${urgencyConfig.color} flex items-center gap-1.5`}>
                    {urgencyConfig.pulse && (
                      <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                      </div>
                    )}
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-wider">{urgencyConfig.label}</span>
                  </div>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${sportConfig.dot} hidden sm:block`} />
                <span className={`text-[10px] font-bold tracking-wider ${sportConfig.text} hidden sm:block`}>
                  {current.sport}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-foreground/90 truncate font-medium"
                  >
                    {current.headline}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{current.source}</span>
                  <span className="w-px h-2.5 bg-white/10" />
                  <span className="text-[10px] text-muted-foreground">{current.time}</span>
                  {current.isLive && (
                    <>
                      <span className="w-px h-2.5 bg-white/10" />
                      <span className="flex items-center gap-1 text-[10px] text-red-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-muted-foreground hidden md:block">{currentIndex + 1}/{BREAKING_NEWS.length}</span>
                <button className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors" aria-label="Подробнее">
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]">
            {!isPaused && (
              <motion.div
                key={current.id}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className={`h-full ${sportConfig.dot}`}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

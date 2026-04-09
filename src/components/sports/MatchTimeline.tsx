"use client";
// v2
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Goal,
  Target,
  Shield,
  Zap,
  Clock,
} from "lucide-react";

const GAME_EVENTS = [
  {
    quarter: "Q1",
    time: "12:00",
    type: "kickoff",
    icon: Zap,
    title: "Начальный кикофф",
    description:
      "Chiefs получают начальный кикофф. Arrowhead Stadium гудит — 76 000 фанатов на ногах.",
    score: "Chiefs 0 — Ravens 0",
    highlight: false,
  },
  {
    quarter: "Q1",
    time: "8:34",
    type: "touchdown",
    icon: Goal,
    title: "Передача Mahomes на Kelce — 34 ярда",
    description:
      "На 3-м дауне и 8 ярдах Mahomes уходит влево, уворачивается от давления и бросает идеальный мяч Kelce в угол энд-зоны. Классический футбол Chiefs.",
    score: "Chiefs 7 — Ravens 0",
    highlight: true,
  },
  {
    quarter: "Q2",
    time: "6:12",
    type: "defense",
    icon: Shield,
    title: "Chris Jones вынуждает фамбл",
    description:
      "Jones проходит мимо гарда и выбивает мяч из рук Lamar Jackson со спины. Мяч отскакивает — Chiefs подбирают на 22-ярде Ravens.",
    score: "Chiefs 7 — Ravens 0",
    highlight: true,
  },
  {
    quarter: "Q2",
    time: "2:45",
    type: "touchdown",
    icon: Goal,
    title: "Передача Jackson на Andrews — 12-ярдовый тачдаун",
    description:
      "Lamar Jackson отвечает хирургически точным драйвом на 9 розыгрышей и 88 ярдов, завершая его точным пасом на Mark Andrews в ред-зоне.",
    score: "Chiefs 7 — Ravens 7",
    highlight: false,
  },
  {
    quarter: "Q3",
    time: "9:18",
    type: "field_goal",
    icon: Target,
    title: "Филд-гол Butker с 47 ярдов",
    description:
      "Изматывающий драйв на 14 розыгрышей замирает на 29-ярде. Butker пробивает мяч сквозь штанги, возвращая лидерство.",
    score: "Chiefs 10 — Ravens 7",
    highlight: false,
  },
  {
    quarter: "Q4",
    time: "5:02",
    type: "touchdown",
    icon: Goal,
    title: "Раш-тачдаун Jackson на 67 ярдов",
    description:
      "Лучший розыгрыш матча. Jackson забирает мяч на ри-опшене, ломает два захвата и обегает всю секундари Chiefs. M&T Bank Stadium взрывается.",
    score: "Chiefs 10 — Ravens 14",
    highlight: true,
  },
  {
    quarter: "Q4",
    time: "1:47",
    type: "touchdown",
    icon: Goal,
    title: "Сник Mahomes на 2 ярда — ТАЧДАУН ВПЕРЁД",
    description:
      "Двухминутная спешка. Mahomes дирижирует шедевром на 12 розыгрышей и 75 ярдов. На 4-м дауне с 2 ярдов до тачдаун-зоны он пробивает путь сам. The Chief снова на вершине.",
    score: "Chiefs 17 — Ravens 14",
    highlight: true,
  },
  {
    quarter: "Q4",
    time: "0:00",
    type: "end",
    icon: Clock,
    title: "Конец матча — Chiefs побеждают 17-14",
    description:
      "Попытка Hail Mary оказывается неточной. Mahomes и Chiefs переживают ещё один триллер на Arrowhead. Династия продолжает шествие.",
    score: "ФИНАЛ: Chiefs 17 — Ravens 14",
    highlight: true,
  },
];

const TYPE_COLORS: Record<string, string> = {
  touchdown: "border-gold/50 bg-gold/5",
  defense: "border-emerald-500/50 bg-emerald-500/5",
  field_goal: "border-amber-500/50 bg-amber-500/5",
  kickoff: "border-white/10 bg-white/5",
  end: "border-gold/50 bg-gold/10",
};

function EventCard({
  event,
  index,
}: {
  event: (typeof GAME_EVENTS)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLeft = index % 2 === 0;
  const IconComp = event.icon;

  return (
    <div className="relative flex items-start gap-4 sm:gap-8">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: "spring" }}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center ${
            TYPE_COLORS[event.type]
          } ${event.highlight ? "gold-glow" : ""}`}
        >
          <IconComp
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              event.highlight ? "text-gold" : "text-muted-foreground"
            }`}
          />
        </motion.div>
        {index < GAME_EVENTS.length - 1 && (
          <div className="w-px flex-1 min-h-12 bg-gradient-to-b from-white/10 to-transparent" />
        )}
      </div>

      {/* Event Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className={`flex-1 mb-8 ${isLeft ? "sm:text-right" : "sm:text-left"}`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full text-left glass-card rounded-lg p-4 sm:p-5 transition-all duration-300 hover:border-gold/20 cursor-pointer ${
            isLeft ? "sm:text-right" : "sm:text-left"
          }`}
        >
          {/* Time + Quarter */}
          <div
            className={`flex items-center gap-2 mb-2 ${
              isLeft ? "sm:justify-end" : "sm:justify-start"
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider text-gold uppercase bg-gold/10 px-2 py-0.5 rounded">
              {event.quarter}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight">
            {event.title}
          </h4>

          {/* Score */}
          <p
            className={`text-xs font-semibold mt-1 ${
              event.highlight ? "text-gold" : "text-muted-foreground"
            }`}
          >
            {event.score}
          </p>

          {/* Expandable description */}
          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed overflow-hidden"
              >
                {event.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className={`mt-2 flex ${isLeft ? "sm:justify-end" : "sm:justify-start"}`}
          >
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
}

export function MatchTimeline() {
  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            Летопись
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ХРОНОЛОГИЯ <span className="text-gradient-gold">МАТЧА</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md">
            Переживите каждый ключевой момент триллера Chiefs против Ravens.
            Нажмите на любой розыгрыш, чтобы развернуть историю.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Timeline */}
        <div>
          {GAME_EVENTS.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

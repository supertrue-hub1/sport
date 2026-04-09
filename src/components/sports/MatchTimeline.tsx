"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Football,
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
    title: "Opening Kickoff",
    description:
      "Chiefs receive the opening kickoff. Arrowhead Stadium is electric — 76,000 fans on their feet.",
    score: "Chiefs 0 — Ravens 0",
    highlight: false,
  },
  {
    quarter: "Q1",
    time: "8:34",
    type: "touchdown",
    icon: Football,
    title: "Mahomes to Kelce — 34-Yard Strike",
    description:
      "On 3rd & 8, Mahomes scrambles left, evades the rush, and delivers a dime to Kelce in the corner of the end zone. Vintage Chiefs football.",
    score: "Chiefs 7 — Ravens 0",
    highlight: true,
  },
  {
    quarter: "Q2",
    time: "6:12",
    type: "defense",
    icon: Shield,
    title: "Chris Jones Forces Fumble",
    description:
      "Jones blows past the guard and strips Lamar Jackson from behind. The ball bounces loose — Chiefs recover at the Ravens' 22.",
    score: "Chiefs 7 — Ravens 0",
    highlight: true,
  },
  {
    quarter: "Q2",
    time: "2:45",
    type: "touchdown",
    icon: Football,
    title: "Jackson to Andrews — 12-Yard TD",
    description:
      "Lamar Jackson responds with a surgical 9-play, 88-yard drive, capping it with a laser to Mark Andrews in the red zone.",
    score: "Chiefs 7 — Ravens 7",
    highlight: false,
  },
  {
    quarter: "Q3",
    time: "9:18",
    type: "field_goal",
    icon: Target,
    title: "Butker 47-Yard Field Goal",
    description:
      "A 14-play grind of a drive stalls at the 29. Butker drills it through the uprights to restore the lead.",
    score: "Chiefs 10 — Ravens 7",
    highlight: false,
  },
  {
    quarter: "Q4",
    time: "5:02",
    type: "touchdown",
    icon: Football,
    title: "Jackson 67-Yard Rush TD",
    description:
      "The play of the game. Jackson keeps it on a read-option, breaks two tackles, and outruns the entire Chiefs secondary. M&T Bank Stadium erupts.",
    score: "Chiefs 10 — Ravens 14",
    highlight: true,
  },
  {
    quarter: "Q4",
    time: "1:47",
    type: "touchdown",
    icon: Football,
    title: "Mahomes 2-Yard Sneak — GO-AHEAD TD",
    description:
      "The two-minute drill. Mahomes orchestrates a 12-play, 75-yard masterpiece. On 4th & goal from the 2, he punches it in himself. The Chief is back on top.",
    score: "Chiefs 17 — Ravens 14",
    highlight: true,
  },
  {
    quarter: "Q4",
    time: "0:00",
    type: "end",
    icon: Clock,
    title: "Game Over — Chiefs Win 17-14",
    description:
      "Hail Mary attempt falls incomplete. Mahomes and the Chiefs survive another thriller at Arrowhead. The dynasty marches on.",
    score: "FINAL: Chiefs 17 — Ravens 14",
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
            Chronicle
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            GAME <span className="text-gradient-gold">TIMELINE</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md">
            Relive every pivotal moment from the Chiefs vs Ravens thriller.
            Click any play to expand the story.
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

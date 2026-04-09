"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CheckCircle2, Users, Vote, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PollOption {
  id: string;
  label: string;
  team: string;
  color: string;
  barColor: string;
}

interface Poll {
  id: number;
  question: string;
  context: string;
  category: string;
  totalVotes: number;
  options: PollOption[];
}

const POLLS: Poll[] = [
  {
    id: 1,
    question: "Кто выиграет Супербоул в этом сезоне?",
    context: "NFL · Предпросмотр сезона 2025",
    category: "NFL",
    totalVotes: 14832,
    options: [
      { id: "a", label: "Kansas City Chiefs", team: "KC", color: "text-gold", barColor: "bg-gold" },
      { id: "b", label: "Buffalo Bills", team: "BUF", color: "text-blue-400", barColor: "bg-blue-500" },
      { id: "c", label: "San Francisco 49ers", team: "SF", color: "text-red-400", barColor: "bg-red-500" },
      { id: "d", label: "Detroit Lions", team: "DET", color: "text-sky-400", barColor: "bg-sky-500" },
    ],
  },
  {
    id: 2,
    question: "Кто сейчас MVP NBA?",
    context: "NBA · Бюллетень середины сезона",
    category: "NBA",
    totalVotes: 23419,
    options: [
      { id: "a", label: "Shai Gilgeous-Alexander", team: "OKC", color: "text-orange-400", barColor: "bg-orange-500" },
      { id: "b", label: "Nikola Jokić", team: "DEN", color: "text-yellow-400", barColor: "bg-yellow-500" },
      { id: "c", label: "Giannis Antetokounmpo", team: "MIL", color: "text-emerald-400", barColor: "bg-emerald-500" },
      { id: "d", label: "Jayson Tatum", team: "BOS", color: "text-green-400", barColor: "bg-green-500" },
    ],
  },
  {
    id: 3,
    question: "Лучший клатч-перформер всех времён?",
    context: "Дискуссия всех времён",
    category: "ALL",
    totalVotes: 45102,
    options: [
      { id: "a", label: "Michael Jordan", team: "CHI", color: "text-red-400", barColor: "bg-red-500" },
      { id: "b", label: "LeBron James", team: "LAL", color: "text-yellow-400", barColor: "bg-yellow-500" },
      { id: "c", label: "Tom Brady", team: "TB", color: "text-sky-400", barColor: "bg-sky-500" },
      { id: "d", label: "Kobe Bryant", team: "LAL", color: "text-purple-400", barColor: "bg-purple-500" },
    ],
  },
];

// Simulated vote percentages
const VOTE_DATA: Record<string, Record<string, number>> = {
  "1": { a: 34, b: 28, c: 22, d: 16 },
  "2": { a: 38, b: 31, c: 18, d: 13 },
  "3": { a: 42, b: 30, c: 18, d: 10 },
};

export function FanPoll() {
  const [activePollId, setActivePollId] = useState(1);
  const [votes, setVotes] = useState<Record<string, string | null>>({});
  const [animateResults, setAnimateResults] = useState(false);

  const poll = POLLS.find((p) => p.id === activePollId) || POLLS[0];
  const votePercentages = VOTE_DATA[String(poll.id)] || {};
  const userVote = votes[String(poll.id)];
  const hasVoted = userVote != null;

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [String(poll.id)]: optionId }));
    setAnimateResults(true);
    setTimeout(() => setAnimateResults(false), 1000);
  };

  return (
    <section id="polls" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.01] to-transparent" />
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
            Ваш голос
            <Vote className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ОПРОС <span className="text-gradient-gold">БОЛЬШИХ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Ваш голос важен. Проголосуйте и узнайте, на чьей стороне
            общественность в главных спортивных дискуссиях.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Poll selector tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {POLLS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePollId(p.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all border ${
                p.id === activePollId
                  ? "bg-gold/10 border-gold/30 text-gold"
                  : "bg-white/[0.02] border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {p.category}
            </button>
          ))}
        </div>

        {/* Poll card */}
        <motion.div
          key={poll.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          {/* Question area */}
          <div className="p-6 sm:p-8 pb-4 sm:pb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                {poll.context}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Users className="w-3 h-3" />
                {poll.totalVotes.toLocaleString()} голосов
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {poll.question}
            </h3>
          </div>

          {/* Options */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
            {poll.options.map((option, i) => {
              const pct = votePercentages[option.id] || 0;
              const isSelected = userVote === option.id;
              const showResults = hasVoted;

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  initial={false}
                  animate={animateResults && showResults ? { scale: isSelected ? [1, 1.02, 1] : 1 } : {}}
                  className={`w-full relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    showResults
                      ? isSelected
                        ? "border-gold/30 bg-gold/[0.04]"
                        : "border-white/5 bg-white/[0.01]"
                      : "border-white/8 hover:border-gold/20 hover:bg-white/[0.02] cursor-pointer"
                  }`}
                  disabled={hasVoted}
                >
                  {/* Result bar */}
                  {showResults && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                      className={`absolute inset-y-0 left-0 ${option.barColor} opacity-10`}
                    />
                  )}

                  <div className="relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                    {/* Team badge */}
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-black text-muted-foreground flex-shrink-0 ${
                      isSelected ? "border-gold/30 bg-gold/10" : "bg-white/[0.03]"
                    }`}>
                      {option.team}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0 text-left">
                      <span className={`text-sm sm:text-base font-bold ${isSelected ? "text-gold" : "text-foreground"}`}>
                        {option.label}
                      </span>
                    </div>

                    {/* Result */}
                    <AnimatePresence>
                      {showResults && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 flex-shrink-0"
                        >
                          <span className={`text-lg sm:text-xl font-black ${option.color}`}>
                            {pct}%
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-gold" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Radio indicator when not voted */}
                    {!showResults && (
                      <div className="w-4 h-4 rounded-full border border-white/15 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-6 sm:px-8 pb-6"
            >
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-gold/50" />
                  {poll.totalVotes.toLocaleString()} всего голосов
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-muted-foreground hover:text-gold"
                  onClick={() => setActivePollId((prev) => {
                    const next = POLLS.find(p => p.id !== prev);
                    return next ? next.id : prev;
                  })}
                >
                  Следующий опрос →
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

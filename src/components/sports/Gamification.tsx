"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";

// MVP Candidates
const MVP_CANDIDATES = [
  {
    id: "mahomes",
    name: "Patrick Mahomes",
    team: "Chiefs",
    stat: "4,183 YDS | 33 TD",
    votes: 2847,
    initials: "PM",
  },
  {
    id: "jackson",
    name: "Lamar Jackson",
    team: "Ravens",
    stat: "3,847 YDS | 28 TD",
    votes: 2356,
    initials: "LJ",
  },
  {
    id: "allen",
    name: "Josh Allen",
    team: "Bills",
    stat: "4,306 YDS | 29 TD",
    votes: 2104,
    initials: "JA",
  },
  {
    id: "hurts",
    name: "Jalen Hurts",
    team: "Eagles",
    stat: "2,903 YDS | 18 TD",
    votes: 1832,
    initials: "JH",
  },
];

// Prediction teams
const PREDICTION = {
  away: { name: "Chiefs", color: "#d4af37" },
  home: { name: "Ravens", color: "#c8102e" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Gamification() {
  const { toast } = useToast();
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(MVP_CANDIDATES.map((c) => [c.id, c.votes]))
  );
  const [voted, setVoted] = useState<string | null>(null);
  const [awayScore, setAwayScore] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [predicted, setPredicted] = useState(false);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (id: string) => {
    if (voted) return;
    setVotes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    setVoted(id);
    toast({
      title: "Голос принят!",
      description: `Вы проголосовали за ${MVP_CANDIDATES.find((c) => c.id === id)?.name}.`,
      className: "border-gold/30",
    });
  };

  const handlePredict = () => {
    if (!awayScore || !homeScore) return;
    setPredicted(true);
    toast({
      title: "Прогноз зафиксирован!",
      description: `${PREDICTION.away.name} ${awayScore} - ${homeScore} ${PREDICTION.home.name}`,
      className: "border-gold/30",
    });
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
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
            УЧАСТВУЙ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ВАШ <span className="text-gradient-gold">ВЫБОР</span>
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* MVP Vote */}
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                MVP НЕДЕЛИ
              </h3>
            </div>

            <div className="space-y-3">
              {MVP_CANDIDATES.map((candidate) => {
                const pct = (votes[candidate.id] / totalVotes) * 100;
                const isVoted = voted === candidate.id;

                return (
                  <button
                    key={candidate.id}
                    onClick={() => handleVote(candidate.id)}
                    disabled={!!voted}
                    className={`w-full text-left rounded-lg p-3 transition-all duration-300 ${
                      isVoted
                        ? "border border-gold/40 bg-gold/5"
                        : "border border-border dark:border-white/5 bg-muted dark:bg-white/[0.02] hover:border-gold/20 hover:bg-muted/80 dark:hover:bg-white/[0.04]"
                    } ${voted && !isVoted ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-border dark:border-white/10">
                        <AvatarFallback className="bg-foreground/5 dark:bg-white/5 text-xs font-bold text-muted-foreground">
                          {candidate.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {candidate.name}
                          </span>
                          <span className="text-[10px] font-bold text-gold tabular-nums ml-2">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {candidate.team} · {candidate.stat}
                        </p>
                        {/* Vote bar */}
                        <div className="mt-1.5 h-1.5 rounded-full bg-foreground/5 dark:bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isVoted ? "bg-gold" : "bg-foreground/20 dark:bg-white/20"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {voted && (
              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                {totalVotes.toLocaleString()} всего голосов · Ваш голос зафиксирован
              </p>
            )}
          </motion.div>

          {/* Prediction Widget */}
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                ПРОГНОЗ НА СЛЕДУЮЩУЮ ИГРУ
              </h3>
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-muted-foreground mb-4">
                Предпросмотр чемпионата AFC
              </p>

              {/* Teams */}
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {/* Away */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-lg border-2"
                    style={{
                      borderColor: PREDICTION.away.color,
                      backgroundColor: `${PREDICTION.away.color}15`,
                      color: PREDICTION.away.color,
                    }}
                  >
                    KC
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {PREDICTION.away.name}
                  </span>
                  {predicted ? (
                    <span className="text-xl font-black text-gold">{awayScore}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      max="99"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      placeholder="0"
                      className="w-16 text-center bg-muted border-border dark:bg-white/5 dark:border-white/10 h-10 text-foreground text-lg font-bold focus:border-gold/40"
                    />
                  )}
                </div>

                {/* VS */}
                <div className="text-muted-foreground text-xs font-bold tracking-wider">
                  VS
                </div>

                {/* Home */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-lg border-2"
                    style={{
                      borderColor: PREDICTION.home.color,
                      backgroundColor: `${PREDICTION.home.color}15`,
                      color: PREDICTION.home.color,
                    }}
                  >
                    BAL
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {PREDICTION.home.name}
                  </span>
                  {predicted ? (
                    <span className="text-xl font-black text-gold">{homeScore}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      max="99"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      placeholder="0"
                      className="w-16 text-center bg-muted border-border dark:bg-white/5 dark:border-white/10 h-10 text-foreground text-lg font-bold focus:border-gold/40"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="border-border dark:border-white/10 text-muted-foreground text-[10px]"
              >
                Вс, 26 янв · 18:40 ET
              </Badge>
              <Badge
                variant="outline"
                className="border-border dark:border-white/10 text-muted-foreground text-[10px]"
              >
                Arrowhead Stadium
              </Badge>
            </div>

            {!predicted ? (
              <Button
                onClick={handlePredict}
                disabled={!awayScore || !homeScore}
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wider text-xs"
              >
                ЗАФИКСИРОВАТЬ ПРОГНОЗ
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="text-center p-4 rounded-lg border border-gold/20 bg-gold/5">
                <p className="text-sm font-bold text-gold">Прогноз зафиксирован!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Результаты будут раскрыты после игры
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

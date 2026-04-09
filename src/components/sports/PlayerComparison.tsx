"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const PLAYERS = {
  mahomes: {
    name: "Patrick Mahomes",
    team: "Kansas City Chiefs",
    number: "#15",
    image: "/images/player-nfl.png",
    color: "#d4af37",
  },
  allen: {
    name: "Josh Allen",
    team: "Buffalo Bills",
    number: "#17",
    image: "",
    color: "#c8102e",
  },
};

const COMPARISON_STATS = [
  { label: "Ярдов передач", mahomes: 4183, allen: 4306, max: 5000 },
  { label: "Тачдаунов", mahomes: 33, allen: 29, max: 45 },
  { label: "% Точности передач", mahomes: 67.2, allen: 65.8, max: 80 },
  { label: "QBR", mahomes: 98.5, allen: 92.2, max: 120 },
  { label: "Ярдов на выносе", mahomes: 368, allen: 524, max: 700 },
  { label: "Тачдаунов на выносе", mahomes: 4, allen: 7, max: 12 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function PlayerComparison() {
  return (
    <section id="comparison" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">
            Противостояние
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ЛИЦОМ <span className="text-gradient-gold">К</span> ЛИЦУ
          </h2>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Player Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-xl p-6 sm:p-8"
        >
          {/* Player Header */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-10">
            {/* Player 1 */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gold/30 rounded-full">
                <AvatarImage src={PLAYERS.mahomes.image} alt={PLAYERS.mahomes.name} />
                <AvatarFallback className="bg-gold/10 text-gold font-bold text-lg">
                  PM
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                  {PLAYERS.mahomes.number}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {PLAYERS.mahomes.name}
                </h3>
                <p className="text-xs text-muted-foreground">{PLAYERS.mahomes.team}</p>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5">
                <span className="text-lg sm:text-xl font-black text-gradient-gold">
                  VS
                </span>
              </div>
            </div>

            {/* Player 2 */}
            <div className="flex items-center gap-4 flex-row-reverse text-right">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-red-500/30 rounded-full">
                <AvatarFallback className="bg-red-500/10 text-red-400 font-bold text-lg">
                  JA
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase">
                  {PLAYERS.allen.number}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {PLAYERS.allen.name}
                </h3>
                <p className="text-xs text-muted-foreground">{PLAYERS.allen.team}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5 mb-8" />

          {/* Stats Comparison */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-5"
          >
            {COMPARISON_STATS.map((stat) => {
              const mahoPct = (stat.mahomes / stat.max) * 100;
              const allenPct = (stat.allen / stat.max) * 100;
              const mahoWins = stat.mahomes >= stat.allen;

              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        mahoWins ? "text-gold" : "text-muted-foreground"
                      }`}
                    >
                      {stat.label === "% Точности передач"
                        ? `${stat.mahomes}%`
                        : stat.label === "QBR"
                          ? stat.mahomes.toFixed(1)
                          : stat.mahomes.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                      {stat.label}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        !mahoWins ? "text-red-400" : "text-muted-foreground"
                      }`}
                    >
                      {stat.label === "% Точности передач"
                        ? `${stat.allen}%`
                        : stat.label === "QBR"
                          ? stat.allen.toFixed(1)
                          : stat.allen.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Mahomes bar (fills from left) */}
                    <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${mahoPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          mahoWins ? "bg-gold" : "bg-white/20"
                        }`}
                      />
                    </div>
                    {/* Allen bar (fills from right) */}
                    <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${allenPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`absolute right-0 top-0 h-full rounded-full ${
                          !mahoWins ? "bg-red-500" : "bg-white/20"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="text-center">
              <span className="text-2xl font-black text-gold">
                {COMPARISON_STATS.filter((s) => s.mahomes >= s.allen).length}
              </span>
              <p className="text-[10px] tracking-wider text-muted-foreground uppercase mt-1">
                Mahomes
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Категорий выиграно
            </div>
            <div className="text-center">
              <span className="text-2xl font-black text-red-400">
                {COMPARISON_STATS.filter((s) => s.allen > s.mahomes).length}
              </span>
              <p className="text-[10px] tracking-wider text-muted-foreground uppercase mt-1">
                Allen
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

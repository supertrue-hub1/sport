"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Star,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: 1,
    title: "Соберите свою команду",
    description: "Выберите команду мечты из всех 32 составов NFL. Змейкой, аукционом или best ball — выбирайте свой формат.",
    icon: Users,
    tip: "Ценность важнее имени. Тёмные лошадки выигрывают чемпионаты.",
  },
  {
    step: 2,
    title: "Выставьте состав",
    description: "Каждую неделю выбирайте стартовый состав из QB, RB, WR, TE, K и DEF. Следите за матчапами и травмами как профи.",
    icon: Trophy,
    tip: "Проверяйте отчёты о тренировках в среду. Всегда.",
  },
  {
    step: 3,
    title: "Наблюдайте и доминируйте",
    description: "Отслеживайте счёт в реальном времени, совершайте обмены на драфте отказов и торгуйте на пути к вершине таблицы. Каждый розыгрыш на счету.",
    icon: TrendingUp,
    tip: "Не выбрасывайте приоритет на драфте отказов слишком рано.",
  },
  {
    step: 4,
    title: "Выиграйте чемпионат",
    description: "Пройдите плей-офф, переживите цепочку недель отдыха и поднимите виртуальный трофей Ломбарди. Бессмертие ждёт.",
    icon: Zap,
    tip: "Пик формы в декабре, а не в сентябре.",
  },
];

const PRO_TIPS = [
  "Стратегия Zero-RB мертва. Балансированные драфты выигрывают.",
  "Стриминг защит — новая мета — играйте на матчапах.",
  "Не переплачивайте за preseason хайп. Дайте рынку остыть.",
  "Берите дубликаторов для ваших звездных RB. Страховка от травм бесценна.",
  "Целитесь в игроков в контрактные годы. Мотивация имеет значение.",
];

export function FantasyQuickStart() {
  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<Set<number>>(new Set());
  const step = STEPS[activeStep];
  const StepIcon = step.icon;

  const dismissTip = (index: number) => {
    setDismissedTips((prev) => new Set([...prev, index]));
  };

  return (
    <section id="fantasy" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] via-transparent to-purple-500/[0.01]" />
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
            Плейбук
            <Star className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ФЭНТЕЗИ <span className="text-gradient-gold">ФУТБОЛ 101</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            От драфта до финала чемпионата. Ваш путеводитель
            по завоеванию лиги фэнтези в этом сезоне.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Step card - main */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl overflow-hidden">
              {/* Step progress bar */}
              <div className="h-1 bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold to-gold/60"
                  animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step number + icon */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <StepIcon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
                          Шаг {step.step} из {STEPS.length}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Pro tip */}
                    <div className="mt-5 flex items-start gap-2.5 p-3 rounded-lg bg-gold/[0.04] border border-gold/10">
                      <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gold/80 leading-relaxed">
                        <span className="font-bold">Совет профи:</span> {step.tip}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    Назад
                  </Button>
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === activeStep ? "bg-gold scale-125" : i < activeStep ? "bg-gold/30" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  {activeStep < STEPS.length - 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveStep((prev) => prev + 1)}
                      className="text-gold hover:text-gold/80"
                    >
                      Далее <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gold text-black font-bold hover:bg-gold/90 text-xs"
                    >
                      <Trophy className="w-3 h-3 mr-1.5" />
                      Начать игру
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Tips & Quick Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick stats */}
            <div className="glass-card rounded-xl p-5">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Фэнтези в цифрах
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Активных игроков", value: "62M+", color: "text-gold" },
                  { label: "Средний призовой фонд", value: "$150", color: "text-emerald-400" },
                  { label: "Сезонов сыграно", value: "60+", color: "text-orange-400" },
                  { label: "Средний размер лиги", value: "12", color: "text-cyan-400" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className={`text-lg sm:text-xl font-black ${stat.color} stat-glow`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro tips toggle */}
            <div className="glass-card rounded-xl p-5">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between"
              >
                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Советы изнутри
                </h4>
                <motion.div
                  animate={{ rotate: showTips ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground rotate-90" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2">
                      {PRO_TIPS.filter((_, i) => !dismissedTips.has(i)).map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 group"
                        >
                          <Lock className="w-3 h-3 text-gold/40 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">
                            {tip}
                          </p>
                          <button
                            onClick={() => dismissTip(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400/60" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Small icon component for the pro tip
function Lightbulb({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

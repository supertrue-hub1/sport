"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const increment = end / (duration * 60); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const STATS = [
    { value: 2847, label: "Матчей освещено", suffix: "+", icon: "🏈" },
    { value: 156, label: "Эксперт-аналитиков", suffix: "", icon: "📊" },
    { value: 42, label: "Млн читателей", suffix: "M+", icon: "👁" },
    { value: 99, label: "Точность прогнозов", suffix: "%", icon: "🎯" },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] via-transparent to-gold/[0.03]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient-gold stat-glow">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <div className="mt-2 text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground/70 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

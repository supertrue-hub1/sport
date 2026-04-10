"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const QUOTES = [
  {
    text: "Champions aren't made in gyms. Champions are made from something they have deep inside them — a desire, a dream, a vision.",
    author: "Muhammad Ali",
    context: "Величайший",
  },
  {
    text: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game-winning shot and missed. I've failed over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
    context: "Включение в Зал славы, 2009"
  },
  {
    text: "It's not whether you get knocked down; it's whether you get up.",
    author: "Vince Lombardi",
    context: "Легендарный тренер Packers"
  },
];

export function CinematicQuote({ variant = 0 }: { variant?: number }) {
  const quote = QUOTES[variant % QUOTES.length];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Quote icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5">
              <Quote className="w-5 h-5 text-gold/60" />
            </div>
          </div>

          {/* Quote text */}
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-foreground/90 leading-relaxed sm:leading-relaxed tracking-tight italic">
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="mt-8 flex flex-col items-center gap-1.5">
            <div className="w-8 h-px bg-gold/40" />
            <span className="text-sm sm:text-base font-bold text-foreground">
              {quote.author}
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gold/70">
              {quote.context}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

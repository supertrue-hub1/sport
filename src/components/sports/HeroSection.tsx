"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_SLIDES = [
  {
    image: "/images/hero-nfl.png",
    sport: "NFL",
    title: "ГДЕ РОЖДАЮТСЯ",
    subtitle: "ЛЕГЕНДЫ",
    description:
      "От игры на поле до бессмертия — станьте свидетелем моментов, определяющих поколения чемпионов.",
  },
  {
    image: "/images/hero-nba.png",
    sport: "NBA",
    title: "ПАРКЕТ —",
    subtitle: "ЭТО КОРОЛЕВСТВО",
    description:
      "Каждое владение — это история. Каждый данк звучит эхом в веках.",
  },
  {
    image: "/images/hero-mlb.png",
    sport: "MLB",
    title: "АМЕРИКАНСКАЯ",
    subtitle: "НАЦИОНАЛЬНАЯ ИГРА ВОЗРОЖДЕНА",
    description:
      "Там, где традиции встречаются с аналитикой — бейсбольное поле никогда не выглядело столь великолепно.",
  },
  {
    image: "/images/hero-nhl.png",
    sport: "NHL",
    title: "ЛЕДЯНОЙ",
    subtitle: "ОГНЕННЫЙ",
    description:
      "Скорость, мощь, точность — самая быстрая игра на планете требует вашего внимания.",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
      setIsTransitioning(false);
    }, 600);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 cinematic-overlay" />

      {/* Gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Sport Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.3em] text-gold border border-gold/30 rounded-full uppercase bg-black/30 backdrop-blur-sm">
            {slide.sport}
          </span>
        </motion.div>

        {/* Headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9]">
              <span className="text-foreground">{slide.title}</span>
              <br />
              <span className="text-gradient-gold">{slide.subtitle}</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Button
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold tracking-wide px-8 py-6 text-sm rounded-none gold-glow"
          >
            ИССЛЕДОВАТЬ
          </Button>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-8">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrent(i);
                  setIsTransitioning(false);
                }, 600);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}

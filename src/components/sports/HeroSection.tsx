"use client";

import { Clock } from "lucide-react";

const HERO_NEWS = {
  category: "NHL",
  title: "Panthers vs Hurricanes: анализ ключевого матча финала Восточной конференции",
  time: "12 минут назад",
  image: "/images/hero-nhl.png",
};

export function HeroSection() {
  return (
    <section className="mt-8">
      {/* Hero Image */}
      <div className="relative aspect-video md:aspect-[16/9] rounded-lg overflow-hidden">
        <img 
          src={HERO_NEWS.image} 
          alt={HERO_NEWS.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 text-xs font-inter font-semibold text-white bg-red-600 rounded-md">
            {HERO_NEWS.category}
          </span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="mt-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-gray-900 leading-tight">
          {HERO_NEWS.title}
        </h1>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-sm font-inter text-gray-500">
            <Clock className="w-4 h-4" />
            {HERO_NEWS.time}
          </span>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-sm font-inter font-medium text-red-600 hover:text-red-700"
          >
            Аналитика
          </a>
        </div>
      </div>
    </section>
  );
}

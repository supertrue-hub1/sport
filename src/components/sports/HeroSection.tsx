"use client";

import { Badge } from "@/components/ui/badge";

const HERO_ARTICLE = {
  category: "NBA",
  title: "Лейкерсы одерживают волевую победу над Уорриорз в овертайме",
  subtitle:
    "Леброн Джеймс набрал 38 очков и сделал 11 передач в решающем матче Западной конференции",
  image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1600&q=80",
  time: "2 часа назад",
  author: "Майкл Чен",
};

export function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={HERO_ARTICLE.image}
          alt={HERO_ARTICLE.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex items-end pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-2xl">
          <Badge
            variant="secondary"
            className="mb-4 bg-gold text-black font-inter font-bold px-3 py-1 text-xs uppercase tracking-wide"
          >
            {HERO_ARTICLE.category}
          </Badge>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold text-white leading-tight mb-3">
            {HERO_ARTICLE.title}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-4 max-w-xl">
            {HERO_ARTICLE.subtitle}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{HERO_ARTICLE.author}</span>
            <span>•</span>
            <span>{HERO_ARTICLE.time}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_ARTICLES = [
  {
    category: "NBA",
    title: "Лейкерсы одерживают волевую победу над Уорриорз в овертайме",
    subtitle: "Леброн Джеймс набрал 38 очков и сделал 11 передач в решающем матче Западной конференции",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1600&q=80",
    time: "2 часа назад",
    author: "Майкл Чен",
  },
  {
    category: "NFL",
    title: "Чифс выходят в финал конференции после победного матча",
    subtitle: "Пэт Макоминс показал невероятную игру с 4 тачдаунами в четвертой четверти",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1600&q=80",
    time: "3 часа назад",
    author: "Джеймс Родригес",
  },
  {
    category: "NHL",
    title: "Овечкин приближается к новому рекорду НХЛ",
    subtitle: "Российский нападающий забросил 873-ю шайбу в карьере в матче против Рейнджерс",
    image: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=1600&q=80",
    time: "4 часа назад",
    author: "Алексей Иванов",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_ARTICLES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_ARTICLES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_ARTICLES.length) % HERO_ARTICLES.length);

  const article = HERO_ARTICLES[currentIndex];

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-opacity duration-500"
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
            {article.category}
          </Badge>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold text-white leading-tight mb-3">
            {article.title}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-4 max-w-xl">
            {article.subtitle}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.time}</span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {HERO_ARTICLES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-gold w-6" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

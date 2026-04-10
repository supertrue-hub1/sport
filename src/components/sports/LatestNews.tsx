"use client";

import { Clock, ArrowUpRight } from "lucide-react";

const NEWS_ITEMS = [
  {
    id: "1",
    category: "NFL",
    image: "/images/hero-nfl.png",
    title: "Обмены, которые могут перевернуть драфт NFL 2025",
    time: "2ч назад",
  },
  {
    id: "2",
    category: "NBA",
    image: "/images/hero-nba.png",
    title: "Борьба за MVP теснее, чем когда-либо — вот почему",
    time: "4ч назад",
  },
  {
    id: "3",
    category: "Трансферы",
    image: "/images/studio-bg.png",
    title: "Несколько команд интересуются звёздным реливером",
    time: "5ч назад",
  },
  {
    id: "4",
    category: "NHL",
    image: "/images/hero-nhl.png",
    title: "McDavid достигает отметки в 100 очков 9-й сезон подряд",
    time: "7ч назад",
  },
  {
    id: "5",
    category: "Фэнтези",
    image: "/images/studio-bg.png",
    title: "Жемчужины драфта отказов: подписание 17-й недели",
    time: "9ч назад",
  },
  {
    id: "6",
    category: "MLB",
    image: "/images/hero-mlb.png",
    title: "Звёзды весенних тренировок: пять новичков для сезона-2025",
    time: "12ч назад",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  NFL: "bg-red-600",
  NBA: "bg-orange-500",
  MLB: "bg-emerald-600",
  NHL: "bg-cyan-600",
  Фэнтези: "bg-purple-600",
  Трансферы: "bg-amber-500",
};

export function LatestNews() {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-lg font-inter font-semibold text-gray-500 uppercase tracking-wide">
          Последние новости
        </h2>
      </div>

      {/* News Grid - 2 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {NEWS_ITEMS.map((item) => (
          <article 
            key={item.id} 
            className="group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 text-[10px] font-inter font-semibold text-white rounded ${CATEGORY_COLORS[item.category] || 'bg-gray-600'}`}>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-base font-source-serif font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
              {item.title}
            </h3>

            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1.5 text-xs font-inter text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {item.time}
              </span>
              <span className="flex items-center gap-1 text-xs font-inter font-medium text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Читать
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

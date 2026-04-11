"use client";

import { Badge } from "@/components/ui/badge";

const NEWS_ARTICLES = [
  {
    id: 1,
    category: "NHL",
    title: "Овечкин выходит на 3-е место в истории НХЛ по заброшенным шайбам",
    image: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80",
    time: "3 часа назад",
    featured: true,
  },
  {
    id: 2,
    category: "NFL",
    title: "Чифс одерживают победу в овертайме в матче против Биллз",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80",
    time: "4 часа назад",
  },
  {
    id: 3,
    category: "MLB",
    title: "Янкиз подписывают контракт с японской звездой",
    image: "https://images.unsplash.com/photo-1508345228704-939cc18bf516?auto=format&fit=crop&w=800&q=80",
    time: "5 часов назад",
  },
  {
    id: 4,
    category: "NBA",
    title: "Солс берут реванш у Никс в домашнем матче",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ad0?auto=format&fit=crop&w=800&q=80",
    time: "6 часов назад",
  },
  {
    id: 5,
    category: "KHL",
    title: "Авангард побеждает ЦСКА в матче открытия сезона",
    image: "https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80",
    time: "7 часов назад",
  },
];

export function LatestNews() {
  const featured = NEWS_ARTICLES.find((a) => a.featured);
  const rest = NEWS_ARTICLES.filter((a) => !a.featured);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-black">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white">
            Последние новости
          </h2>
          <a
            href="#"
            className="text-sm font-inter text-gold hover:text-gold/80 transition-colors"
          >
            Смотреть все →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Article */}
          {featured && (
            <article className="group relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge
                  variant="secondary"
                  className="mb-3 bg-gold text-black font-inter font-bold px-3 py-1 text-xs uppercase tracking-wide"
                >
                  {featured.category}
                </Badge>
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-2 group-hover:text-gold transition-colors">
                  {featured.title}
                </h3>
                <p className="text-xs text-gray-400">{featured.time}</p>
              </div>
            </article>
          )}

          {/* Other Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.slice(0, 4).map((article) => (
              <article
                key={article.id}
                className="group relative h-[200px] rounded-lg overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge
                    variant="secondary"
                    className="mb-2 bg-gold text-black font-inter font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide"
                  >
                    {article.category}
                  </Badge>
                  <h4 className="text-sm font-playfair font-semibold text-white mb-1 line-clamp-2 group-hover:text-gold transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-gray-400">{article.time}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

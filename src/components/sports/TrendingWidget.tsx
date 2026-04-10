"use client";

const TRENDING = [
  { rank: 1, topic: "#Ovechkin", posts: "125K" },
  { rank: 2, topic: "#LakersVsWarriors", posts: "89K" },
  { rank: 3, topic: "#SuperBowl", posts: "76K" },
  { rank: 4, topic: "#NHLPlayoffs", posts: "54K" },
  { rank: 5, topic: "#LeBron", posts: "48K" },
];

export function TrendingWidget() {
  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-playfair font-bold text-white">
          Популярное
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {TRENDING.map((item) => (
          <a
            key={item.rank}
            href="#"
            className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors group"
          >
            <span className="text-xs font-inter font-medium text-gray-500 w-4">
              {item.rank}
            </span>
            <div className="flex-1">
              <p className="text-sm font-inter font-semibold text-gray-200 group-hover:text-gold transition-colors">
                {item.topic}
              </p>
              <p className="text-[10px] font-inter text-gray-500">
                {item.posts} постов
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="p-3 border-t border-white/10">
        <a
          href="#"
          className="text-xs font-inter text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-1"
        >
          Все тренды →
        </a>
      </div>
    </div>
  );
}
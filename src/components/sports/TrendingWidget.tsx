"use client";

const trendingTopics = [
  { tag: "#Playoffs2024", posts: 234 },
  { tag: "#TradeDeadline", posts: 189 },
  { tag: "#RookieWatch", posts: 156 },
  { tag: "#StanleyCup", posts: 142 },
  { tag: "#SuperBowl", posts: 128 },
  { tag: "#NBAFinals", posts: 98 },
];

export function TrendingWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
        Trending
      </h3>
      <ul className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <li key={index}>
            <a 
              href="#" 
              className="group flex items-center justify-between hover:bg-gray-50 rounded-md p-2 -mx-2 transition-colors"
            >
              <span className="font-source-serif font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {topic.tag}
              </span>
              <span className="font-inter text-xs text-gray-400">
                {topic.posts} постов
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
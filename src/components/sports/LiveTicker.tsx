"use client";

const LIVE_GAMES = [
  { home: "LAL", away: "GSW", homeScore: 118, awayScore: 112, status: "Q4 2:31", sport: "NBA" },
  { home: "EDM", away: "CGY", homeScore: 3, awayScore: 2, status: "OT", sport: "NHL" },
  { home: "BUF", away: "TOR", homeScore: 2, awayScore: 1, status: "2nd", sport: "NHL" },
  { home: "KC", away: "BAL", homeScore: 24, awayScore: 21, status: "Q4", sport: "NFL" },
  { home: "NYY", away: "LAD", homeScore: 5, awayScore: 3, status: "7th", sport: "MLB" },
];

export function LiveTicker() {
  const doubled = [...LIVE_GAMES, ...LIVE_GAMES];

  return (
    <section className="bg-black/50 backdrop-blur-sm border-b border-white/10 overflow-hidden">
      <div className="flex items-center max-w-[1400px] mx-auto">
        {/* LIVE Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-2.5 border-r border-white/10 bg-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="text-xs font-inter font-bold tracking-wider text-gold uppercase">
            Live
          </span>
        </div>

        {/* Ticker */}
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="ticker-animate flex whitespace-nowrap">
            {doubled.map((game, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 px-5"
              >
                <span className="text-xs font-inter font-semibold text-gray-500 uppercase tracking-wide">
                  {game.sport}
                </span>
                <span className="text-sm font-inter font-semibold text-gray-300">
                  {game.away}
                </span>
                <span className="text-sm font-inter font-bold text-gold">
                  {game.awayScore}
                </span>
                <span className="text-gray-600">-</span>
                <span className="text-sm font-inter font-bold text-gold">
                  {game.homeScore}
                </span>
                <span className="text-sm font-inter font-semibold text-gray-300">
                  {game.home}
                </span>
                <span className="text-xs font-inter font-medium text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                  {game.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

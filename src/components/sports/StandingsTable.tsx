"use client";

const STANDINGS_DATA = [
  { rank: 1, team: "Florida", name: "Panthers", gp: 82, w: 52, l: 20, pts: 124 },
  { rank: 2, team: "Toronto", name: "Maple Leafs", gp: 82, w: 48, l: 24, pts: 112 },
  { rank: 3, team: "Boston", name: "Bruins", gp: 82, w: 47, l: 25, pts: 109 },
  { rank: 4, team: "Raleigh", name: "Hurricanes", gp: 82, w: 46, l: 26, pts: 106 },
  { rank: 5, team: "NY Rangers", name: "Rangers", gp: 82, w: 44, l: 27, pts: 102 },
  { rank: 6, team: "New Jersey", name: "Devils", gp: 82, w: 42, l: 30, pts: 98 },
];

export function StandingsTable() {
  return (
    <section>
      <h3 className="font-inter font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
        Eastern Conference
      </h3>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-[10px] font-inter font-semibold text-gray-500 uppercase">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Команда</div>
          <div className="col-span-2 text-center">И</div>
          <div className="col-span-2 text-center">В</div>
          <div className="col-span-2 text-center">О</div>
        </div>

        {/* Rows */}
        {STANDINGS_DATA.map((team) => (
          <div 
            key={team.team}
            className="grid grid-cols-12 gap-2 px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
          >
            <div className="col-span-1 font-inter font-semibold text-gray-900">
              {team.rank}
            </div>
            <div className="col-span-5 flex items-center gap-2">
              <span className="font-inter font-semibold text-gray-700">
                {team.team}
              </span>
              <span className="font-inter text-xs text-gray-400">
                {team.name}
              </span>
            </div>
            <div className="col-span-2 text-center font-inter text-gray-500">
              {team.gp}
            </div>
            <div className="col-span-2 text-center font-inter font-semibold text-gray-900">
              {team.w}
            </div>
            <div className="col-span-2 text-center font-inter font-bold text-red-600">
              {team.pts}
            </div>
          </div>
        ))}
      </div>

      {/* Link to full standings */}
      <a 
        href="#" 
        className="block mt-3 text-xs font-inter font-medium text-red-600 hover:text-red-700 text-right"
      >
        Все таблицы →
      </a>
    </section>
  );
}

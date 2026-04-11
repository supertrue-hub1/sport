"use client";

const STANDINGS = [
  { rank: 1, team: "Айлендерс", gp: 45, w: 28, l: 12, ot: 5, pts: 61, gf: 142, ga: 118 },
  { rank: 2, team: "Рейнджерс", gp: 44, w: 26, l: 13, ot: 5, pts: 57, gf: 135, ga: 122 },
  { rank: 3, team: "Девилз", gp: 45, w: 25, l: 15, ot: 5, pts: 55, gf: 130, ga: 125 },
  { rank: 4, team: "Флайерз", gp: 44, w: 23, l: 16, ot: 5, pts: 51, gf: 125, ga: 128 },
  { rank: 5, team: "Пенс", gp: 45, w: 22, l: 17, ot: 6, pts: 50, gf: 120, ga: 130 },
  { rank: 6, team: "Сейбрз", gp: 44, w: 20, l: 19, ot: 5, pts: 45, gf: 115, ga: 135 },
  { rank: 7, team: "Айле", gp: 45, w: 18, l: 22, ot: 5, pts: 41, gf: 110, ga: 140 },
  { rank: 8, team: "Коламбус", gp: 44, w: 16, l: 24, ot: 4, pts: 36, gf: 105, ga: 145 },
];

export function StandingsTable() {
  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-playfair font-bold text-white">
          Восточная конференция
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr className="text-gray-400">
              <th className="px-3 py-2 text-left font-inter font-semibold">#</th>
              <th className="px-3 py-2 text-left font-inter font-semibold">Команда</th>
              <th className="px-3 py-2 text-center font-inter font-semibold">И</th>
              <th className="px-3 py-2 text-center font-inter font-semibold">О</th>
              <th className="px-3 py-2 text-center font-inter font-semibold hidden sm:table-cell">В</th>
              <th className="px-3 py-2 text-center font-inter font-semibold hidden sm:table-cell">П</th>
            </tr>
          </thead>
          <tbody>
            {STANDINGS.map((row, i) => (
              <tr
                key={row.rank}
                className={`border-t border-white/5 hover:bg-white/5 transition-colors ${
                  i < 4 ? "text-gold" : "text-gray-300"
                }`}
              >
                <td className="px-3 py-2 font-inter font-medium">{row.rank}</td>
                <td className="px-3 py-2 font-inter font-semibold">{row.team}</td>
                <td className="px-3 py-2 text-center font-inter">{row.gp}</td>
                <td className="px-3 py-2 text-center font-inter font-bold">{row.pts}</td>
                <td className="px-3 py-2 text-center font-inter hidden sm:table-cell">
                  {row.w}
                </td>
                <td className="px-3 py-2 text-center font-inter hidden sm:table-cell">
                  {row.l}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-white/10">
        <a
          href="#"
          className="text-xs font-inter text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-1"
        >
          Полная таблица →
        </a>
      </div>
    </div>
  );
}

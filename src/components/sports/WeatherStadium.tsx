"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Umbrella,
  MapPin,
} from "lucide-react";

interface StadiumWeather {
  stadium: string;
  city: string;
  team: string;
  teamCode: string;
  temp: number;
  condition: "Ясно" | "Облачно" | "Дождь" | "Ветрено" | "Снег";
  icon: string;
  wind: string;
  humidity: number;
  precip: number;
}

const STADIUM_WEATHER: StadiumWeather[] = [
  {
    stadium: "Arrowhead Stadium",
    city: "Kansas City",
    team: "Chiefs",
    teamCode: "KC",
    temp: 72,
    condition: "Ясно",
    icon: "\u2600\uFE0F",
    wind: "ЮЗ 8 миль/ч",
    humidity: 34,
    precip: 5,
  },
  {
    stadium: "Highmark Stadium",
    city: "Buffalo",
    team: "Bills",
    teamCode: "BUF",
    temp: 28,
    condition: "Снег",
    icon: "\u2744\uFE0F",
    wind: "СЗ 22 миль/ч",
    humidity: 78,
    precip: 85,
  },
  {
    stadium: "Lambeau Field",
    city: "Green Bay",
    team: "Packers",
    teamCode: "GB",
    temp: 41,
    condition: "Ветрено",
    icon: "\uD83C\uDF2C\uFE0F",
    wind: "З 30 миль/ч",
    humidity: 55,
    precip: 20,
  },
  {
    stadium: "MetLife Stadium",
    city: "New York",
    team: "Jets",
    teamCode: "NYJ",
    temp: 52,
    condition: "Дождь",
    icon: "\uD83C\uDF27\uFE0F",
    wind: "В 14 миль/ч",
    humidity: 82,
    precip: 75,
  },
  {
    stadium: "Lucas Oil Stadium",
    city: "Indianapolis",
    team: "Colts",
    teamCode: "IND",
    temp: 58,
    condition: "Облачно",
    icon: "\u26C5",
    wind: "ЮВ 10 миль/ч",
    humidity: 63,
    precip: 30,
  },
];

const BORDER_COLORS: Record<StadiumWeather["condition"], string> = {
  "Ясно": "border-t-amber-400",
  "Облачно": "border-t-slate-400",
  "Дождь": "border-t-blue-400",
  "Ветрено": "border-t-amber-300",
  "Снег": "border-t-cyan-400",
};

const CONDITION_GLOW: Record<StadiumWeather["condition"], string> = {
  "Ясно": "shadow-[0_0_30px_rgba(251,191,36,0.08)]",
  "Облачно": "shadow-[0_0_30px_rgba(148,163,184,0.06)]",
  "Дождь": "shadow-[0_0_30px_rgba(96,165,250,0.08)]",
  "Ветрено": "shadow-[0_0_30px_rgba(252,211,77,0.06)]",
  "Снег": "shadow-[0_0_30px_rgba(34,211,238,0.08)]",
};

const cVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const iVar = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

function getTempColor(temp: number): string {
  if (temp >= 70) return "text-amber-400";
  if (temp >= 50) return "text-emerald-400";
  if (temp >= 32) return "text-blue-400";
  return "text-cyan-400";
}

function getPrecipColor(precip: number): string {
  if (precip >= 60) return "text-blue-400";
  if (precip >= 30) return "text-yellow-400";
  return "text-emerald-400";
}

export function WeatherStadium() {
  return (
    <section id="stadium-weather" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.012] to-transparent" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.02] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/[0.015] blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase flex items-center gap-2">
            ПОГОДА
            <Cloud className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2">
            ПОГОДА НА <span className="text-gradient-gold">СТАДИОНАХ</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl">
            Погодные условия на стадионах NFL в день игр. Температура, ветер,
            влажность и вероятность осадков — всё, что влияет на ход матча.
          </p>
          <div className="w-16 h-1 bg-gold mt-4" />
        </motion.div>

        {/* Weather Cards Grid */}
        <motion.div
          variants={cVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {STADIUM_WEATHER.map((weather) => {
            const tempColor = getTempColor(weather.temp);
            const precipColor = getPrecipColor(weather.precip);

            return (
              <motion.div
                key={weather.teamCode}
                variants={iVar}
                className={`glass-card-interactive rounded-xl overflow-hidden border-t-2 ${BORDER_COLORS[weather.condition]} ${CONDITION_GLOW[weather.condition]}`}
              >
                <div className="p-5">
                  {/* Top row: Team code + Stadium */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-muted-foreground">
                          {weather.teamCode}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {weather.city}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-foreground/70 leading-tight">
                        {weather.team}
                      </p>
                    </div>
                    <span className="text-3xl leading-none">{weather.icon}</span>
                  </div>

                  {/* Stadium name */}
                  <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/50 mb-4 truncate">
                    {weather.stadium}
                  </p>

                  {/* Temperature + Condition */}
                  <div className="flex items-end justify-between mb-5">
                    <div className="flex items-start gap-1.5">
                      <Thermometer className={`w-4 h-4 mt-0.5 ${tempColor}`} />
                      <div>
                        <span className={`text-3xl font-black tabular-nums leading-none ${tempColor}`}>
                          {weather.temp}°F
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground/80">
                      {weather.condition}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Wind */}
                    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <Wind className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        Ветер
                      </span>
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {weather.wind}
                      </span>
                    </div>

                    {/* Humidity */}
                    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <Droplets className="w-3.5 h-3.5 text-blue-400/70" />
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        Влажн.
                      </span>
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {weather.humidity}%
                      </span>
                    </div>

                    {/* Precipitation */}
                    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <Umbrella className={`w-3.5 h-3.5 ${precipColor}/70`} />
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        Осадки
                      </span>
                      <span className={`text-xs font-semibold tabular-nums ${precipColor}`}>
                        {weather.precip}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] text-muted-foreground/40 tracking-wider uppercase">
            Данные актуальны на момент публикации. Погодные условия могут измениться.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

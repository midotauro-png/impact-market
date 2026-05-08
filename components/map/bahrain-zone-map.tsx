"use client";

// Schematic SVG map of Bahrain showing named zones.
// Real polygon data is in lib/zones.ts; this component renders a
// clean administrative-style map perfect for the admin zone editor.

import { cn } from "@/lib/utils";

interface ZoneArea {
  id: string;
  name: string;
  // SVG path coordinates (normalised 0-600 width, 0-700 height)
  path: string;
  cx: number; // label centre X
  cy: number; // label centre Y
}

const AREAS: ZoneArea[] = [
  { id: "z-muharraq",  name: "Muharraq",       path: "M350,80 L440,80 L440,160 L350,160 Z",      cx: 395, cy: 120 },
  { id: "z-amwaj",     name: "Amwaj",           path: "M370,30 L440,30 L440,80 L370,80 Z",        cx: 405, cy: 55  },
  { id: "z-hidd",      name: "Hidd",            path: "M440,90 L500,90 L500,160 L440,160 Z",      cx: 470, cy: 125 },
  { id: "z-hoora",     name: "Hoora",           path: "M295,155 L365,155 L365,210 L295,210 Z",    cx: 330, cy: 183 },
  { id: "z-manama",    name: "Manama",          path: "M200,155 L295,155 L295,255 L200,255 Z",    cx: 247, cy: 205 },
  { id: "z-juffair",   name: "Juffair",         path: "M290,200 L370,200 L370,265 L290,265 Z",    cx: 330, cy: 233 },
  { id: "z-adliya",    name: "Adliya",          path: "M200,255 L300,255 L300,320 L200,320 Z",    cx: 250, cy: 287 },
  { id: "z-zinj",      name: "Zinj",            path: "M300,255 L375,255 L375,330 L300,330 Z",    cx: 337, cy: 292 },
  { id: "z-seef",      name: "Seef",            path: "M110,155 L200,155 L200,255 L110,255 Z",    cx: 155, cy: 205 },
  { id: "z-saar",      name: "Saar",            path: "M70,235 L150,235 L150,320 L70,320 Z",      cx: 110, cy: 277 },
  { id: "z-budaiya",   name: "Budaiya",         path: "M30,220 L110,220 L110,290 L30,290 Z",      cx: 70,  cy: 255 },
  { id: "z-isa-town",  name: "Isa Town",        path: "M140,310 L240,310 L240,400 L140,400 Z",    cx: 190, cy: 355 },
  { id: "z-aali",      name: "Aali",            path: "M240,310 L320,310 L320,400 L240,400 Z",    cx: 280, cy: 355 },
  { id: "z-hamad-town",name: "Hamad Town",      path: "M60,310 L145,310 L145,420 L60,420 Z",      cx: 102, cy: 365 },
  { id: "z-riffa",     name: "Riffa",           path: "M270,390 L420,390 L420,490 L270,490 Z",    cx: 345, cy: 440 },
];

interface BahrainZoneMapProps {
  activeZoneId?: string | null;
  onZoneClick?: (id: string) => void;
  className?: string;
  height?: number;
}

export default function BahrainZoneMap({
  activeZoneId,
  onZoneClick,
  className,
  height = 540,
}: BahrainZoneMapProps) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#EBF4FB]", className)}>
      <svg
        viewBox="0 0 540 560"
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        aria-label="Bahrain zone map"
      >
        {/* Sea background */}
        <rect x="0" y="0" width="540" height="560" fill="#C8E6F4" />

        {/* Island outline (Bahrain main island rough shape) */}
        <path
          d="M55,210 L55,420 Q90,530 180,540 Q290,550 380,500 Q440,480 460,420 L460,160 Q440,110 380,85 L350,75 L320,65 Q280,55 250,60 Q180,70 130,100 Q75,140 55,210 Z"
          fill="#F5F0E8"
          stroke="#d0c8b8"
          strokeWidth="1.5"
        />

        {/* Muharraq island */}
        <path
          d="M350,68 L445,68 L445,168 L440,175 L350,175 Z"
          fill="#F0EDE5"
          stroke="#d0c8b8"
          strokeWidth="1"
        />

        {/* Zone areas */}
        {AREAS.map((area) => {
          const isActive = area.id === activeZoneId;
          return (
            <g key={area.id} onClick={() => onZoneClick?.(area.id)} style={{ cursor: onZoneClick ? "pointer" : "default" }}>
              <path
                d={area.path}
                className={cn("zone-polygon", isActive && "active")}
                style={{
                  fill: isActive
                    ? "rgba(244,123,32,0.35)"
                    : "rgba(244,123,32,0.10)",
                  stroke: isActive ? "#d96010" : "#F47B20",
                  strokeWidth: isActive ? 2 : 1.5,
                  transition: "fill 0.2s",
                }}
              />
              <text
                x={area.cx}
                y={area.cy + 4}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight={isActive ? "800" : "600"}
                fill={isActive ? "#B34A0C" : "#334155"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {area.name}
              </text>
            </g>
          );
        })}

        {/* Water label */}
        <text x="490" y="300" fontSize="9" fill="#7DB5D0" fontWeight="500" textAnchor="middle" transform="rotate(-30, 490, 300)">
          Arabian Gulf
        </text>
      </svg>

      {/* Legend */}
      {activeZoneId && (
        <div className="absolute bottom-3 left-3 bg-white/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-soft border border-orange-100">
          📍 {AREAS.find((a) => a.id === activeZoneId)?.name ?? activeZoneId}
        </div>
      )}
    </div>
  );
}

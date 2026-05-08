"use client";
// Hook: detect customer zone using browser Geolocation API
// Falls back to Manama if denied or unavailable.

import { useState, useEffect } from "react";
import { detectZone, ZONES } from "./zones";
import type { Zone } from "./types";

const FALLBACK_ZONE_ID = "z-manama";

interface ZoneState {
  zone: Zone | null;
  zoneId: string;
  loading: boolean;
  error: string | null;
  coords: { lat: number; lng: number } | null;
}

export function useZoneDetect(): ZoneState & { detect: () => void } {
  const [state, setState] = useState<ZoneState>({
    zone: ZONES.find((z) => z.id === FALLBACK_ZONE_ID) ?? null,
    zoneId: FALLBACK_ZONE_ID,
    loading: false,
    error: null,
    coords: null,
  });

  function detect() {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation not supported" }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const zone = detectZone(lat, lng);
        const zoneId = zone?.id ?? FALLBACK_ZONE_ID;
        setState({
          zone: zone ?? (ZONES.find((z) => z.id === FALLBACK_ZONE_ID) ?? null),
          zoneId,
          loading: false,
          error: zone ? null : "Location outside Bahrain zones — using Manama",
          coords: { lat, lng },
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: err.code === 1 ? "Location access denied" : "Could not detect location",
        }));
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  }

  // Auto-detect on first mount
  useEffect(() => { detect(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, detect };
}

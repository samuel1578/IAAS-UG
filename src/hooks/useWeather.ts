import { useEffect, useState } from 'react';

const WEATHER_ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=5.65&longitude=-0.19&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto';

// Refetch at most every 20 minutes — this is a background campus display,
// not something that needs to be live-live.
const CACHE_TTL_MS = 20 * 60 * 1000;
const CACHE_KEY = 'ug_legon_weather_cache';

// Open-Meteo WMO weather interpretation codes (verified against
// https://open-meteo.com/en/docs — "WMO Weather interpretation codes" table).
const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Rain Showers',
  85: 'Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm'
};

interface CachedWeather {
  temperature: number;
  humidity: number;
  description: string;
  timestamp: number;
}

export interface WeatherState {
  temperature: number | null;
  humidity: number | null;
  description: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

/**
 * Live campus weather for the University of Ghana, Legon campus
 * (lat 5.65, lon -0.19), fetched from Open-Meteo's public current-weather
 * endpoint (no API key required). Results are cached in localStorage and
 * only refreshed every CACHE_TTL_MS.
 */
export const useWeather = (): WeatherState => {
  const [state, setState] = useState<WeatherState>({
    temperature: null,
    humidity: null,
    description: '',
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  useEffect(() => {
    let cancelled = false;

    const readCache = (): CachedWeather | null => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachedWeather;
        if (typeof parsed.temperature !== 'number' || typeof parsed.timestamp !== 'number') {
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    };

    const writeCache = (cache: CachedWeather) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch {
        // Ignore cache write failures (e.g. private mode / quota).
      }
    };

    const fetchWeather = async (showLoading: boolean) => {
      if (showLoading && !cancelled) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
      }

      try {
        const res = await fetch(WEATHER_ENDPOINT);
        if (!res.ok) {
          throw new Error(`Weather request failed (${res.status})`);
        }

        const data = await res.json();
        const current = data?.current;
        if (!current) {
          throw new Error('No current weather data returned');
        }

        const temperature =
          typeof current.temperature_2m === 'number' ? current.temperature_2m : null;
        const humidity =
          typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : null;
        const code = Number(current.weather_code);
        const description = WMO_DESCRIPTIONS[code] ?? 'Unknown';

        if (!cancelled) {
          setState({ temperature, humidity, description, isLoading: false, error: null, lastUpdated: Date.now() });
        }

        writeCache({
          temperature: temperature ?? 0,
          humidity: humidity ?? 0,
          description,
          timestamp: Date.now()
        });
      } catch (err) {
        if (cancelled) return;
        // Only surface the error (and hide the pill) on the initial load.
        // A background refresh failure should silently keep the last good data.
        if (showLoading) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to load weather'
          }));
        }
      }
    };

    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setState({
        temperature: cached.temperature,
        humidity: cached.humidity,
        description: cached.description,
        isLoading: false,
        error: null,
        lastUpdated: cached.timestamp
      });
    } else {
      fetchWeather(true);
    }

    const interval = setInterval(() => fetchWeather(false), CACHE_TTL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return state;
};

export default useWeather;

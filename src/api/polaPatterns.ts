import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const REFRESH_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_KEY_PREFIX = 'pola_cache_';

export interface PolaPattern {
  number: number;
  type: 'TURBO' | 'QUICK' | 'SLOW';
  mode: 'AUTO' | 'MANUAL';
  timeRange: string;
}

export interface GamePola {
  provider: string;
  gameIndex: number;
  patterns: {
    pola1: PolaPattern;
    pola2: PolaPattern;
    pola3: PolaPattern;
  };
  lastUpdated: string;
  nextUpdate: string;
  status: 'HOT' | 'NORMAL' | 'COLD';
}

const generateTimeRange = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const nextHour = (now.getHours() + 1) % 24;
  const nextHourStr = nextHour.toString().padStart(2, '0');
  return `${hours}:00 - ${nextHourStr}:00`;
};

const generatePattern = (): PolaPattern => {
  const numbers = [10, 20, 30, 40, 50, 80, 100];
  const types = ['TURBO', 'QUICK', 'SLOW'] as const;
  const modes = ['AUTO', 'MANUAL'] as const;
  
  return {
    number: numbers[Math.floor(Math.random() * numbers.length)],
    type: types[Math.floor(Math.random() * types.length)],
    mode: modes[Math.floor(Math.random() * modes.length)],
    timeRange: generateTimeRange()
  };
};

const generateFallbackPola = (provider: string, gameIndex: number): GamePola => {
  const now = new Date();
  const statuses: Array<'HOT' | 'NORMAL' | 'COLD'> = ['HOT', 'NORMAL', 'COLD'];
  return {
    provider,
    gameIndex,
    patterns: {
      pola1: generatePattern(),
      pola2: generatePattern(),
      pola3: generatePattern()
    },
    lastUpdated: now.toISOString(),
    nextUpdate: new Date(now.getTime() + REFRESH_INTERVAL).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  };
};

const getCachedPola = (provider: string, gameIndex: number): GamePola | null => {
  try {
    const key = `${CACHE_KEY_PREFIX}${provider}_${gameIndex}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      const nextUpdate = new Date(data.nextUpdate);
      if (nextUpdate > new Date()) {
        return data;
      }
      localStorage.removeItem(key);
    }
    return null;
  } catch (error) {
    console.warn('Error accessing cache:', error);
    return null;
  }
};

const setCachedPola = (pola: GamePola): void => {
  try {
    const key = `${CACHE_KEY_PREFIX}${pola.provider}_${pola.gameIndex}`;
    localStorage.setItem(key, JSON.stringify(pola));
  } catch (error) {
    console.warn('Error setting cache:', error);
  }
};

export const fetchGamePola = async (provider: string, gameIndex: number): Promise<GamePola> => {
  // First try to get from cache
  const cached = getCachedPola(provider, gameIndex);
  if (cached) {
    return cached;
  }

  // Generate fallback data immediately
  const fallbackData = generateFallbackPola(provider, gameIndex);

  try {
    // Try to fetch from API with timeout
    const response = await axios.get<GamePola>(
      `${API_BASE_URL}/pola/${provider}/${gameIndex}`,
      {
        timeout: 3000, // Reduced timeout to 3 seconds
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );

    const data = response.data;
    setCachedPola(data);
    return data;
  } catch (error) {
    console.warn(`Using fallback data for ${provider} game ${gameIndex}:`, error);
    // Use fallback data if API fails
    setCachedPola(fallbackData);
    return fallbackData;
  }
};

const BOOST_STORAGE_KEY = 'game_boosts';
const MAX_BOOSTS = 3;
const BOOST_RESET_HOURS = 24; // Reset boosts after 24 hours

interface BoostRecord {
  timestamp: number;
  gameId: string;
}

interface BoostStorage {
  boosts: BoostRecord[];
  lastResetTime: number;
}

const getBoostStorage = (): BoostStorage => {
  try {
    const stored = localStorage.getItem(BOOST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error reading boost storage:', error);
  }
  return { boosts: [], lastResetTime: Date.now() };
};

const saveBoostStorage = (storage: BoostStorage): void => {
  try {
    localStorage.setItem(BOOST_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.warn('Error saving boost storage:', error);
  }
};

const checkAndResetBoosts = (): void => {
  const storage = getBoostStorage();
  const now = Date.now();
  const hoursSinceReset = (now - storage.lastResetTime) / (1000 * 60 * 60);
  
  if (hoursSinceReset >= BOOST_RESET_HOURS) {
    storage.boosts = [];
    storage.lastResetTime = now;
    saveBoostStorage(storage);
  }
};

export const getRemainingBoosts = (): number => {
  checkAndResetBoosts();
  const storage = getBoostStorage();
  return Math.max(0, MAX_BOOSTS - storage.boosts.length);
};

export const canBoostGame = (provider: string, gameIndex: number): boolean => {
  checkAndResetBoosts();
  const storage = getBoostStorage();
  const gameId = `${provider}_${gameIndex}`;
  
  // Check if already boosted
  const alreadyBoosted = storage.boosts.some(boost => boost.gameId === gameId);
  if (alreadyBoosted) {
    return false;
  }
  
  return storage.boosts.length < MAX_BOOSTS;
};

export const boostGame = (provider: string, gameIndex: number): boolean => {
  if (!canBoostGame(provider, gameIndex)) {
    return false;
  }

  const storage = getBoostStorage();
  const gameId = `${provider}_${gameIndex}`;
  
  storage.boosts.push({
    timestamp: Date.now(),
    gameId
  });
  
  saveBoostStorage(storage);
  return true;
};

export const getNextBoostReset = (): Date => {
  const storage = getBoostStorage();
  return new Date(storage.lastResetTime + BOOST_RESET_HOURS * 60 * 60 * 1000);
};

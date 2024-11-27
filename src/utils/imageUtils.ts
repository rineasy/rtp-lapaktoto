export interface GameImage {
  id: number;
  provider: string;
  image: string;
  name: string;
}

export interface Provider {
  id: string;
  name: string;
}

// Function to format provider name
export function formatProviderName(provider: string): string {
  return provider
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Function to format game name
export function formatGameName(filename: string): string {
  return filename
    .replace(/\.(png|jpe?g)$/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Function to get all providers
export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/providers`);
    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

// Function to get all game images
export async function getGameImages(): Promise<GameImage[]> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/games`);
    if (!response.ok) {
      throw new Error('Failed to fetch game images');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game images:', error);
    return [];
  }
}

interface GameData {
  id: number;
  provider: string;
  image: string;
}

export const gameData: GameData[] = [
  {
    id: 1,
    provider: 'Pragmatic Play',
    image: '/images/pragmatic/gates-of-olympus.png'
  },
  {
    id: 2,
    provider: 'Pragmatic Play',
    image: '/images/pragmatic/sweet-bonanza.png'
  },
  {
    id: 3,
    provider: 'Pragmatic Play',
    image: '/images/pragmatic/starlight-princess.png'
  },
  {
    id: 4,
    provider: 'Pragmatic Play',
    image: '/images/pragmatic/wild-west-gold.png'
  },
  {
    id: 5,
    provider: 'PG Soft',
    image: '/images/pgsoft/mahjong-ways.png'
  },
  {
    id: 6,
    provider: 'PG Soft',
    image: '/images/pgsoft/mahjong-ways2.png'
  },
  {
    id: 7,
    provider: 'PG Soft',
    image: '/images/pgsoft/fortune-mouse.png'
  },
  {
    id: 8,
    provider: 'Habanero',
    image: '/images/habanero/koi-gate.png'
  },
  {
    id: 9,
    provider: 'Habanero',
    image: '/images/habanero/fa-cai-shen.png'
  },
  {
    id: 10,
    provider: 'Spadegaming',
    image: '/images/spadegaming/brothers-kingdom.png'
  },
  {
    id: 11,
    provider: 'Spadegaming',
    image: '/images/spadegaming/zeus.png'
  },
  {
    id: 12,
    provider: 'Microgaming',
    image: '/images/microgaming/lucky-twins.png'
  }
];

export const providers = Array.from(new Set(gameData.map(game => game.provider)));

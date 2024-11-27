import React from 'react';
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import GamesIcon from '@mui/icons-material/Games';
import StarsIcon from '@mui/icons-material/Stars';

interface ProviderIconMap {
  [key: string]: React.ReactElement;
}

export const getProviderIcon = (providerName: string): React.ReactElement => {
  const iconMap: ProviderIconMap = {
    'Pragmatic Play': <CasinoIcon />,
    'PG Soft': <SportsEsportsIcon />,
    'Habanero': <VideogameAssetIcon />,
    'Spadegaming': <GamesIcon />,
    'Microgaming': <StarsIcon />,
  };

  return iconMap[providerName] || <CasinoIcon />;
};

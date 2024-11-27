import React from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Provider } from '../utils/imageUtils';

interface ProviderNavProps {
  data: Provider[];
  value: string;
  onChange: (provider: string) => void;
  isLoading: boolean;
  isItemLoading: boolean;
}

const ProviderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  '&.Mui-selected, &.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  transition: 'all 0.3s ease-in-out',
  textTransform: 'none',
  minWidth: '120px',
  opacity: 1,
  '&.loading': {
    opacity: 0.7,
    pointerEvents: 'none',
  },
}));

const ProviderNav: React.FC<ProviderNavProps> = ({
  data,
  value,
  onChange,
  isLoading,
  isItemLoading,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((n) => (
          <Skeleton
            key={n}
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {data.map((provider) => (
        <ProviderButton
          key={provider.name}
          variant={value === provider.name ? 'contained' : 'outlined'}
          onClick={() => onChange(provider.name)}
          className={`${value === provider.name ? 'selected' : ''} ${isItemLoading ? 'loading' : ''}`}
          disabled={isItemLoading}
        >
          {provider.name}
        </ProviderButton>
      ))}
    </Box>
  );
};

export default ProviderNav;

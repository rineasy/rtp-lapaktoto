import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flex: '1 1 auto',
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            '& fieldset': {
              borderColor: 'primary.main',
              borderWidth: '1px',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'primary.light !important',
            },
            '& input': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;

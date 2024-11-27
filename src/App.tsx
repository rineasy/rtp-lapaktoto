import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Header from './components/Header';
import Hero from './components/Hero';
import PrivateRTP from './components/PrivateRTP';
import ProviderNav from './components/ProviderNav';
import GameCard from './components/GameCard';
import SearchBar from './components/SearchBar';
import theme from './theme';
import { getGameImages, getProviders, GameImage, Provider } from './utils/imageUtils';
import './App.css';

const pulseAnimation = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
`;

const HoneycombCell = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '60px',
  height: 'calc(60px * 0.866)',
  background: 'rgba(212, 175, 55, 0.03)',
  marginTop: 'calc(60px * 0.433)',
  borderLeft: '1px solid rgba(212, 175, 55, 0.1)',
  borderRight: '1px solid rgba(212, 175, 55, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:before, &:after': {
    content: '""',
    position: 'absolute',
    width: '0',
    borderLeft: '30px solid transparent',
    borderRight: '30px solid transparent',
    left: 0,
  },
  '&:before': {
    bottom: '100%',
    borderBottom: 'calc(60px * 0.433) solid rgba(212, 175, 55, 0.03)',
  },
  '&:after': {
    top: '100%',
    width: 0,
    borderTop: 'calc(60px * 0.433) solid rgba(212, 175, 55, 0.03)',
  },
}));

const HoneycombRow = styled('div')({
  display: 'flex',
  marginLeft: '30px',
  '&:nth-of-type(even)': {
    marginLeft: '60px',
  },
});

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: 'linear-gradient(145deg, rgba(10,10,10,0.97) 0%, rgba(20,20,20,0.97) 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 50%)',
  },
}));

const HoneycombPattern = () => {
  const rows = 12;
  const cellsPerRow = 15;

  return (
    <Box sx={{ 
      position: 'absolute',
      top: '-30px',
      left: '-30px',
      right: '-30px',
      bottom: '-30px',
      transform: 'rotate(-10deg) scale(1.1)',
    }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <HoneycombRow key={rowIndex}>
          {Array.from({ length: cellsPerRow }).map((_, cellIndex) => (
            <HoneycombCell
              key={cellIndex}
              sx={{
                animation: `${pulseAnimation} ${3 + Math.random() * 4}s infinite ease-in-out`,
                animationDelay: `${Math.random() * -5}s`,
              }}
            />
          ))}
        </HoneycombRow>
      ))}
    </Box>
  );
};

function App() {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [games, setGames] = useState<GameImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [providerLoading, setProviderLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const providerData = await getProviders();
        setProviders(providerData);
        if (providerData.length > 0) {
          setSelectedProvider(providerData[0].name);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      if (selectedProvider) {
        setProviderLoading(true);
        try {
          const gameData = await getGameImages();
          setGames(gameData);
        } catch (error) {
          console.error('Error fetching games:', error);
        } finally {
          setProviderLoading(false);
        }
      } else {
        setGames([]);
      }
    };
    fetchGames();
  }, [selectedProvider]);

  const filteredGames = games.filter(game => {
    const matchesProvider = game.provider.toLowerCase() === selectedProvider.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      game.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatedBackground>
          <HoneycombPattern />
        </AnimatedBackground>
        <Header />
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Hero />
        </Box>
        <PrivateRTP />
        <Container maxWidth="lg" sx={{ mt: 0, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <ProviderNav
              data={providers}
              value={selectedProvider}
              onChange={setSelectedProvider}
              isLoading={loading}
              isItemLoading={providerLoading}
            />
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </Box>
          {providerLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px',
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={40} sx={{ color: 'primary.main' }} />
              <Box sx={{ 
                color: 'primary.main', 
                typography: 'body2',
                textAlign: 'center',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.6 }
                }
              }}>
                Memuat Game {selectedProvider}...
              </Box>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredGames.map((game, index) => (
                <Grid 
                  item 
                  xs={6} 
                  sm={4} 
                  md={3} 
                  key={game.id}
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <GameCard
                      imagePath={game.image}
                      provider={game.provider}
                      index={index}
                      gameName={game.name}
                    />
                  </Box>
                </Grid>
              ))}
              {filteredGames.length === 0 && !loading && !providerLoading && (
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'primary.main',
                      py: 4,
                    }}
                  >
                    No games found matching your search.
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

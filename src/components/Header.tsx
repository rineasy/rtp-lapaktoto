import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Container,
  Button,
  Stack,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarsIcon from '@mui/icons-material/Stars';
import { styled } from '@mui/material/styles';

const pages = [
  { name: 'HOME', icon: <HomeIcon />, href: '#' },
  { name: 'SLOT', icon: <CasinoIcon />, href: 'https://japin.xyz/slot' },
  { name: 'TOGEL', icon: <SportsEsportsIcon />, href: 'https://japin.xyz/togel' },
  { name: 'DAFTAR', icon: <StarsIcon />, href: 'https://japin.xyz/play' },
];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98), rgba(0, 0, 0, 0.95))',
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderBottom: `1px solid ${theme.palette.primary.light}`,
    boxShadow: '0 4px 30px rgba(212, 175, 55, 0.1)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: '2px',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    '&::after': {
      width: '100%',
    },
  },
}));

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.98), rgba(0, 0, 0, 0.95))',
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${theme.palette.primary.main}`,
  boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  transition: 'all 0.3s ease-in-out',
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.75rem',
    transition: 'all 0.2s ease-in-out',
  },
  '& .MuiBottomNavigationAction-label.Mui-selected': {
    fontSize: '0.875rem',
  },
  '& .MuiSvgIcon-root': {
    transition: 'all 0.2s ease-in-out',
  },
  '&:hover': {
    '& .MuiSvgIcon-root': {
      transform: 'scale(1.1)',
    },
    '& .MuiBottomNavigationAction-label': {
      color: theme.palette.primary.main,
    },
  },
}));

const Header: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 80 } }}>
            {/* Logo */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-start' },
              mr: { md: 4 }
            }}>
              <img 
                src="https://applapak.xyz/images/logo-gif.gif" 
                width="120" 
                alt="LAPAKTOTO" 
              />
            </Box>

            {/* Desktop Navigation */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                flexGrow: 0,
                justifyContent: 'flex-end'
              }}
            >
              {pages.map((page) => (
                <StyledButton
                  key={page.name}
                  startIcon={page.icon}
                  onClick={() => {
                    if (page.href.startsWith('http')) {
                      window.open(page.href, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = page.href;
                    }
                  }}
                >
                  {page.name}
                </StyledButton>
              ))}
            </Stack>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Bottom Navigation */}
      <Paper sx={{ display: { md: 'none' } }} elevation={3}>
        <StyledBottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {pages.map((page, index) => (
            <StyledBottomNavigationAction 
              key={page.name}
              label={page.name} 
              icon={page.icon}
              onClick={() => {
                if (page.href.startsWith('http')) {
                  window.open(page.href, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = page.href;
                }
              }}
            />
          ))}
        </StyledBottomNavigation>
      </Paper>

      {/* Add bottom padding to account for mobile navigation */}
      {isMobile && <Box sx={{ height: 65 }} />}
    </>
  );
};

export default Header;

import React from 'react';
import { Box, Container, Button, Typography, Stack, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37; }
  50% { text-shadow: 0 0 20px #D4AF37, 0 0 30px #D4AF37; }
  100% { text-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37; }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%)',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  position: 'relative',
  overflow: 'hidden',
  marginTop: '-1px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    animation: 'slide 20s linear infinite',
    background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
  },
}));

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 800,
  letterSpacing: '2px',
  animation: `${float} 3s ease-in-out infinite, ${glow} 3s ease-in-out infinite`,
  textTransform: 'uppercase',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  fontWeight: 'bold',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
  },
}));

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Box>
            <AnimatedTitle variant="h3" gutterBottom>
              LAPAKTOTO RTP LIVE
            </AnimatedTitle>
            <Typography 
              variant="h6" 
              color="primary.light"
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                opacity: 0.9,
                mb: 4,
                fontWeight: 500,
              }}
            >
              Temukan Pola RTP Slot Gacor Hari Ini dengan Akurasi Tinggi
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            width="100%"
            maxWidth={500}
          >
            <StyledButton
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.open('https://japin.xyz/play', '_blank', 'noopener,noreferrer')}
              fullWidth
            >
              DAFTAR SEKARANG
            </StyledButton>
            <StyledButton
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => window.open('https://japin.xyz/play', '_blank', 'noopener,noreferrer')}
              fullWidth
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              LOGIN
            </StyledButton>
          </Stack>
        </Stack>
      </Container>
    </HeroSection>
  );
};

export default Hero;

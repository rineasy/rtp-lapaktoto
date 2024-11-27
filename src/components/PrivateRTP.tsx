import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import CasinoIcon from '@mui/icons-material/Casino';

// Sample game data
const games = [
  {
    name: "Mahjong Ways 2",
    provider: "Pgsoft",
    image: "/images/pgsoft/mahjong-ways22.webp"
  },
  {
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    image: "/images/pragmatic/vs20olympgate.png"
  },
  {
    name: "Starlight Princess",
    provider: "Pragmatic Play",
    image: "/images/pragmatic/vs20starlight.png"
  },
  {
    name: "Wild West Gold",
    provider: "Pragmatic Play",
    image: "/images/pragmatic/vs40wildwest.png"
  }
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%)',
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(212, 175, 55, 0.1)',
    border: `1px solid ${theme.palette.primary.light}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    transform: 'skewX(-25deg)',
    transition: 'all 0.75s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.primary.main,
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    width: '50%',
    height: 2,
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
    transform: 'translateX(-50%)',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%)',
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  marginTop: theme.spacing(3),
}));

const GlowingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: `0 0 10px ${theme.palette.primary.main}`,
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const LoadingAnimation = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '4px',
  background: 'rgba(212, 175, 55, 0.1)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '30%',
    background: theme.palette.primary.main,
    animation: 'loading 1s infinite',
    borderRadius: theme.shape.borderRadius,
  },
  '@keyframes loading': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(400%)',
    },
  },
}));

const PrivateRTP: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleCheck = async () => {
    if (!userId) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate random RTP between 80-90%
    const rtp = (Math.random() * 10 + 80).toFixed(2);
    
    // Select random game
    const randomGame = games[Math.floor(Math.random() * games.length)];

    setResult({
      rtp,
      game: randomGame,
    });

    setLoading(false);
    setOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <StyledPaper elevation={3}>
        <Box position="relative">
          <LockIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <StyledTitle variant="h5" gutterBottom>
            PRIVATE RTP CHECK
          </StyledTitle>
          <Typography variant="body1" color="primary.light" gutterBottom>
            Masukkan User ID Anda untuk melihat RTP khusus member
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <StyledTextField
              fullWidth
              label="User ID"
              variant="outlined"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheck}
              disabled={loading || !userId}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                },
              }}
            >
              {loading ? (
                <>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Checking RTP...
                    </Typography>
                    <LoadingAnimation />
                  </Box>
                </>
              ) : (
                'CHECK RTP'
              )}
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(20,20,20,0.98) 100%)',
            border: '2px solid #D4AF37',
          }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', textAlign: 'center' }}>
          <CasinoIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" component="div" fontWeight="bold">
            RTP Khusus Member
          </Typography>
        </DialogTitle>
        <DialogContent>
          {result && (
            <ResultCard>
              <CardMedia
                component="img"
                height="200"
                image={result.game.image}
                alt={result.game.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {result.game.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {result.game.provider}
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary.main" 
                  fontWeight="bold"
                  sx={{ 
                    mt: 2,
                    textShadow: '0 0 10px #D4AF37',
                  }}
                >
                  RTP: {result.rtp}%
                </Typography>
              </CardContent>
            </ResultCard>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PrivateRTP;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress, 
  Paper,
  Button,
  IconButton,
  Collapse,
  Chip,
  Tooltip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { fetchGamePola, type GamePola, type PolaPattern } from '../api/polaPatterns';
import { canBoostGame, boostGame, getRemainingBoosts, getNextBoostReset } from '../utils/boostManager';

interface GameCardProps {
  imagePath: string;
  provider: string;
  index: number;
  gameName: string;
}

interface StatusChipProps {
  status: 'HOT' | 'NORMAL' | 'COLD';
}

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[800],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
}));

const PatternBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  background: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(212, 175, 55, 0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    background: 'rgba(212, 175, 55, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  }
}));

const StatusChip = styled(Chip)<StatusChipProps>(({ theme, status }) => ({
  backgroundColor: status === 'HOT' 
    ? 'rgba(255, 0, 0, 0.1)' 
    : status === 'COLD' 
      ? 'rgba(0, 0, 255, 0.1)' 
      : 'rgba(255, 255, 0, 0.1)',
  color: status === 'HOT' 
    ? theme.palette.error.main 
    : status === 'COLD' 
      ? theme.palette.info.main 
      : theme.palette.warning.main,
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: 'inherit'
  },
  '& .MuiChip-label': {
    padding: '0 4px'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(10,10,10,0.9) 100%)',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 10px 30px rgba(212, 175, 55, 0.2)`,
    border: `1px solid ${theme.palette.primary.light}`,
    '& img': {
      transform: 'scale(1.05)',
    },
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

const StyledCardMedia = styled('img')({
  width: '90%',
  height: 'auto',
  objectFit: 'contain',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

const PlayButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  padding: '10px 20px',
  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
}));

const GameCard: React.FC<GameCardProps> = ({ imagePath, provider, index, gameName }) => {
  const [percentage, setPercentage] = useState<number>(70);
  const [gamePola, setGamePola] = useState<GamePola | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showBoost, setShowBoost] = useState<boolean>(false);
  const [canBoost, setCanBoost] = useState<boolean>(false);
  const [remainingBoosts, setRemainingBoosts] = useState<number>(3);
  const [boostActive, setBoostActive] = useState<boolean>(false);

  const formatPattern = (pattern: PolaPattern): string => {
    return `${pattern.number} ${pattern.type} ${pattern.mode}`;
  };

  const updatePola = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGamePola(provider, index);
      setGamePola(data);
      setError('');
    } catch (error) {
      console.error('Error updating pola:', error);
      setError('Failed to update pattern data');
    } finally {
      setLoading(false);
    }
  }, [provider, index]);

  const updateBoostState = useCallback(() => {
    setCanBoost(canBoostGame(provider, index));
    setRemainingBoosts(getRemainingBoosts());
  }, [provider, index]);

  const handleBoost = () => {
    if (!canBoost) return;

    const boosted = boostGame(provider, index);
    if (boosted) {
      setBoostActive(true);
      updateBoostState();
      
      // Increase RTP temporarily
      const currentPercent = parseInt(localStorage.getItem(`percent_${index}_${provider}`) || '70');
      const boostedPercent = Math.min(99, currentPercent + 15);
      setPercentage(boostedPercent);
      localStorage.setItem(`percent_${index}_${provider}`, boostedPercent.toString());

      // Reset after 30 minutes
      setTimeout(() => {
        setBoostActive(false);
        setPercentage(currentPercent);
        localStorage.setItem(`percent_${index}_${provider}`, currentPercent.toString());
      }, 30 * 60 * 1000);
    }
  };

  useEffect(() => {
    updatePola();
    
    // Set up interval to check for updates
    const interval = setInterval(updatePola, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [updatePola]);

  useEffect(() => {
    updateBoostState();
  }, [updateBoostState]);

  useEffect(() => {
    const percentKey = `percent_${index}_${provider}`;
    const storedPercent = localStorage.getItem(percentKey);
    const newPercent = storedPercent ? parseInt(storedPercent) : Math.floor(Math.random() * 101);
    setPercentage(newPercent);
    localStorage.setItem(percentKey, newPercent.toString());
  }, [index, provider]);

  return (
    <StyledCard 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1, sm: 1.5 }, 
      }}>
        {/* Game image */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 1, sm: 1.5 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'fit-content'
        }}>
          <StyledCardMedia 
            src={imagePath} 
            alt={`${gameName} game`} 
          />
        </Box>

        {/* Provider name and status */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 0.5, sm: 1 },
          px: { xs: 0.5, sm: 0 },
          gap: 1
        }}>
          <Typography 
            variant="subtitle1" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '70%'
            }}
          >
            {provider}
          </Typography>
          {gamePola && (
            <StatusChip
              icon={<WhatshotIcon sx={{ 
                fontSize: { xs: 14, sm: 16 },
                mr: -0.5
              }} />}
              label={gamePola.status}
              status={gamePola.status}
              size="small"
              sx={{
                height: { xs: 24, sm: 28 },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  px: 1
                }
              }}
            />
          )}
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1,
            px: { xs: 1, sm: 0 } 
          }}>
            <Typography 
              variant="body2" 
              color="primary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              RTP Live
            </Typography>
            <Typography 
              variant="body2" 
              color="primary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {percentage}%
            </Typography>
          </Box>
          <StyledLinearProgress 
            variant="determinate" 
            value={percentage} 
          />
        </Box>

        <Typography 
          variant="subtitle2" 
          color="secondary" 
          sx={{ 
            textAlign: 'center',
            mb: { xs: 1, sm: 2 },
            fontWeight: 'medium',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          POLA MAIN
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 2 } }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : error ? (
          <Typography 
            color="error" 
            align="center" 
            sx={{ 
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {error}
          </Typography>
        ) : gamePola && (
          <>
            {[gamePola.patterns.pola1, gamePola.patterns.pola2, gamePola.patterns.pola3].map((pattern, idx) => (
              <PatternBox key={idx}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 0.5, sm: 1 }
                }}>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      width: { xs: '100%', sm: 'auto' }, 
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {formatPattern(pattern)}
                  </Typography>
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                    label={pattern.timeRange}
                    size="small"
                    sx={{ 
                      ml: { xs: 0, sm: 1 },
                      width: { xs: '100%', sm: 'auto' }, 
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      color: 'primary.main',
                      '& .MuiChip-label': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      }
                    }}
                  />
                </Box>
              </PatternBox>
            ))}
          </>
        )}

        <Box sx={{ 
          mt: { xs: 2, sm: 3 }, 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          px: { xs: 1, sm: 0 } 
        }}>
          <PlayButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => window.open('https://japin.xyz/play', '_blank', 'noopener,noreferrer')}
            sx={{
              fontWeight: 'bold',
              py: 1,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
              },
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 20 }} />
            MAIN
          </PlayButton>
          <Tooltip title={
            !canBoost 
              ? `No more boosts available. Resets at ${getNextBoostReset().toLocaleTimeString()}`
              : 'Boost RTP by 15% for 30 minutes'
          }>
            <span>
              <Button
                variant="contained"
                disabled={!canBoost || boostActive}
                onClick={handleBoost}
                sx={{
                  minWidth: { xs: '40px', sm: '50px' },
                  py: { xs: 0.5, sm: 1 }, 
                  background: boostActive
                    ? 'linear-gradient(45deg, #ff0000, #ff4444)'
                    : 'linear-gradient(45deg, #ff4444, #ff0000)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff4444, #ff0000)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(255, 0, 0, 0.1)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <Badge 
                  badgeContent={remainingBoosts} 
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }
                  }}
                >
                  <RocketLaunchIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                </Badge>
              </Button>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default GameCard;

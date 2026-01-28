import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close, TrendingUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';

interface FirstTimeTooltipProps {
  userId?: string;
}

export function FirstTimeTooltip({ userId }: FirstTimeTooltipProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the tooltip
    const tooltipKey = userId ? `tooltip_seen_${userId}` : 'tooltip_seen';
    const hasSeenTooltip = localStorage.getItem(tooltipKey);
    
    if (!hasSeenTooltip) {
      // Show tooltip after a short delay
      setTimeout(() => {
        setShow(true);
      }, 1000);
    }
  }, [userId]);

  const handleDismiss = () => {
    setShow(false);
    const tooltipKey = userId ? `tooltip_seen_${userId}` : 'tooltip_seen';
    localStorage.setItem(tooltipKey, 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
            maxWidth: 400,
            width: 'calc(100% - 48px)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(91, 95, 227, 0.4)',
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Welcome to FinanceLife! 🎉
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.5,
                }}
              >
                Start by adding today's expenses to track your spending habits
              </Typography>
            </Box>
            <IconButton
              onClick={handleDismiss}
              size="small"
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
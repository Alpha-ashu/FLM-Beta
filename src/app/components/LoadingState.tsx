import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'motion/react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  const container = fullScreen ? {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } : {
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={container}
    >
      <Box sx={{ textAlign: 'center' }}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#00D4FF',
              filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))',
            }}
          />
        </motion.div>
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            color: '#8B8FA3',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

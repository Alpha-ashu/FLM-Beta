import { Box, Typography, Button } from '@mui/material';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: 400 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(0, 212, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '2px solid rgba(0, 212, 255, 0.2)',
              color: '#00D4FF',
              fontSize: 48,
            }}
          >
            {icon}
          </Box>
        </motion.div>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#E8EAF0',
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#8B8FA3',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
              color: '#0A0E27',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}

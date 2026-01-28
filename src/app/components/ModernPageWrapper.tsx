import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { ReactNode } from 'react';

interface ModernPageWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
}

export function ModernPageWrapper({ title, subtitle, children, onBack, actions }: ModernPageWrapperProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8E8FF 0%, #F0F0FF 50%, #E0E0FF 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: 10, sm: 3 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(91, 95, 227, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 143, 245, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {onBack && (
              <IconButton
                onClick={onBack}
                sx={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#5B5FE3',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 4px 16px rgba(91, 95, 227, 0.2)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2D3142',
                  mb: subtitle ? 0.5 : 0,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#8B8FA3',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {actions && <Box>{actions}</Box>}
        </Box>

        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}

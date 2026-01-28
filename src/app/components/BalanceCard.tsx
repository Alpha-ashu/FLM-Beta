import { Box, Typography, IconButton } from '@mui/material';
import { CreditCard, MoreHoriz } from '@mui/icons-material';

interface BalanceCardProps {
  balance: number;
  cardNumber: string;
  cardHolder: string;
}

export function BalanceCard({ balance, cardNumber, cardHolder }: BalanceCardProps) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(139, 143, 245, 0.9) 0%, rgba(91, 95, 227, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '28px',
        padding: '28px',
        color: 'white',
        boxShadow: '0 16px 48px rgba(91, 95, 227, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            fontSize: '0.875rem',
            fontWeight: 500,
            mb: 1,
          }}
        >
          Balance
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: '2.5rem',
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              opacity: 0.9,
              letterSpacing: '0.1em',
            }}
          >
            {cardNumber}
          </Typography>
          <IconButton
            sx={{
              background: 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.35)',
              },
            }}
          >
            <CreditCard sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 2,
            opacity: 0.85,
            fontSize: '0.875rem',
          }}
        >
          {cardHolder}
        </Typography>
      </Box>

      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      </Box>
    </Box>
  );
}

import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'motion/react';
import { 
  TipsAndUpdates, 
  SwipeLeft, 
  TouchApp, 
  Accessibility 
} from '@mui/icons-material';

export function QuickTips() {
  const tips = [
    {
      icon: <TouchApp />,
      title: 'Tap & Explore',
      description: 'Tap any card to see more details and interact with your financial data.',
    },
    {
      icon: <SwipeLeft />,
      title: 'Navigate Easily',
      description: 'Use the sidebar or bottom navigation to quickly access different sections.',
    },
    {
      icon: <TipsAndUpdates />,
      title: 'Quick Actions',
      description: 'Look for the floating action buttons to add transactions, expenses, or goals.',
    },
    {
      icon: <Accessibility />,
      title: 'Accessible Design',
      description: 'Use keyboard shortcuts and screen readers for better accessibility.',
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <TipsAndUpdates sx={{ color: '#00D4FF', fontSize: 32 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#E8EAF0',
          }}
        >
          Quick Tips
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              sx={{
                background: 'rgba(20, 25, 50, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid rgba(0, 212, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 212, 255, 0.2)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00D4FF',
                      flexShrink: 0,
                    }}
                  >
                    {tip.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#E8EAF0',
                        mb: 1,
                      }}
                    >
                      {tip.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#8B8FA3',
                        lineHeight: 1.6,
                      }}
                    >
                      {tip.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import {
  Add,
  Groups,
  Receipt,
  Analytics,
  CameraAlt,
  AccountBalance,
  Notifications,
  Person,
  TrendingUp,
  Calculate,
  People,
  Paid,
  Timeline,
  MonetizationOn,
} from '@mui/icons-material';

interface QuickActionsProps {
  onNavigate: (view: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    {
      id: 'expense_splitting',
      title: 'Split Expenses',
      description: 'Split bills with friends',
      icon: <Receipt sx={{ fontSize: 40 }} />,
      color: '#00D4FF',
      view: 'expense_splitting',
    },
    {
      id: 'groups',
      title: 'Groups',
      description: 'Manage expense groups',
      icon: <Groups sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      view: 'groups',
    },
    {
      id: 'budgets',
      title: 'Budgets',
      description: 'Track your budgets',
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      view: 'budgets',
    },
    {
      id: 'friends',
      title: 'Friends',
      description: 'Manage friends',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#ec4899',
      view: 'friends',
    },
    {
      id: 'settlements',
      title: 'Settlements',
      description: 'Settle up balances',
      icon: <Paid sx={{ fontSize: 40 }} />,
      color: '#10b981',
      view: 'settlements',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View spending insights',
      icon: <Analytics sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      view: 'expense_analytics',
    },
    {
      id: 'goals',
      title: 'Goals',
      description: 'Track financial goals',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#10b981',
      view: 'goals',
    },
    {
      id: 'activity',
      title: 'Activity',
      description: 'View recent activity',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      view: 'activity',
    },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.id}>
              <Button
                onClick={() => onNavigate(action.view)}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 120,
                  flexDirection: 'column',
                  gap: 1,
                  bgcolor: 'background.paper',
                  border: 2,
                  borderColor: action.color,
                  '&:hover': {
                    bgcolor: action.color,
                    '& .MuiSvgIcon-root, & .MuiTypography-root': {
                      color: 'white',
                    },
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ color: action.color }}>{action.icon}</Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
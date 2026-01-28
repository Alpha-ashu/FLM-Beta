import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Settings,
  AccountCircle,
  Email,
  Phone,
  LocationOn,
  Work,
  Edit,
  TrendingUp,
  AccountBalance,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';

interface SimpleProfileProps {
  supabase: any;
  session: any;
  onLogout?: () => void;
}

export function SimpleProfile({ supabase, session, onLogout }: SimpleProfileProps) {
  // Mock user data for demo
  const user = {
    name: session?.user?.user_metadata?.name || session?.user?.email,
    email: session?.user?.email,
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    occupation: 'Financial Professional',
    joinDate: 'January 2024',
    totalGoals: 3,
    activeGoals: 2,
    completedGoals: 1,
    totalInvestments: 25000,
    monthlyIncome: 5000,
    monthlyExpenses: 3200,
  };

  const stats = [
    { label: 'Total Goals', value: user.totalGoals, icon: <TrendingUp /> },
    { label: 'Active Goals', value: user.activeGoals, icon: <AccountBalance /> },
    { label: 'Completed', value: user.completedGoals, icon: <AttachMoney /> },
    { label: 'Investments', value: `$${user.totalInvestments.toLocaleString()}`, icon: <AccountBalance /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              fontSize: '2rem',
            }}
          >
            {user.name[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user.occupation}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                icon={<Email />}
                label={user.email}
                variant="outlined"
              />
              <Chip
                icon={<Phone />}
                label={user.phone}
                variant="outlined"
              />
              <Chip
                icon={<LocationOn />}
                label={user.location}
                variant="outlined"
              />
              <Chip
                icon={<CalendarToday />}
                label={`Member since ${user.joinDate}`}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              startIcon={<Edit />}
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Edit Profile
            </Button>
            <Button
              startIcon={<Settings />}
              variant="contained"
              sx={{ borderRadius: 8 }}
            >
              Settings
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        {stats.map((stat, index) => (
          <Card key={index} elevation={0} sx={{ border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Avatar sx={{ background: '#3B82F6', width: 40, height: 40 }}>
                  {stat.icon}
                </Avatar>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Financial Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Financial Summary
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText
                  primary="Monthly Income"
                  secondary={`$${user.monthlyIncome.toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AttachMoney />
                </ListItemIcon>
                <ListItemText
                  primary="Monthly Expenses"
                  secondary={`$${user.monthlyExpenses.toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText
                  primary="Net Savings"
                  secondary={`$${(user.monthlyIncome - user.monthlyExpenses).toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText
                  primary="Total Investments"
                  secondary={`$${user.totalInvestments.toLocaleString()}`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Goals Progress
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Emergency Fund</Typography>
                  <Typography variant="body2">65%</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4 }}>
                  <Box sx={{ width: '65%', height: '100%', background: '#3B82F6', borderRadius: 4 }} />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Vacation Fund</Typography>
                  <Typography variant="body2">30%</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4 }}>
                  <Box sx={{ width: '30%', height: '100%', background: '#3B82F6', borderRadius: 4 }} />
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">House Down Payment</Typography>
                  <Typography variant="body2">15%</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4 }}>
                  <Box sx={{ width: '15%', height: '100%', background: '#3B82F6', borderRadius: 4 }} />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{ borderRadius: 8 }}
          >
            Add Goal
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: 8 }}
          >
            View Reports
          </Button>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={onLogout}
          sx={{ borderRadius: 8 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
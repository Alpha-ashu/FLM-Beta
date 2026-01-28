import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
} from '@mui/material';
import {
  Add,
  Home,
  Person,
  Receipt,
  MoreHoriz,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  AccountBalanceWallet,
  PeopleAlt,
  CalendarMonth,
  Notifications,
} from '@mui/icons-material';
import { BalanceCard } from './BalanceCard';
import { GlassCard } from './GlassCard';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';

interface ModernOverviewProps {
  supabase: any;
  session: any;
  onNavigate?: (view: string) => void;
}

// Mock data for chart
const chartData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 38 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 50 },
  { month: 'Jun', value: 70 },
  { month: 'Jul', value: 85 },
];

const mockContacts = [
  { id: 1, name: 'Ronnie', avatar: '👨', color: '#FFD93D' },
  { id: 2, name: 'Jordyn', avatar: '👩', color: '#A8DADC' },
  { id: 3, name: 'Henry', avatar: '👨‍💼', color: '#E76F51' },
];

const mockTransactions = [
  {
    id: 1,
    name: 'Creative Cloud',
    date: '30 March, 2021',
    amount: -52.99,
    icon: '🎨',
    color: '#FF6B9D',
  },
  {
    id: 2,
    name: 'Paypal Income',
    date: '28 Feb, 2021',
    amount: 856.99,
    icon: '💳',
    color: '#00D4FF',
  },
  {
    id: 3,
    name: 'Netflix Subscription',
    date: '25 Feb, 2021',
    amount: -15.99,
    icon: '🎬',
    color: '#E50914',
  },
];

const quickActions = [
  { id: 1, name: 'Bank', icon: AccountBalance, color: '#5B5FE3', view: 'accounts' },
  { id: 2, name: 'Card', icon: CreditCard, color: '#00D4FF', view: 'loans' },
  { id: 3, name: 'Loan', icon: AccountBalanceWallet, color: '#FF6B9D', view: 'loans' },
  { id: 4, name: 'Friend', icon: PeopleAlt, color: '#10E584', view: 'friends' },
];

const upcomingPayments = [
  {
    id: 1,
    title: 'Home Loan EMI',
    date: 'Jan 28, 2026',
    amount: 2500,
    type: 'loan',
    color: '#FF6B9D',
  },
  {
    id: 2,
    title: 'Collect from John',
    date: 'Jan 30, 2026',
    amount: 500,
    type: 'collect',
    color: '#10E584',
  },
  {
    id: 3,
    title: 'Car Loan Payment',
    date: 'Feb 05, 2026',
    amount: 1200,
    type: 'loan',
    color: '#FF6B9D',
  },
  {
    id: 4,
    title: 'Pay to Sarah',
    date: 'Feb 10, 2026',
    amount: 300,
    type: 'debt',
    color: '#FF5C7C',
  },
];

export function ModernOverview({ supabase, session, onNavigate }: ModernOverviewProps) {
  const [activeTab, setActiveTab] = useState('home');
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';

  return (
    <Box
      sx={{
        maxWidth: '480px',
        mx: 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
              border: '2px solid white',
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
            Welcome, <span style={{ color: '#5B5FE3' }}>{userName}!</span>
          </Typography>
        </Box>
        <IconButton
          sx={{
            background: 'rgba(91, 95, 227, 0.1)',
            color: '#5B5FE3',
          }}
        >
          <MoreHoriz />
        </IconButton>
      </Box>

      {/* Balance Card in Purple Gradient Container */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FE8 100%)',
          borderRadius: '32px',
          p: 3,
          mb: 3,
          boxShadow: '0 20px 60px rgba(91, 95, 227, 0.3)',
        }}
      >
        <BalanceCard
          balance={125566}
          cardNumber="**** **** **** 1586"
          cardHolder={userName}
        />

        {/* Quick Actions Section */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
              fontWeight: 600,
            }}
          >
            Quick Actions
          </Typography>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
            }}
          >
            {quickActions.map((action) => (
              <Box
                key={action.id}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate(action.view);
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderColor: 'white',
                    },
                  }}
                >
                  <action.icon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Add {action.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Upcoming Payments Calendar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonth sx={{ color: '#5B5FE3', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142' }}>
              Upcoming Payments
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: '#8B8FA3' }}>
            <MoreHoriz />
          </IconButton>
        </Box>

        <GlassCard>
          <List sx={{ p: 0 }}>
            {upcomingPayments.map((payment, index) => (
              <ListItem
                key={payment.id}
                sx={{
                  py: 2,
                  px: 2.5,
                  borderBottom: index < upcomingPayments.length - 1 ? '1px solid rgba(91, 95, 227, 0.08)' : 'none',
                }}
              >
                <ListItemAvatar>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: `${payment.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {payment.type === 'collect' ? (
                      <TrendingDown sx={{ color: payment.color, fontSize: 24 }} />
                    ) : payment.type === 'loan' ? (
                      <AccountBalanceWallet sx={{ color: payment.color, fontSize: 24 }} />
                    ) : (
                      <TrendingUp sx={{ color: payment.color, fontSize: 24 }} />
                    )}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2D3142' }}>
                      {payment.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <CalendarMonth sx={{ fontSize: 14, color: '#8B8FA3' }} />
                      <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                        {payment.date}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: payment.type === 'collect' ? '#10E584' : '#FF5C7C',
                      mb: 0.5,
                    }}
                  >
                    {payment.type === 'collect' ? '+' : '-'}${payment.amount.toFixed(2)}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '8px',
                      background: `${payment.color}15`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Notifications sx={{ fontSize: 12, color: payment.color }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: payment.color,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                      }}
                    >
                      {payment.type === 'collect' ? 'COLLECT' : payment.type === 'loan' ? 'LOAN' : 'PAY'}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </GlassCard>
      </Box>

      {/* Transaction History */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142' }}>
            Transaction History
          </Typography>
          <IconButton size="small" sx={{ color: '#8B8FA3' }}>
            <MoreHoriz />
          </IconButton>
        </Box>

        <GlassCard>
          <List sx={{ p: 0 }}>
            {mockTransactions.slice(0, 2).map((transaction, index) => (
              <ListItem
                key={transaction.id}
                sx={{
                  py: 2,
                  px: 2.5,
                  borderBottom: index < 1 ? '1px solid rgba(91, 95, 227, 0.08)' : 'none',
                }}
              >
                <ListItemAvatar>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: `${transaction.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {transaction.icon}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2D3142' }}>
                      {transaction.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                      {transaction.date}
                    </Typography>
                  }
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: transaction.amount > 0 ? '#10E584' : '#FF5C7C',
                  }}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </GlassCard>
      </Box>

      {/* Analytics Card */}
      <GlassCard sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142' }}>
              $56.55
            </Typography>
            <Typography variant="caption" sx={{ color: '#10E584', fontWeight: 600 }}>
              +15% than last month
            </Typography>
          </Box>
          <Box
            sx={{
              background: 'rgba(91, 95, 227, 0.08)',
              borderRadius: '12px',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: '#5B5FE3', fontWeight: 600 }}>
              6 Month
            </Typography>
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B5FE3" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5B5FE3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8B8FA3', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#5B5FE3"
              strokeWidth={3}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </Box>
  );
}
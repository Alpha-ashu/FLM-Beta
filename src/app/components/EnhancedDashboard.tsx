import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
  Notifications,
  Add,
  AccountBalanceWallet,
  ShoppingCart,
  Restaurant,
  DirectionsCar,
  Home,
  MoreHoriz,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { motion } from 'motion/react';

interface EnhancedDashboardProps {
  supabase: any;
  session: any;
  onNavigate: (view: string) => void;
}

export function EnhancedDashboard({ supabase, session, onNavigate }: EnhancedDashboardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Mock data - would come from props/API in real app
  const totalBalance = 16103.34;
  const totalExpense = 1187.40;
  const balanceChange = 839.8;
  const balanceChangePercent = 8.1;
  const expenseChange = -245.20;
  const expenseChangePercent = -5.2;

  const recentTransactions = [
    {
      id: '1',
      name: 'Salary',
      date: '18:27 - April 30',
      category: 'Monthly',
      amount: 4000.00,
      type: 'income' as const,
      icon: <AccountBalanceWallet />,
      color: '#4F46E5',
    },
    {
      id: '2',
      name: 'Groceries',
      date: '17:00 - April 24',
      category: 'Pantry',
      amount: -100.00,
      type: 'expense' as const,
      icon: <ShoppingCart />,
      color: '#06B6D4',
    },
    {
      id: '3',
      name: 'Rent',
      date: '8:30 - April 15',
      category: 'Rent',
      amount: -674.40,
      type: 'expense' as const,
      icon: <Home />,
      color: '#8B5CF6',
    },
    {
      id: '4',
      name: 'Dining Out',
      date: '12:45 - April 22',
      category: 'Food',
      amount: -45.00,
      type: 'expense' as const,
      icon: <Restaurant />,
      color: '#F59E0B',
    },
  ];

  const savingsGoal = {
    name: 'Savings On Goals',
    current: 2500,
    target: 5000,
    icon: <DirectionsCar />,
    color: '#10B981',
  };

  const weeklyStats = {
    revenue: 4000.00,
    food: -100.00,
  };

  const expensePercentage = (Math.abs(totalExpense) / totalBalance) * 100;

  return (
    <Box
      component="main"
      aria-label="Dashboard"
      sx={{
        minHeight: '100vh',
        background: '#0A0E27',
        pb: { xs: 10, md: 4 },
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          p: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#E8EAF0',
                mb: 1,
                background: 'linear-gradient(135deg, #E8EAF0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome Back!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#8B8FA3',
              }}
            >
              Here's your financial overview
            </Typography>
          </Box>
          <IconButton
            aria-label="Notifications"
            sx={{
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              color: '#00D4FF',
              '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => onNavigate('notifications')}
          >
            <Notifications />
          </IconButton>
        </Box>

        {/* Balance Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                background: 'rgba(20, 25, 50, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(0, 212, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#8B8FA3', fontWeight: 500 }}>
                    Total Balance
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #10B981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                  }}
                >
                  ${totalBalance.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={balanceChangePercent > 0 ? <TrendingUp /> : <TrendingDown />}
                    label={`${balanceChangePercent > 0 ? '+' : ''}${balanceChangePercent}%`}
                    size="small"
                    sx={{
                      backgroundColor: balanceChangePercent > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                      color: balanceChangePercent > 0 ? '#10B981' : '#DC2626',
                      fontWeight: 600,
                      border: `1px solid ${balanceChangePercent > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                      '& .MuiChip-icon': {
                        color: balanceChangePercent > 0 ? '#10B981' : '#DC2626',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
                    +${balanceChange.toLocaleString()} this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card
              sx={{
                background: 'rgba(20, 25, 50, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#6366F1',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#8B8FA3', fontWeight: 500 }}>
                    Total Expense
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: '#6366F1',
                    mb: 2,
                  }}
                >
                  ${Math.abs(totalExpense).toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={expenseChangePercent < 0 ? <TrendingDown /> : <TrendingUp />}
                    label={`${expenseChangePercent}%`}
                    size="small"
                    sx={{
                      backgroundColor: expenseChangePercent < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(220, 38, 38, 0.2)',
                      color: expenseChangePercent < 0 ? '#10B981' : '#DC2626',
                      fontWeight: 600,
                      border: `1px solid ${expenseChangePercent < 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
                      '& .MuiChip-icon': {
                        color: expenseChangePercent < 0 ? '#10B981' : '#DC2626',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
                    {expenseChange < 0 ? '' : '+'}${Math.abs(expenseChange).toLocaleString()} from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Expense Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            sx={{
              background: 'rgba(20, 25, 50, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(0, 212, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#E8EAF0' }}>
                    {expensePercentage.toFixed(0)}%
                  </Typography>
                  <Box
                    sx={{
                      width: 1,
                      height: 32,
                      backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    }}
                  />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#8B8FA3', display: 'block' }}>
                      Remaining Balance
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                      ${(totalBalance - Math.abs(totalExpense)).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(expensePercentage, 100)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  mb: 2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: 'linear-gradient(90deg, #00D4FF 0%, #0EA5E9 100%)',
                    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 500 }}>
                  {expensePercentage < 50 ? 'Great!' : expensePercentage < 75 ? 'Good' : 'Watch out!'} You've spent {expensePercentage.toFixed(0)}% of your balance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Main Content Area */}
      <Box
        component="section"
        aria-label="Financial Details"
        sx={{
          background: 'rgba(15, 18, 41, 0.8)',
          borderTopLeftRadius: { xs: 32, md: 40 },
          borderTopRightRadius: { xs: 32, md: 40 },
          minHeight: 'calc(100vh - 400px)',
          p: { xs: 3, md: 4 },
          pt: { xs: 4, md: 5 },
        }}
      >
        {/* Savings Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              mb: 4,
              border: '1px solid rgba(0, 212, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, alignItems: 'center' }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      background: 'rgba(0, 212, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgba(0, 212, 255, 0.3)',
                      mx: { xs: 'auto', md: 0 },
                      mb: 2,
                    }}
                  >
                    <Box sx={{ color: '#00D4FF', fontSize: 48 }}>{savingsGoal.icon}</Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#E8EAF0',
                      fontWeight: 600,
                    }}
                  >
                    {savingsGoal.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#8B8FA3',
                      mt: 0.5,
                    }}
                  >
                    ${savingsGoal.current.toLocaleString()} of ${savingsGoal.target.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(0, 212, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <ArrowUpward sx={{ fontSize: 24, color: '#10B981' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#8B8FA3', fontWeight: 500 }}>
                      Revenue Last Week
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 700 }}>
                    ${weeklyStats.revenue.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(139, 92, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Restaurant sx={{ fontSize: 24, color: '#F59E0B' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#8B8FA3', fontWeight: 500 }}>
                      Food Last Week
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                    {weeklyStats.food < 0 ? '-' : ''}${Math.abs(weeklyStats.food).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Period Selector */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <Box
              key={period}
              component="button"
              aria-label={`View ${period} data`}
              aria-pressed={selectedPeriod === period}
              onClick={() => setSelectedPeriod(period)}
              sx={{
                px: 5,
                py: 2,
                borderRadius: 3,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
                border: 'none',
                outline: 'none',
                ...(selectedPeriod === period
                  ? {
                      background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                      color: '#0A0E27',
                      boxShadow: '0 4px 16px rgba(0, 212, 255, 0.4)',
                    }
                  : {
                      background: 'rgba(0, 212, 255, 0.1)',
                      color: '#00D4FF',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    }),
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: selectedPeriod === period
                    ? '0 6px 20px rgba(0, 212, 255, 0.5)'
                    : '0 4px 16px rgba(0, 212, 255, 0.3)',
                },
                '&:focus-visible': {
                  outline: '2px solid #00D4FF',
                  outlineOffset: '2px',
                },
              }}
            >
              {period}
            </Box>
          ))}
        </Box>

        {/* Transactions List */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#E8EAF0',
              mb: 3,
            }}
          >
            Recent Transactions
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'rgba(20, 25, 50, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 212, 255, 0.15)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${transaction.color}20 0%, ${transaction.color}10 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: transaction.color,
                          border: `1px solid ${transaction.color}30`,
                          flexShrink: 0,
                        }}
                      >
                        {transaction.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#E8EAF0',
                            mb: 0.5,
                          }}
                        >
                          {transaction.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#8B8FA3',
                          }}
                        >
                          {transaction.date}
                        </Typography>
                        <Chip
                          label={transaction.category}
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor: `${transaction.color}15`,
                            color: transaction.color,
                            border: `1px solid ${transaction.color}30`,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: transaction.type === 'income' ? '#10B981' : '#E8EAF0',
                          }}
                        >
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* View All Transactions Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Box
            component="button"
            aria-label="View all transactions"
            onClick={() => onNavigate('transactions')}
            sx={{
              px: 6,
              py: 2.5,
              borderRadius: 3,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                color: '#0A0E27',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
              },
              '&:focus-visible': {
                outline: '2px solid #00D4FF',
                outlineOffset: '2px',
              },
            }}
          >
            View All Transactions
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
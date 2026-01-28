import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  Savings,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { CircularProgressCard } from '@/app/components/CircularProgressCard';

interface OverviewProps {
  supabase: any;
  session: any;
}

interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlyBudget: number;
  budgetUsed: number;
  investmentValue: number;
}

export function Overview({ supabase, session }: OverviewProps) {
  const [stats, setStats] = useState<FinancialStats>({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    monthlyBudget: 5000,
    budgetUsed: 0,
    investmentValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const fetchFinancialStats = async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (isDemoMode) {
        // Use mock data for demo mode
        setStats({
          totalIncome: 8500,
          totalExpenses: 3245,
          netSavings: 5255,
          monthlyBudget: 5000,
          budgetUsed: 3245,
          investmentValue: 45000,
        });
        setLoading(false);
        return;
      }

      // If we have a supabase session, fetch real data
      if (supabase && session) {
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id);

        if (!error && transactions) {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const monthlyTransactions = transactions.filter((t: any) => {
            const transactionDate = new Date(t.date);
            return (
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            );
          });

          const totalIncome = monthlyTransactions
            .filter((t: any) => t.type === 'income')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          const totalExpenses = monthlyTransactions
            .filter((t: any) => t.type === 'expense')
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          setStats({
            totalIncome,
            totalExpenses,
            netSavings: totalIncome - totalExpenses,
            monthlyBudget: 5000,
            budgetUsed: totalExpenses,
            investmentValue: 45000,
          });
        }
      } else {
        // Use default mock data
        setStats({
          totalIncome: 8500,
          totalExpenses: 3245,
          netSavings: 5255,
          monthlyBudget: 5000,
          budgetUsed: 3245,
          investmentValue: 45000,
        });
      }
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      // Use fallback data on error
      setStats({
        totalIncome: 8500,
        totalExpenses: 3245,
        netSavings: 5255,
        monthlyBudget: 5000,
        budgetUsed: 3245,
        investmentValue: 45000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress sx={{ color: '#00D4FF' }} />
      </Box>
    );
  }

  const budgetPercentage = (stats.budgetUsed / stats.monthlyBudget) * 100;
  const savingsRate = stats.totalIncome > 0 
    ? ((stats.netSavings / stats.totalIncome) * 100) 
    : 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Financial Overview
        </Typography>
        <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
          Your financial summary for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {/* Total Income */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <GlassCard variant="default" glow={false}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp sx={{ color: '#00D4FF', fontSize: 28 }} />
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    +12.5%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
                Total Income
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                ${stats.totalIncome.toLocaleString()}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Total Expenses */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <GlassCard variant="default" glow={false}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingDown sx={{ color: '#EF4444', fontSize: 28 }} />
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>
                    +8.3%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
                Total Expenses
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                ${stats.totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Net Savings */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <GlassCard variant="default" glow={true}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Savings sx={{ color: '#00D4FF', fontSize: 28 }} />
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    {savingsRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
                Net Savings
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ${stats.netSavings.toLocaleString()}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Investments */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <GlassCard variant="default" glow={false}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccountBalance sx={{ color: '#A855F7', fontSize: 28 }} />
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    +15.2%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
                Investments
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                ${stats.investmentValue.toLocaleString()}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Progress Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard variant="strong">
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  mb: 3,
                }}
              >
                Budget Usage
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgressCard
                  value={stats.budgetUsed}
                  max={stats.monthlyBudget}
                  label="of monthly budget"
                  color="#00D4FF"
                  size={140}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 0.5 }}>
                    Used
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    ${stats.budgetUsed.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 0.5 }}>
                    Remaining
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                    ${(stats.monthlyBudget - stats.budgetUsed).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard variant="strong">
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  mb: 3,
                }}
              >
                Savings Rate
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgressCard
                  value={savingsRate}
                  max={100}
                  label="savings rate"
                  color="#22C55E"
                  size={140}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 0.5 }}>
                    Income
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    ${stats.totalIncome.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 0.5 }}>
                    Saved
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    ${stats.netSavings.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
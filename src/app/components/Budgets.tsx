import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';

interface BudgetsProps {
  supabase: any;
  session: any;
}

export function Budgets({ supabase, session }: BudgetsProps) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Other',
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (isDemoMode) {
        // Use mock data for demo mode
        const mockBudgets = [
          {
            id: '1',
            category: 'Food & Dining',
            amount: 600,
            spent: 450,
            period: 'monthly',
          },
          {
            id: '2',
            category: 'Transportation',
            amount: 300,
            spent: 280,
            period: 'monthly',
          },
          {
            id: '3',
            category: 'Entertainment',
            amount: 200,
            spent: 150,
            period: 'monthly',
          },
          {
            id: '4',
            category: 'Shopping',
            amount: 400,
            spent: 425,
            period: 'monthly',
          },
        ];
        
        setBudgets(mockBudgets);
        setLoading(false);
        return;
      }

      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/budgets`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    try {
      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/budgets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setDialogOpen(false);
        setFormData({
          category: '',
          amount: '',
          period: 'monthly',
        });
        fetchBudgets();
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const calculateProgress = (budget: any) => {
    return (budget.spent / budget.amount) * 100;
  };

  const getBudgetStatus = (budget: any) => {
    const progress = calculateProgress(budget);
    if (progress >= 100) return { color: 'error', label: 'Over Budget', icon: TrendingUp };
    if (progress >= 80) return { color: 'warning', label: 'Near Limit', icon: TrendingUp };
    return { color: 'success', label: 'On Track', icon: TrendingDown };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Budget Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Budget
        </Button>
      </Box>

      {budgets.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Budget Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {overallProgress.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(overallProgress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: overallProgress >= 100 ? '#FF4757' : overallProgress >= 80 ? '#f59e0b' : '#10b981',
                },
              }}
            />
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const progress = calculateProgress(budget);
            const status = getBudgetStatus(budget);
            const StatusIcon = status.icon;
            const remaining = budget.amount - budget.spent;

            return (
              <Card key={budget.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {budget.category}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={status.label}
                        size="small"
                        color={status.color as any}
                        icon={<StatusIcon />}
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        ${budget.spent.toLocaleString()} of ${budget.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progress, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: progress >= 100 ? '#FF4757' : progress >= 80 ? '#f59e0b' : '#10b981',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Remaining
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color={remaining < 0 ? 'error' : 'success.main'}>
                        ${Math.abs(remaining).toLocaleString()}
                        {remaining < 0 && ' over'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Period
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                        {budget.period}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card sx={{ gridColumn: '1 / -1' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary" variant="h6" gutterBottom>
                No budgets yet
              </Typography>
              <Typography color="text.secondary" paragraph>
                Create your first budget to start tracking your spending!
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                Create Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Budget</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Budget Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Period</InputLabel>
            <Select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              label="Period"
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddBudget}
            variant="contained"
            disabled={!formData.category || !formData.amount}
          >
            Create Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

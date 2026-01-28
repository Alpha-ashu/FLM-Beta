import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Add, Edit, Search, FilterList, TrendingUp } from '@mui/icons-material';

interface GoalsProps {
  supabase: any;
  session: any;
}

export function Goals({ supabase, session }: GoalsProps) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (isDemoMode) {
        // Use mock data for demo mode
        const mockGoals = [
          {
            id: '1',
            name: 'Emergency Fund',
            description: 'Build a 6-month emergency fund for financial security',
            targetAmount: 30000,
            currentAmount: 15000,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            name: 'Vacation to Europe',
            description: 'Save for a dream vacation to Europe next summer',
            targetAmount: 5000,
            currentAmount: 2500,
            deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            name: 'House Down Payment',
            description: 'Save 20% down payment for first home',
            targetAmount: 80000,
            currentAmount: 25000,
            deadline: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setGoals(mockGoals);
        setLoading(false);
        return;
      }

      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/goals`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/goals`,
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
          name: '',
          targetAmount: '',
          deadline: '',
          description: '',
        });
        fetchGoals();
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const calculateProgress = (goal: any) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const calculateMonthsRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
    return Math.max(0, months);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const progress = calculateProgress(goal);
    if (filterStatus === 'completed') return progress >= 100;
    if (filterStatus === 'in_progress') return progress > 0 && progress < 100;
    if (filterStatus === 'not_started') return progress === 0;
    
    return matchesSearch;
  });

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'success';
    if (progress > 0) return 'warning';
    return 'default';
  };

  const getStatusLabel = (progress: number) => {
    if (progress >= 100) return 'Completed';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  };

  return (
    <Box>
      {/* Header with Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Financial Goals
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Goal
          </Button>
        </Box>

        {/* Search and Filter Controls */}
        <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  '&:hover': {
                    border: '1px solid #CBD5E1',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #3B82F6',
                  },
                }
              }}
            />
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status Filter"
                sx={{
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  '&:hover': {
                    border: '1px solid #CBD5E1',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #3B82F6',
                  },
                }}
              >
                <MenuItem value="all">All Goals</MenuItem>
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                icon={<TrendingUp />}
                label={`${goals.length} total`}
                variant="outlined"
              />
              <Chip
                label={`${filteredGoals.filter(g => calculateProgress(g) === 0).length} not started`}
                color="default"
                variant="outlined"
              />
              <Chip
                label={`${filteredGoals.filter(g => calculateProgress(g) > 0 && calculateProgress(g) < 100).length} in progress`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`${filteredGoals.filter(g => calculateProgress(g) >= 100).length} completed`}
                color="success"
                variant="outlined"
              />
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = calculateProgress(goal);
            const monthsRemaining = calculateMonthsRemaining(goal.deadline);
            const monthlyRequired = monthsRemaining > 0 
              ? (goal.targetAmount - goal.currentAmount) / monthsRemaining 
              : 0;

            return (
              <Card key={goal.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {goal.name}
                    </Typography>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {goal.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(progress, 100)} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Deadline
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Monthly Required
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        ${monthlyRequired.toFixed(0)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {monthsRemaining} months remaining
                  </Typography>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card sx={{ gridColumn: '1 / -1' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary" variant="h6" gutterBottom>
                No goals yet
              </Typography>
              <Typography color="text.secondary" paragraph>
                Start planning your financial future by creating your first goal!
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                Create Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Financial Goal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Goal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
          />

          <TextField
            fullWidth
            label="Target Amount"
            type="number"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            placeholder="Why is this goal important to you?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddGoal}
            variant="contained"
            disabled={!formData.name || !formData.targetAmount || !formData.deadline}
          >
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

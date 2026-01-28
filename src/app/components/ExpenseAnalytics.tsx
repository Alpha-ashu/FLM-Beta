import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CalendarToday,
} from '@mui/icons-material';

interface ExpenseAnalyticsProps {
  supabase: any;
  session: any;
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

const categoryData = [
  { name: 'Food & Dining', value: 1250, color: '#6366f1' },
  { name: 'Transportation', value: 680, color: '#ec4899' },
  { name: 'Shopping', value: 920, color: '#10b981' },
  { name: 'Entertainment', value: 450, color: '#f59e0b' },
  { name: 'Utilities', value: 380, color: '#3b82f6' },
  { name: 'Healthcare', value: 280, color: '#ef4444' },
  { name: 'Other', value: 340, color: '#8b5cf6' },
];

const monthlyData = [
  { month: 'Jan', expenses: 3200, income: 5000 },
  { month: 'Feb', expenses: 2800, income: 5000 },
  { month: 'Mar', expenses: 3500, income: 5200 },
  { month: 'Apr', expenses: 3100, income: 5000 },
  { month: 'May', expenses: 4200, income: 5500 },
  { month: 'Jun', expenses: 3800, income: 5000 },
];

const trendData = [
  { date: 'Week 1', amount: 850 },
  { date: 'Week 2', amount: 920 },
  { date: 'Week 3', amount: 780 },
  { date: 'Week 4', amount: 1050 },
  { date: 'Week 5', amount: 890 },
];

export function ExpenseAnalytics({ supabase, session }: ExpenseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('month');

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);
  const avgDaily = totalExpenses / 30;
  const trend = ((trendData[trendData.length - 1].amount - trendData[0].amount) / trendData[0].amount) * 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Expense Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalance sx={{ color: 'white', mr: 1 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Total Expenses
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                ${totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Avg. Daily
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ${avgDaily.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {trend >= 0 ? (
                  <TrendingUp sx={{ color: 'error.main', mr: 1 }} />
                ) : (
                  <TrendingDown sx={{ color: 'success.main', mr: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  Trend
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: trend >= 0 ? 'error.main' : 'success.main'
                }}
              >
                {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Top Category
              </Typography>
              <Chip 
                label={categoryData[0].name}
                sx={{ 
                  bgcolor: categoryData[0].color,
                  color: 'white',
                  fontWeight: 600,
                  mb: 1
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ${categoryData[0].value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Category Breakdown - Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Expenses by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  {categoryData.map((item, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: item.color, 
                            mr: 1 
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Comparison - Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Monthly Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Spending Trend - Line Chart */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Spending Trend (Weekly)
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    name="Expenses"
                    dot={{ fill: '#6366f1', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Details */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category Breakdown
              </Typography>
              <Box>
                {categoryData.map((category, index) => {
                  const percentage = (category.value / totalExpenses) * 100;
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{category.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${category.value} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: 'grey.200', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: `${percentage}%`, 
                            height: '100%', 
                            bgcolor: category.color,
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
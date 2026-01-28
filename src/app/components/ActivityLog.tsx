import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Timeline,
  AccountBalance,
  TrendingUp,
  Receipt,
  People,
  CheckCircle,
  Edit,
  Delete,
  Add,
  Paid,
  Groups as GroupsIcon,
  Notifications,
  Settings,
  Search,
  FilterList,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityLogProps {
  supabase: any;
  session: any;
}

interface Activity {
  id: string;
  type: 'transaction' | 'goal' | 'expense' | 'group' | 'settlement' | 'budget' | 'report' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'paid' | 'joined' | 'left';
  title: string;
  description: string;
  amount?: number;
  timestamp: Date;
  user?: string;
}

export function ActivityLog({ supabase, session }: ActivityLogProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'expense',
      action: 'created',
      title: 'Dinner at Italian Restaurant',
      description: 'Added expense split with John, Sarah, and Mike',
      amount: 120.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      type: 'settlement',
      action: 'paid',
      title: 'Settlement Payment',
      description: 'Sarah settled up $125.50',
      amount: 125.50,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: 'Sarah Johnson',
    },
    {
      id: '3',
      type: 'transaction',
      action: 'created',
      title: 'Income Added',
      description: 'Salary deposit from ABC Corp',
      amount: 5000.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: '4',
      type: 'budget',
      action: 'updated',
      title: 'Budget Alert',
      description: 'Dining budget exceeded by $50',
      amount: 50.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      id: '5',
      type: 'goal',
      action: 'updated',
      title: 'Emergency Fund Goal',
      description: 'Reached 80% of target amount',
      amount: 4000.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '6',
      type: 'group',
      action: 'joined',
      title: 'Weekend Trip Group',
      description: 'Mike added you to the group',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      user: 'Mike Chen',
    },
    {
      id: '7',
      type: 'expense',
      action: 'created',
      title: 'Movie Tickets',
      description: 'Split equally with 3 friends',
      amount: 60.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: '8',
      type: 'transaction',
      action: 'created',
      title: 'Grocery Shopping',
      description: 'Whole Foods Market',
      amount: 150.75,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    },
    {
      id: '9',
      type: 'goal',
      action: 'created',
      title: 'Vacation Fund',
      description: 'New savings goal created for $10,000',
      amount: 10000.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: '10',
      type: 'report',
      action: 'created',
      title: 'Monthly Report',
      description: 'Financial summary for October 2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: '11',
      type: 'expense',
      action: 'deleted',
      title: 'Duplicate Expense',
      description: 'Removed duplicate transaction',
      amount: 25.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
    {
      id: '12',
      type: 'settlement',
      action: 'completed',
      title: 'Payment to John',
      description: 'Settled $78.25 via PayPal',
      amount: 78.25,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      user: 'John Smith',
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <AccountBalance />;
      case 'goal':
        return <TrendingUp />;
      case 'expense':
        return <Receipt />;
      case 'group':
        return <GroupsIcon />;
      case 'settlement':
        return <Paid />;
      case 'budget':
        return <AccountBalance />;
      case 'report':
        return <Notifications />;
      case 'system':
        return <Settings />;
      default:
        return <Timeline />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return '#00D4FF';
      case 'goal':
        return '#10b981';
      case 'expense':
        return '#f59e0b';
      case 'group':
        return '#8b5cf6';
      case 'settlement':
        return '#ec4899';
      case 'budget':
        return '#3b82f6';
      case 'report':
        return '#6366f1';
      case 'system':
        return '#64748b';
      default:
        return '#00D4FF';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Created';
      case 'updated':
        return 'Updated';
      case 'deleted':
        return 'Deleted';
      case 'completed':
        return 'Completed';
      case 'paid':
        return 'Paid';
      case 'joined':
        return 'Joined';
      case 'left':
        return 'Left';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
      case 'joined':
        return '#10b981';
      case 'updated':
        return '#00D4FF';
      case 'deleted':
      case 'left':
        return '#FF4757';
      case 'completed':
      case 'paid':
        return '#8b5cf6';
      default:
        return '#8B8FA3';
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(activity.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Timeline sx={{ color: '#00D4FF' }} />
        Activity Log
      </Typography>

      <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#00D4FF' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterList sx={{ color: '#8B8FA3' }} />
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#8B8FA3',
                  borderColor: 'rgba(0, 212, 255, 0.2)',
                  px: 2,
                  '&.Mui-selected': {
                    color: '#00D4FF',
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderColor: '#00D4FF',
                  },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="transaction">Transactions</ToggleButton>
              <ToggleButton value="expense">Expenses</ToggleButton>
              <ToggleButton value="goal">Goals</ToggleButton>
              <ToggleButton value="settlement">Settlements</ToggleButton>
              <ToggleButton value="group">Groups</ToggleButton>
              <ToggleButton value="budget">Budgets</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {Object.entries(groupedActivities).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Timeline sx={{ fontSize: 64, color: '#8B8FA3', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No activities found
            </Typography>
          </Box>
        ) : (
          <Box>
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <Box key={date} sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#00D4FF',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {getDateLabel(date)}
                  <Divider sx={{ flexGrow: 1, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
                </Typography>

                <List sx={{ p: 0 }}>
                  {dayActivities.map((activity, index) => (
                    <Box key={activity.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: { xs: 1, md: 2 },
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            background: 'rgba(0, 212, 255, 0.05)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              background: `${getActivityColor(activity.type)}20`,
                              color: getActivityColor(activity.type),
                            }}
                          >
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primaryTypographyProps={{ component: 'div' }}
                          secondaryTypographyProps={{ component: 'div' }}
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {activity.title}
                              </Typography>
                              <Chip
                                label={getActionLabel(activity.action)}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  background: `${getActionColor(activity.action)}20`,
                                  color: getActionColor(activity.action),
                                  border: `1px solid ${getActionColor(activity.action)}40`,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {activity.description}
                                {activity.user && ` by ${activity.user}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                              </Typography>
                            </Box>
                          }
                        />

                        {activity.amount !== undefined && (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color:
                                activity.type === 'transaction' && activity.action === 'created'
                                  ? '#10b981'
                                  : activity.type === 'settlement' && activity.action === 'paid'
                                  ? '#10b981'
                                  : '#E8EAF0',
                            }}
                          >
                            ${activity.amount.toLocaleString()}
                          </Typography>
                        )}
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}
      </GlassCard>
    </Box>
  );
}
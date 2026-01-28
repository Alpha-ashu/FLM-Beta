import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Badge,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Warning,
  Info,
  Error as ErrorIcon,
  TrendingUp,
  AccountBalance,
  People,
  Assignment,
  MoreVert,
  Delete,
  DoneAll,
  FilterList,
  Circle,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsCenterProps {
  supabase: any;
  session: any;
}

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'transaction' | 'goal' | 'budget' | 'expense' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
}

export function NotificationsCenter({ supabase, session }: NotificationsCenterProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'success',
      category: 'goal',
      title: 'Goal Achievement',
      message: 'Congratulations! You\'ve reached 80% of your Emergency Fund goal.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      actionable: true,
    },
    {
      id: '2',
      type: 'warning',
      category: 'budget',
      title: 'Budget Alert',
      message: 'You\'ve spent 90% of your monthly dining budget.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionable: true,
    },
    {
      id: '3',
      type: 'info',
      category: 'expense',
      title: 'Expense Split',
      message: 'John added you to a new expense "Dinner at Italian Restaurant" - $45.00',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: false,
      actionable: true,
    },
    {
      id: '4',
      type: 'success',
      category: 'transaction',
      title: 'Payment Received',
      message: 'Sarah settled up $125.50 for "Weekend Trip"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      read: true,
    },
    {
      id: '5',
      type: 'info',
      category: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly financial summary is now available.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      actionable: true,
    },
    {
      id: '6',
      type: 'warning',
      category: 'budget',
      title: 'Budget Exceeded',
      message: 'Your Entertainment budget has exceeded by $50 this month.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: '7',
      type: 'info',
      category: 'social',
      title: 'Friend Request',
      message: 'Mike wants to connect with you on FinanceLife.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      read: true,
      actionable: true,
    },
    {
      id: '8',
      type: 'success',
      category: 'goal',
      title: 'Milestone Reached',
      message: 'You\'ve saved $5,000 towards your Vacation Fund!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      read: true,
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'warning':
        return <Warning sx={{ color: '#f59e0b' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#FF4757' }} />;
      default:
        return <Info sx={{ color: '#00D4FF' }} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction':
        return <AccountBalance />;
      case 'goal':
        return <TrendingUp />;
      case 'budget':
        return <Assignment />;
      case 'expense':
        return <AccountBalance />;
      case 'social':
        return <People />;
      default:
        return <Info />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#FF4757';
      default:
        return '#00D4FF';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setAnchorEl(null);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 0) {
      // All
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.read;
      return notif.category === filter;
    } else if (activeTab === 1) {
      // Unread
      return !notif.read;
    } else {
      // Read
      return notif.read;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <Notifications sx={{ fontSize: 32, color: '#00D4FF' }} />
          </Badge>
          Notifications
        </Typography>
        
        {unreadCount > 0 && (
          <IconButton
            onClick={handleMarkAllAsRead}
            sx={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.2)',
              },
            }}
          >
            <DoneAll />
          </IconButton>
        )}
      </Box>

      <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: 'rgba(0, 212, 255, 0.1)',
              '& .MuiTab-root': {
                color: '#8B8FA3',
                '&.Mui-selected': {
                  color: '#00D4FF',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00D4FF',
              },
            }}
          >
            <Tab 
              label={
                <Badge badgeContent={notifications.length} color="primary">
                  All
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Unread
                </Badge>
              } 
            />
            <Tab label="Read" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterList sx={{ color: '#8B8FA3', mr: 1 }} />
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: '#8B8FA3',
                    borderColor: 'rgba(0, 212, 255, 0.2)',
                    '&.Mui-selected': {
                      color: '#00D4FF',
                      background: 'rgba(0, 212, 255, 0.1)',
                      borderColor: '#00D4FF',
                    },
                  },
                }}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="unread">Unread</ToggleButton>
                <ToggleButton value="transaction">Transactions</ToggleButton>
                <ToggleButton value="goal">Goals</ToggleButton>
                <ToggleButton value="budget">Budgets</ToggleButton>
                <ToggleButton value="expense">Expenses</ToggleButton>
                <ToggleButton value="social">Social</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </Box>

        {filteredNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Notifications sx={{ fontSize: 64, color: '#8B8FA3', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: { xs: 1, md: 2 },
                    background: !notification.read
                      ? 'rgba(0, 212, 255, 0.05)'
                      : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                    position: 'relative',
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.1)',
                    },
                  }}
                >
                  {!notification.read && (
                    <Circle
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 10,
                        color: '#00D4FF',
                      }}
                    />
                  )}
                  
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${getTypeColor(notification.type)}20, ${getTypeColor(notification.type)}40)`,
                        color: getTypeColor(notification.type),
                      }}
                    >
                      {getCategoryIcon(notification.category)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                        {getTypeIcon(notification.type)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </Typography>
                          {notification.actionable && (
                            <Chip
                              label="Actionable"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                background: 'rgba(0, 212, 255, 0.2)',
                                color: '#00D4FF',
                                border: '1px solid rgba(0, 212, 255, 0.3)',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, notification.id)}
                    sx={{ color: '#8B8FA3' }}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItem>
                
                {index < filteredNotifications.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
                )}
              </Box>
            ))}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(20, 25, 50, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            },
          }}
        >
          <MenuItem
            onClick={() => selectedNotification && handleMarkAsRead(selectedNotification)}
          >
            <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
            Mark as Read
          </MenuItem>
          <MenuItem
            onClick={() => selectedNotification && handleDelete(selectedNotification)}
            sx={{ color: '#FF4757' }}
          >
            <Delete sx={{ mr: 1, fontSize: 20 }} />
            Delete
          </MenuItem>
        </Menu>
      </GlassCard>
    </Box>
  );
}

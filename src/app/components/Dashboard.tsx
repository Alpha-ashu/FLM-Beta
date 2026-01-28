import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance,
  TrendingUp,
  Assignment,
  SmartToy,
  People,
  Logout,
  Add,
  Calculate,
  Business,
  Groups as GroupsIcon,
  Receipt,
  BarChart,
  Notifications as NotificationsIcon,
  Settings,
  MonetizationOn,
  PersonAdd,
  Paid,
  Timeline,
  CreditCard,
  CalendarToday,
  AccountBalanceWallet,
  SwapHoriz,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Overview } from './Overview';
import { Transactions } from './Transactions';
import { Goals } from './Goals';
import { Reports } from './Reports';
import { AIAssistant } from './AIAssistant';
import { Consultants } from './Consultants';
import { Calculators } from './Calculators';
import { CurrencySelector } from './CurrencySelector';
import { ModernOverview } from './ModernOverview';
import { EnhancedDashboard } from './EnhancedDashboard';
import { EnhancedGroups } from './EnhancedGroups';
import { ExpenseSplitting } from './ExpenseSplitting';
import { ExpenseAnalytics } from './ExpenseAnalytics';
import { Profile } from './Profile';
import { NotificationsCenter } from './NotificationsCenter';
import { Budgets } from './Budgets';
import { EnhancedFriends } from './EnhancedFriends';
import { Settlements } from './Settlements';
import { ActivityLog } from './ActivityLog';
import { AdvisorClients } from './AdvisorClients';
import { FirstTimeTooltip } from './FirstTimeTooltip';
import { AccountsManager } from './AccountsManager';
import { LoanTracker } from './LoanTracker';
import { PaymentCalendar } from './PaymentCalendar';
import { NotificationSettingsPage } from './NotificationSettingsPage';
import { LendBorrow } from './LendBorrow';
import { InvestmentTracker } from './InvestmentTracker';
import { TaxCalculator } from './TaxCalculator';
import { UserProfile } from './UserProfile';
import { BookingManagement } from './BookingManagement';
import { Reviews } from './Reviews';

interface DashboardProps {
  supabase: any;
  session: any;
}

export function Dashboard({ supabase, session }: DashboardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  // Get user role from session
  const userRole = session?.user?.user_metadata?.role || 'user';
  const isAdvisor = userRole === 'advisor';

  // Menu items grouped by category for regular users
  const userMenuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
      ],
    },
    {
      title: 'Accounts & Loans',
      items: [
        { id: 'accounts', label: 'My Accounts', icon: <AccountBalanceWallet /> },
        { id: 'loans', label: 'Loans & EMIs', icon: <CreditCard /> },
        { id: 'calendar', label: 'Payment Calendar', icon: <CalendarToday /> },
      ],
    },
    {
      title: 'Finance',
      items: [
        { id: 'transactions', label: 'Transactions', icon: <AccountBalance /> },
        { id: 'investments', label: 'Investments', icon: <TrendingUp /> },
        { id: 'budgets', label: 'Budgets', icon: <MonetizationOn /> },
        { id: 'goals', label: 'Goals', icon: <TrendingUp /> },
        { id: 'lend_borrow', label: 'Lend & Borrow', icon: <SwapHoriz /> },
      ],
    },
    {
      title: 'Social',
      items: [
        { id: 'friends', label: 'Friends', icon: <PersonAdd /> },
        { id: 'groups', label: 'Groups', icon: <GroupsIcon /> },
        { id: 'expense_splitting', label: 'Split Expenses', icon: <Receipt /> },
        { id: 'settlements', label: 'Settlements', icon: <Paid /> },
      ],
    },
    {
      title: 'Tools',
      items: [
        { id: 'calculators', label: 'Calculators', icon: <Calculate /> },
        { id: 'tax_calculator', label: 'Tax Calculator', icon: <Calculate /> },
        { id: 'expense_analytics', label: 'Analytics', icon: <BarChart /> },
        { id: 'reports', label: 'Reports', icon: <Assignment /> },
      ],
    },
    {
      title: 'Help',
      items: [
        { id: 'ai', label: 'AI Assistant', icon: <SmartToy /> },
        { id: 'consultants', label: 'Consultants', icon: <Business /> },
      ],
    },
    {
      title: 'Settings',
      items: [
        { id: 'notification_settings', label: 'Notifications', icon: <NotificationsIcon /> },
      ],
    },
  ];

  // Menu items for financial advisors
  const advisorMenuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
      ],
    },
    {
      title: 'Clients',
      items: [
        { id: 'clients', label: 'My Clients', icon: <People /> },
      ],
    },
    {
      title: 'Tools',
      items: [
        { id: 'calculators', label: 'Calculators', icon: <Calculate /> },
        { id: 'reports', label: 'Reports', icon: <Assignment /> },
        { id: 'ai', label: 'AI Assistant', icon: <SmartToy /> },
      ],
    },
  ];

  const menuGroups = isAdvisor ? advisorMenuGroups : userMenuGroups;

  const handleLogout = async () => {
    // Check if in demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoMode) {
      // Clear demo mode
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_user');
      window.location.reload();
    } else {
      await supabase.auth.signOut();
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <ModernOverview supabase={supabase} session={session} onNavigate={setActiveView} />;
      case 'accounts':
        return <AccountsManager supabase={supabase} session={session} />;
      case 'loans':
        return <LoanTracker supabase={supabase} session={session} />;
      case 'calendar':
        return <PaymentCalendar supabase={supabase} session={session} />;
      case 'transactions':
        return <Transactions supabase={supabase} session={session} />;
      case 'investments':
        return <InvestmentTracker supabase={supabase} session={session} />;
      case 'goals':
        return <Goals supabase={supabase} session={session} />;
      case 'lend_borrow':
        return <LendBorrow supabase={supabase} session={session} />;
      case 'calculators':
        return <Calculators supabase={supabase} session={session} />;
      case 'tax_calculator':
        return <TaxCalculator supabase={supabase} session={session} />;
      case 'reports':
        return <Reports supabase={supabase} session={session} />;
      case 'ai':
        return <AIAssistant supabase={supabase} session={session} />;
      case 'consultants':
        return <Consultants supabase={supabase} session={session} />;
      case 'clients':
        return <AdvisorClients supabase={supabase} session={session} />;
      case 'groups':
        return <EnhancedGroups supabase={supabase} session={session} />;
      case 'expense_splitting':
      case 'split':
        return <ExpenseSplitting supabase={supabase} session={session} />;
      case 'expense_analytics':
      case 'analytics':
        return <ExpenseAnalytics supabase={supabase} session={session} />;
      case 'profile':
        return <Profile supabase={supabase} session={session} />;
      case 'notifications':
        return <NotificationsCenter supabase={supabase} session={session} />;
      case 'notification_settings':
        return <NotificationSettingsPage supabase={supabase} session={session} />;
      case 'budgets':
        return <Budgets supabase={supabase} session={session} />;
      case 'friends':
        return <EnhancedFriends supabase={supabase} session={session} />;
      case 'settlements':
        return <Settlements supabase={supabase} session={session} />;
      case 'activity':
        return <ActivityLog supabase={supabase} session={session} />;
      case 'user_profile':
        return <UserProfile supabase={supabase} session={session} />;
      default:
        return <EnhancedDashboard supabase={supabase} session={session} onNavigate={setActiveView} />;
    }
  };

  // Mobile bottom navigation
  const renderBottomNav = () => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', sm: 'none' },
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          maxWidth: '480px',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            p: 1.5,
            borderRadius: 8,
            background: activeView === 'overview' ? '#E5E7EB' : 'transparent',
            color: activeView === 'overview' ? '#3B82F6' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: activeView === 'overview' ? '#CBD5E1' : '#F8FAFC',
              transform: activeView !== 'overview' ? 'translateY(-2px)' : 'none',
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
          }}
          onClick={() => setActiveView('overview')}
        >
          <DashboardIcon sx={{ fontSize: 24 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
            Home
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            p: 1.5,
            borderRadius: 8,
            background: activeView === 'transactions' ? '#E5E7EB' : 'transparent',
            color: activeView === 'transactions' ? '#3B82F6' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: activeView === 'transactions' ? '#CBD5E1' : '#F8FAFC',
              transform: activeView !== 'transactions' ? 'translateY(-2px)' : 'none',
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
          }}
          onClick={() => setActiveView('transactions')}
        >
          <Receipt sx={{ fontSize: 24 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
            Expenses
          </Typography>
        </Box>

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid #E5E7EB',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#2563EB',
              border: '2px solid #CBD5E1',
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
          onClick={() => setActiveView('split')}
        >
          <Add sx={{ color: 'white', fontSize: 32, fontWeight: 700 }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            p: 1.5,
            borderRadius: 8,
            background: activeView === 'analytics' ? '#E5E7EB' : 'transparent',
            color: activeView === 'analytics' ? '#3B82F6' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: activeView === 'analytics' ? '#CBD5E1' : '#F8FAFC',
              transform: activeView !== 'analytics' ? 'translateY(-2px)' : 'none',
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
          }}
          onClick={() => setActiveView('analytics')}
        >
          <BarChart sx={{ fontSize: 24 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
            Analytics
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            p: 1.5,
            borderRadius: 8,
            background: activeView === 'calendar' ? '#E5E7EB' : 'transparent',
            color: activeView === 'calendar' ? '#3B82F6' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: activeView === 'calendar' ? '#CBD5E1' : '#F8FAFC',
              transform: activeView !== 'calendar' ? 'translateY(-2px)' : 'none',
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
          }}
          onClick={() => setActiveView('calendar')}
        >
          <CalendarToday sx={{ fontSize: 24 }} />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
            Calendar
          </Typography>
        </Box>

      </Box>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        flexDirection: 'column',
        background: '#F8FAFC',
        position: 'relative',
      }}
    >
      {/* First Time Tooltip */}
      <FirstTimeTooltip userId={session?.user?.id} />

      {/* Top AppBar with Clean Design */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          color: '#1E293B',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              background: '#3B82F6',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': {
                background: '#2563EB',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: '#3B82F6',
              borderRadius: 8,
              px: 2,
              py: 1,
              mr: 2,
            }}
          >
            <AccountBalance sx={{ mr: 1, color: 'white', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', letterSpacing: '0.5px' }}>
              FinanceLife
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {isAdvisor && (
            <Chip 
              icon={<Business />} 
              label="Advisor" 
              sx={{ 
                mr: 2, 
                background: '#E5E7EB',
                color: '#1E293B',
                fontWeight: 600,
                display: { xs: 'none', md: 'flex' },
                px: 2,
                height: 32,
                '& .MuiChip-icon': {
                  color: '#3B82F6',
                },
              }} 
            />
          )}
          <Avatar 
            sx={{ 
              mr: 2, 
              width: 42,
              height: 42,
              background: '#3B82F6',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              },
            }}
            onClick={() => setActiveView('user_profile')}
          >
            {session?.user?.user_metadata?.name?.[0] || session?.user?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<Logout />}
              sx={{
                color: '#1E293B',
                fontWeight: 500,
                px: 2.5,
                py: 1,
                borderRadius: 8,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                '&:hover': {
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            mt: 9,
            background: '#FFFFFF',
            border: 'none',
            borderRight: '1px solid #E2E8F0',
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.05)',
            height: 'calc(100vh - 64px)', // Subtract AppBar height
            overflow: 'hidden', // Prevent double scrollbars
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
        }}
      >
        <Box sx={{ 
          px: 2.5, 
          pt: 3, 
          pb: 2, 
          overflow: 'auto',
          height: '100%',
          maxHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {menuGroups.map((group, groupIndex) => (
            <Box key={group.title} sx={{ mb: groupIndex < menuGroups.length - 1 ? 3.5 : 0 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748B',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  px: 2,
                  display: 'block',
                  mb: 1.5,
                  fontSize: '0.7rem',
                }}
              >
                {group.title}
              </Typography>
              <List sx={{ p: 0 }}>
                {group.items.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeView === item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setDrawerOpen(false);
                      }}
                      sx={{
                        borderRadius: 8,
                        transition: 'all 0.2s ease',
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          background: '#3B82F6',
                          color: 'white',
                          '&:hover': {
                            background: '#2563EB',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 4,
                            height: '70%',
                            background: 'white',
                            borderRadius: '0 4px 4px 0',
                          },
                        },
                        '&:not(.Mui-selected)': {
                          color: '#1E293B',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          '&:hover': {
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            transform: 'translateX(2px)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 42, 
                        color: activeView === item.id ? 'white' : '#3B82F6',
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: activeView === item.id ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            background: '#FFFFFF',
            border: 'none',
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.05)',
            height: '100vh',
            overflow: 'hidden', // Prevent double scrollbars
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          px: 2.5, 
          pt: 2, 
          pb: 2, 
          overflow: 'auto',
          height: '100%',
          maxHeight: '100vh',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {menuGroups.map((group, groupIndex) => (
            <Box key={group.title} sx={{ mb: groupIndex < menuGroups.length - 1 ? 3 : 0 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748B',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  px: 2,
                  display: 'block',
                  mb: 1.5,
                  fontSize: '0.7rem',
                }}
              >
                {group.title}
              </Typography>
              <List sx={{ p: 0 }}>
                {group.items.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeView === item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setDrawerOpen(false);
                      }}
                      sx={{
                        borderRadius: 8,
                        transition: 'all 0.2s ease',
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          background: '#3B82F6',
                          color: 'white',
                          '&:hover': {
                            background: '#2563EB',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                        '&:not(.Mui-selected)': {
                          color: '#1E293B',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          '&:hover': {
                            background: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42, color: activeView === item.id ? 'white' : '#3B82F6' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: activeView === item.id ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
          <Divider sx={{ my: 2, borderColor: '#E2E8F0' }} />
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                borderRadius: 8,
                py: 1.5,
                px: 2,
                color: '#EF4444',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                '&:hover': {
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: '#EF4444' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          pt: { xs: 10, sm: 11 },
          pb: { xs: 10, sm: 3 },
          ml: { xs: 0, sm: '260px' },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: '100%',
          overflow: 'auto',
          minHeight: '100vh',
          background: '#F8FAFC',
        }}
      >
        {renderContent()}
      </Box>

      {/* Mobile Bottom Navigation */}
      {renderBottomNav()}
    </Box>
  );
}
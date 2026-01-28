import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Switch,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Notifications,
  NotificationsActive,
  Payment,
  TrendingUp,
  Warning,
  Info,
  CheckCircle,
} from '@mui/icons-material';

interface NotificationSettings {
  pushEnabled: boolean;
  loanPayments: boolean;
  loanPaymentsDaysBefore: number;
  budgetAlerts: boolean;
  goalMilestones: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  unusualSpending: boolean;
}

interface NotificationSettingsPageProps {
  supabase?: any;
  session?: any;
}

export function NotificationSettingsPage({ supabase, session }: NotificationSettingsPageProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    loanPayments: true,
    loanPaymentsDaysBefore: 1,
    budgetAlerts: true,
    goalMilestones: true,
    weeklyReports: false,
    monthlyReports: true,
    unusualSpending: true,
  });

  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    loadSettings();
    checkNotificationPermission();
  }, []);

  const loadSettings = () => {
    const storedSettings = localStorage.getItem('financelife_notification_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('financelife_notification_settings', JSON.stringify(newSettings));
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        saveSettings({ ...settings, pushEnabled: true });
        
        // Show test notification
        new Notification('FinanceLife Notifications Enabled', {
          body: 'You will now receive payment reminders and financial alerts.',
          icon: '/logo.png',
        });
      }
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from FinanceLife',
        icon: '/logo.png',
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142', mb: 1 }}>
          Notification Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B8FA3' }}>
          Manage how you receive alerts and updates
        </Typography>
      </Box>

      {/* Permission Status */}
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          mb: 3,
          background:
            permissionStatus === 'granted'
              ? 'linear-gradient(135deg, #10E58420 0%, #10E58410 100%)'
              : permissionStatus === 'denied'
              ? 'linear-gradient(135deg, #FF5C7C20 0%, #FF5C7C10 100%)'
              : 'linear-gradient(135deg, #FFB54720 0%, #FFB54710 100%)',
          border:
            permissionStatus === 'granted'
              ? '2px solid #10E584'
              : permissionStatus === 'denied'
              ? '2px solid #FF5C7C'
              : '2px solid #FFB547',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {permissionStatus === 'granted' ? (
            <NotificationsActive sx={{ fontSize: 40, color: '#10E584' }} />
          ) : (
            <Notifications sx={{ fontSize: 40, color: permissionStatus === 'denied' ? '#FF5C7C' : '#FFB547' }} />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              {permissionStatus === 'granted'
                ? 'Notifications Enabled'
                : permissionStatus === 'denied'
                ? 'Notifications Blocked'
                : 'Enable Notifications'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
              {permissionStatus === 'granted'
                ? 'You will receive payment reminders and alerts'
                : permissionStatus === 'denied'
                ? 'Please enable notifications in your browser settings'
                : 'Get timely reminders for payments and financial insights'}
            </Typography>
          </Box>
        </Box>

        {permissionStatus === 'default' && (
          <Button
            variant="contained"
            startIcon={<Notifications />}
            onClick={requestNotificationPermission}
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
            }}
          >
            Enable Push Notifications
          </Button>
        )}

        {permissionStatus === 'granted' && (
          <Button variant="outlined" size="small" onClick={testNotification}>
            Send Test Notification
          </Button>
        )}
      </Card>

      {/* Loan & Payment Notifications */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Payment sx={{ color: '#FF5C7C' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Loan & EMI Payments
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemText
                primary="Payment Reminders"
                secondary="Get notified before your EMI payment due dates"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.loanPayments}
                  onChange={() => handleToggle('loanPayments')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            {settings.loanPayments && (
              <ListItem>
                <ListItemText
                  primary="Reminder Timing"
                  secondary="Choose when to receive payment reminders"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 7].map((days) => (
                    <Chip
                      key={days}
                      label={`${days}d before`}
                      onClick={() => saveSettings({ ...settings, loanPaymentsDaysBefore: days })}
                      sx={{
                        background:
                          settings.loanPaymentsDaysBefore === days
                            ? 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)'
                            : 'rgba(91, 95, 227, 0.1)',
                        color: settings.loanPaymentsDaysBefore === days ? 'white' : '#5B5FE3',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Box>
              </ListItem>
            )}
          </List>
        </Box>
      </Card>

      {/* Budget & Spending Alerts */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Warning sx={{ color: '#FFB547' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Budget & Spending
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemText
                primary="Budget Limit Alerts"
                secondary="Get notified when you approach or exceed budget limits"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.budgetAlerts}
                  onChange={() => handleToggle('budgetAlerts')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Unusual Spending Alerts"
                secondary="Get alerted when spending patterns are unusual"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.unusualSpending}
                  onChange={() => handleToggle('unusualSpending')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Box>
      </Card>

      {/* Goals & Milestones */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircle sx={{ color: '#10E584' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Goals & Achievements
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemText
                primary="Goal Milestones"
                secondary="Celebrate when you reach savings goals and milestones"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.goalMilestones}
                  onChange={() => handleToggle('goalMilestones')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Box>
      </Card>

      {/* Reports & Insights */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUp sx={{ color: '#5B5FE3' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Reports & Insights
            </Typography>
          </Box>

          <List>
            <ListItem>
              <ListItemText
                primary="Weekly Summary"
                secondary="Receive a weekly summary of your spending and savings"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.weeklyReports}
                  onChange={() => handleToggle('weeklyReports')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Monthly Report"
                secondary="Get a detailed monthly financial report"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.monthlyReports}
                  onChange={() => handleToggle('monthlyReports')}
                  disabled={permissionStatus !== 'granted'}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Box>
      </Card>

      {/* Currency Settings */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Info sx={{ color: '#5B5FE3' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Currency Settings
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#8B8FA3', minWidth: 120 }}>
              Default Currency:
            </Typography>
            <CurrencySelector />
          </Box>
        </Box>
      </Card>

      {/* Language Settings */}
      <Card sx={{ borderRadius: 4, mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Info sx={{ color: '#5B5FE3' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
              Language Settings
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#8B8FA3', minWidth: 120 }}>
              Interface Language:
            </Typography>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Card>

      {/* Info Box */}
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          background: 'linear-gradient(135deg, #5B5FE320 0%, #5B5FE310 100%)',
          border: '1px solid #5B5FE330',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Info sx={{ color: '#5B5FE3' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3142', mb: 1 }}>
              About Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
              • Notifications are sent locally from your device
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 1 }}>
              • Your financial data stays private and secure
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
              • You can turn off notifications anytime from browser settings
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

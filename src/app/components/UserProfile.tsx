import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Work,
  School,
  Language,
  Security,
  Notifications,
  Payment,
  History,
  Settings,
  Logout,
  Save,
  Close as CloseIcon,
  CreditCard,
  AccountBalance,
  TrendingUp,
  AttachMoney,
  CurrencyRupee,
  Euro,
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase/info';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  date_of_birth?: string;
  address?: string;
  occupation?: string;
  education?: string;
  languages?: string[];
  currency_preference: string;
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    budget_alerts: boolean;
    investment_updates: boolean;
  };
  security_settings: {
    two_factor_auth: boolean;
    password_last_changed: string;
    login_history: LoginHistory[];
  };
  financial_summary: {
    total_balance: number;
    total_investments: number;
    total_debts: number;
    monthly_income: number;
    monthly_expenses: number;
  };
}

interface LoginHistory {
  id: string;
  login_time: string;
  ip_address: string;
  device_info: string;
  location: string;
  successful: boolean;
}

interface UserProfileProps {
  supabase: any;
  session: any;
  onLogout?: () => void;
}

export function UserProfile({ supabase, session, onLogout }: UserProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    occupation: '',
    education: '',
    languages: [] as string[],
  });
  const [notificationForm, setNotificationForm] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    budget_alerts: true,
    investment_updates: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      // Set default values if data doesn't exist
      const userProfile = data || {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email,
        email: session.user.email,
        currency_preference: 'USD',
        notification_preferences: {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          budget_alerts: true,
          investment_updates: true,
        },
        security_settings: {
          two_factor_auth: false,
          password_last_changed: new Date().toISOString(),
          login_history: [],
        },
        financial_summary: {
          total_balance: 0,
          total_investments: 0,
          total_debts: 0,
          monthly_income: 0,
          monthly_expenses: 0,
        },
      };

      setUser(userProfile);
      setEditForm({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        date_of_birth: userProfile.date_of_birth || '',
        address: userProfile.address || '',
        occupation: userProfile.occupation || '',
        education: userProfile.education || '',
        languages: userProfile.languages || [],
      });
      setNotificationForm(userProfile.notification_preferences || {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        budget_alerts: true,
        investment_updates: true,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showSnackbar('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.from('user_profiles').upsert({
        id: session.user.id,
        ...editForm,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) throw error;

      showSnackbar('Profile updated successfully!', 'success');
      setEditDialogOpen(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleNotificationChange = async (field: string, value: boolean) => {
    const newNotificationForm = { ...notificationForm, [field]: value };
    setNotificationForm(newNotificationForm);

    try {
      const { error } = await supabase.from('user_profiles').upsert({
        id: session.user.id,
        notification_preferences: newNotificationForm,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) throw error;

      showSnackbar('Notification settings updated!', 'success');
    } catch (error) {
      console.error('Error updating notifications:', error);
      showSnackbar('Failed to update notifications', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Profile not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user.photo_url}
                alt={user.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {user.name?.[0] || user.email[0]}
              </Avatar>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Button
                startIcon={<Edit />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ mt: 2, borderRadius: 8 }}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Work /> Professional Info
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><Work /></ListItemIcon>
                        <ListItemText primary="Occupation" secondary={user.occupation || 'Not specified'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><School /></ListItemIcon>
                        <ListItemText primary="Education" secondary={user.education || 'Not specified'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Language /></ListItemIcon>
                        <ListItemText 
                          primary="Languages" 
                          secondary={user.languages?.join(', ') || 'Not specified'} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <LocationOn /> Personal Info
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><CalendarToday /></ListItemIcon>
                        <ListItemText primary="Date of Birth" secondary={user.date_of_birth || 'Not specified'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Phone /></ListItemIcon>
                        <ListItemText primary="Phone" secondary={user.phone || 'Not specified'} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><LocationOn /></ListItemIcon>
                        <ListItemText primary="Address" secondary={user.address || 'Not specified'} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Summary */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Typography variant="h6" gutterBottom>
          Financial Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <CardContent>
                <AttachMoney sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
                <Typography variant="h6">{user.financial_summary.total_balance.toLocaleString()} {user.currency_preference}</Typography>
                <Typography variant="body2" color="text.secondary">Total Balance</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                <Typography variant="h6">{user.financial_summary.total_investments.toLocaleString()} {user.currency_preference}</Typography>
                <Typography variant="body2" color="text.secondary">Total Investments</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <CardContent>
                <CurrencyRupee sx={{ fontSize: 40, color: '#EF4444', mb: 1 }} />
                <Typography variant="h6">{user.financial_summary.total_debts.toLocaleString()} {user.currency_preference}</Typography>
                <Typography variant="body2" color="text.secondary">Total Debts</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <CardContent>
                <AccountBalance sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
                <Typography variant="h6">{(user.financial_summary.monthly_income - user.financial_summary.monthly_expenses).toLocaleString()} {user.currency_preference}</Typography>
                <Typography variant="body2" color="text.secondary">Net Monthly</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Settings" icon={<Settings />} />
          <Tab label="Security" icon={<Security />} />
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="History" icon={<History />} />
        </Tabs>

        {/* Settings Tab */}
        {activeTab === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Payment /> Currency & Preferences
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={user.currency_preference}
                        label="Currency"
                      >
                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                        <MenuItem value="EUR">EUR - Euro</MenuItem>
                        <MenuItem value="GBP">GBP - British Pound</MenuItem>
                        <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                        <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Your currency preference affects how amounts are displayed throughout the app.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <CreditCard /> Payment Methods
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><CreditCard /></ListItemIcon>
                        <ListItemText primary="Primary Card" secondary="**** **** **** 1234" />
                        <Button size="small" variant="outlined">Manage</Button>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><AccountBalance /></ListItemIcon>
                        <ListItemText primary="Bank Account" secondary="**** **** 5678" />
                        <Button size="small" variant="outlined">Manage</Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Security Tab */}
        {activeTab === 1 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Security /> Security Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                        <Switch checked={user.security_settings.two_factor_auth} />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Password Last Changed" 
                          secondary={new Date(user.security_settings.password_last_changed).toLocaleDateString()}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <History /> Recent Activity
                    </Typography>
                    {user.security_settings.login_history.slice(0, 5).map((login) => (
                      <Box key={login.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #E2E8F0' }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(login.login_time).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          {login.device_info} • {login.location}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={login.successful ? 'Success' : 'Failed'} 
                          color={login.successful ? 'success' : 'error'}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Notifications Tab */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications" 
                  secondary="Receive important updates via email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationForm.email_notifications}
                      onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications" 
                  secondary="Get real-time alerts on your device"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationForm.push_notifications}
                      onChange={(e) => handleNotificationChange('push_notifications', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText 
                  primary="SMS Notifications" 
                  secondary="Receive SMS for critical alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationForm.sms_notifications}
                      onChange={(e) => handleNotificationChange('sms_notifications', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText 
                  primary="Budget Alerts" 
                  secondary="Notify when you exceed budget limits"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationForm.budget_alerts}
                      onChange={(e) => handleNotificationChange('budget_alerts', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText 
                  primary="Investment Updates" 
                  secondary="Get updates on your investments"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationForm.investment_updates}
                      onChange={(e) => handleNotificationChange('investment_updates', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </CardContent>
        )}

        {/* History Tab */}
        {activeTab === 3 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Activity
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This section would display your recent account activities, transactions, and important events.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Last Login
                    </Typography>
                    <Typography variant="h6">
                      {new Date().toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Profile Updated
                    </Typography>
                    <Typography variant="h6">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                value={editForm.date_of_birth}
                onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={editForm.occupation}
                onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Education"
                value={editForm.education}
                onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleUpdateProfile}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{ borderRadius: 8 }}
        >
          Logout
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
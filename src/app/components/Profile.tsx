import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Security,
  Palette,
  Notifications,
  Language,
  AccountCircle,
  Email,
  Phone,
  LocationOn,
  Work,
  CameraAlt,
  Delete,
  Lock,
  Visibility,
  VisibilityOff,
  Shield,
  CheckCircle,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ProfileProps {
  supabase: any;
  session: any;
}

export function Profile({ supabase, session }: ProfileProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: session?.user?.user_metadata?.name || '',
    email: session?.user?.email || '',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    bio: 'Passionate about personal finance and wealth management.',
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    budgetAlerts: true,
    goalReminders: true,
    expenseAlerts: true,
    twoFactorAuth: false,
    biometricAuth: false,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
    language: language,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveProfile = async () => {
    // Save profile data to Supabase
    try {
      await supabase.auth.updateUser({
        data: { name: profileData.name }
      });
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      alert('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  const renderProfileTab = () => (
    <Box>
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
              fontSize: '3rem',
              border: '4px solid rgba(0, 212, 255, 0.3)',
            }}
          >
            {profileData.name?.[0] || profileData.email?.[0]?.toUpperCase()}
          </Avatar>
          {editMode && (
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                color: '#0A0E27',
                '&:hover': {
                  background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
                },
              }}
              size="small"
            >
              <CameraAlt />
            </IconButton>
          )}
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {profileData.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profileData.email}
        </Typography>
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(0, 212, 255, 0.1)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {!editMode ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Full Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          disabled={!editMode}
          fullWidth
          InputProps={{
            startAdornment: <AccountCircle sx={{ mr: 1, color: '#00D4FF' }} />,
          }}
        />
        
        <TextField
          label="Email"
          value={profileData.email}
          disabled
          fullWidth
          InputProps={{
            startAdornment: <Email sx={{ mr: 1, color: '#00D4FF' }} />,
          }}
        />
        
        <TextField
          label="Phone"
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          disabled={!editMode}
          fullWidth
          InputProps={{
            startAdornment: <Phone sx={{ mr: 1, color: '#00D4FF' }} />,
          }}
        />
        
        <TextField
          label="Location"
          value={profileData.location}
          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
          disabled={!editMode}
          fullWidth
          InputProps={{
            startAdornment: <LocationOn sx={{ mr: 1, color: '#00D4FF' }} />,
          }}
        />
        
        <TextField
          label="Occupation"
          value={profileData.occupation}
          onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
          disabled={!editMode}
          fullWidth
          InputProps={{
            startAdornment: <Work sx={{ mr: 1, color: '#00D4FF' }} />,
          }}
        />
        
        <TextField
          label="Bio"
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          disabled={!editMode}
          multiline
          rows={4}
          fullWidth
        />
      </Box>
    </Box>
  );

  const renderSecurityTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Shield sx={{ color: '#00D4FF' }} />
        Security Settings
      </Typography>

      <GlassCard sx={{ mb: 3, p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Change Password
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Current Password"
            type={showPasswords.current ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  edge="end"
                >
                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          
          <TextField
            label="New Password"
            type={showPasswords.new ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  edge="end"
                >
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          
          <TextField
            label="Confirm New Password"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  edge="end"
                >
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<Lock />}
            onClick={handlePasswordChange}
            sx={{ alignSelf: 'flex-start' }}
          >
            Update Password
          </Button>
        </Box>
      </GlassCard>

      <GlassCard sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Authentication Methods
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Security sx={{ color: '#00D4FF' }} />
            </ListItemIcon>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <Switch
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CheckCircle sx={{ color: '#00D4FF' }} />
            </ListItemIcon>
            <ListItemText
              primary="Biometric Authentication"
              secondary="Use fingerprint or face recognition"
            />
            <Switch
              checked={settings.biometricAuth}
              onChange={(e) => setSettings({ ...settings, biometricAuth: e.target.checked })}
            />
          </ListItem>
        </List>
      </GlassCard>
    </Box>
  );

  const renderPreferencesTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette sx={{ color: '#00D4FF' }} />
        Preferences
      </Typography>

      <GlassCard sx={{ mb: 3, p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Regional Settings
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              label="Currency"
            >
              <MenuItem value="USD">USD - US Dollar</MenuItem>
              <MenuItem value="EUR">EUR - Euro</MenuItem>
              <MenuItem value="GBP">GBP - British Pound</MenuItem>
              <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
              <MenuItem value="INR">INR - Indian Rupee</MenuItem>
              <MenuItem value="CNY">CNY - Chinese Yuan</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Date Format</InputLabel>
            <Select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              label="Date Format"
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              label="Language"
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="zh">中文</MenuItem>
              <MenuItem value="hi">हिन्दी</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </GlassCard>

      <GlassCard sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Display Settings
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel>Theme</InputLabel>
          <Select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            label="Theme"
          >
            <MenuItem value="dark">Dark Mode</MenuItem>
            <MenuItem value="light">Light Mode</MenuItem>
            <MenuItem value="auto">Auto (System)</MenuItem>
          </Select>
        </FormControl>
      </GlassCard>
    </Box>
  );

  const renderNotificationsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Notifications sx={{ color: '#00D4FF' }} />
        Notification Settings
      </Typography>

      <GlassCard sx={{ mb: 3, p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          General Notifications
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive updates via email"
            />
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive push notifications on your device"
            />
            <Switch
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
            />
          </ListItem>
        </List>
      </GlassCard>

      <GlassCard sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Financial Alerts
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Weekly Reports"
              secondary="Get weekly financial summary"
            />
            <Switch
              checked={settings.weeklyReports}
              onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Budget Alerts"
              secondary="Notify when approaching budget limits"
            />
            <Switch
              checked={settings.budgetAlerts}
              onChange={(e) => setSettings({ ...settings, budgetAlerts: e.target.checked })}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Goal Reminders"
              secondary="Remind about financial goals progress"
            />
            <Switch
              checked={settings.goalReminders}
              onChange={(e) => setSettings({ ...settings, goalReminders: e.target.checked })}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Expense Alerts"
              secondary="Notify on large expenses"
            />
            <Switch
              checked={settings.expenseAlerts}
              onChange={(e) => setSettings({ ...settings, expenseAlerts: e.target.checked })}
            />
          </ListItem>
        </List>
      </GlassCard>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Profile & Settings
      </Typography>

      <GlassCard sx={{ p: { xs: 2, md: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
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
          <Tab icon={<AccountCircle />} iconPosition="start" label="Profile" />
          <Tab icon={<Security />} iconPosition="start" label="Security" />
          <Tab icon={<Palette />} iconPosition="start" label="Preferences" />
          <Tab icon={<Notifications />} iconPosition="start" label="Notifications" />
        </Tabs>

        <Box>
          {activeTab === 0 && renderProfileTab()}
          {activeTab === 1 && renderSecurityTab()}
          {activeTab === 2 && renderPreferencesTab()}
          {activeTab === 3 && renderNotificationsTab()}
        </Box>
      </GlassCard>
    </Box>
  );
}

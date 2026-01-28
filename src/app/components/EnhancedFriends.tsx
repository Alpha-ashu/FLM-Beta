import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  PersonAdd,
  Search,
  MoreVert,
  Check,
  Close,
  Delete,
  TrendingUp,
  TrendingDown,
  Email as EmailIcon,
  Phone,
  Group,
  QrCode,
  Share,
  Block,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { motion } from 'motion/react';

interface EnhancedFriendsProps {
  supabase: any;
  session: any;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  balance: number; // positive = they owe you, negative = you owe them
  status: 'active' | 'pending_sent' | 'pending_received' | 'blocked';
  sharedExpenses: number;
  lastActivity: string;
}

export function EnhancedFriends({ supabase, session }: EnhancedFriendsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [newFriendPhone, setNewFriendPhone] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 234 567 8901',
      balance: 125.50,
      status: 'active',
      sharedExpenses: 12,
      lastActivity: '2 hours ago',
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 234 567 8902',
      balance: -45.00,
      status: 'active',
      sharedExpenses: 8,
      lastActivity: '1 day ago',
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      balance: 0,
      status: 'active',
      sharedExpenses: 3,
      lastActivity: '3 days ago',
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.w@email.com',
      balance: -89.25,
      status: 'active',
      sharedExpenses: 15,
      lastActivity: '5 hours ago',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      balance: 0,
      status: 'pending_received',
      sharedExpenses: 0,
      lastActivity: '1 week ago',
    },
    {
      id: '6',
      name: 'Tom Martinez',
      email: 'tom.m@email.com',
      balance: 0,
      status: 'pending_sent',
      sharedExpenses: 0,
      lastActivity: '3 days ago',
    },
  ]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, friend: Friend) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriend(friend);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFriend(null);
  };

  const handleAddFriend = () => {
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendEmail.split('@')[0],
      email: newFriendEmail,
      phone: newFriendPhone,
      balance: 0,
      status: 'pending_sent',
      sharedExpenses: 0,
      lastActivity: 'Just now',
    };
    setFriends([...friends, newFriend]);
    setAddDialogOpen(false);
    setNewFriendEmail('');
    setNewFriendPhone('');
  };

  const handleAcceptRequest = (friendId: string) => {
    setFriends(friends.map(f => 
      f.id === friendId ? { ...f, status: 'active' as const } : f
    ));
  };

  const handleRejectRequest = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const handleRemoveFriend = () => {
    if (selectedFriend) {
      setFriends(friends.filter(f => f.id !== selectedFriend.id));
      handleMenuClose();
    }
  };

  const handleBlockFriend = () => {
    if (selectedFriend) {
      setFriends(friends.map(f => 
        f.id === selectedFriend.id ? { ...f, status: 'blocked' as const } : f
      ));
      handleMenuClose();
    }
  };

  const getFilteredFriends = () => {
    let filtered = friends;

    // Filter by tab
    if (activeTab === 0) {
      filtered = filtered.filter(f => f.status === 'active');
    } else if (activeTab === 1) {
      filtered = filtered.filter(f => f.status === 'pending_sent' || f.status === 'pending_received');
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredFriends = getFilteredFriends();

  const totalOwedToYou = friends
    .filter(f => f.status === 'active' && f.balance > 0)
    .reduce((sum, f) => sum + f.balance, 0);

  const totalYouOwe = friends
    .filter(f => f.status === 'active' && f.balance < 0)
    .reduce((sum, f) => sum + Math.abs(f.balance), 0);

  const netBalance = totalOwedToYou - totalYouOwe;
  const pendingRequests = friends.filter(f => f.status === 'pending_received').length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Friends
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
              boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
            },
          }}
        >
          Add Friend
        </Button>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Owed to You
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
              ${totalOwedToYou.toFixed(2)}
            </Typography>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard sx={{ p: 3, textAlign: 'center' }}>
            <TrendingDown sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You Owe
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
              ${totalYouOwe.toFixed(2)}
            </Typography>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard sx={{ p: 3, textAlign: 'center' }}>
            <Group sx={{ fontSize: 40, color: '#00D4FF', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Friends
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00D4FF' }}>
              {friends.filter(f => f.status === 'active').length}
            </Typography>
          </GlassCard>
        </motion.div>
      </Box>

      {/* Net Balance Summary */}
      {netBalance !== 0 && (
        <Alert
          severity={netBalance > 0 ? 'success' : 'warning'}
          sx={{
            mb: 3,
            background: netBalance > 0 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${netBalance > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            '& .MuiAlert-icon': {
              color: netBalance > 0 ? '#10B981' : '#F59E0B',
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Net Balance: {netBalance > 0 ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
          </Typography>
          <Typography variant="body2">
            {netBalance > 0 
              ? 'Overall, you are owed more than you owe.'
              : 'Overall, you owe more than you are owed.'}
          </Typography>
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search friends by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#00D4FF' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 600,
            color: '#8B8FA3',
            '&.Mui-selected': {
              color: '#00D4FF',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#00D4FF',
            height: 3,
            borderRadius: 3,
          },
        }}
      >
        <Tab label="All Friends" />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Pending
              {pendingRequests > 0 && (
                <Chip 
                  label={pendingRequests} 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    minWidth: 20,
                    background: '#FF4757',
                    color: 'white',
                    fontSize: '0.75rem',
                  }} 
                />
              )}
            </Box>
          }
        />
      </Tabs>

      {/* Friends List */}
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredFriends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard>
              <ListItem
                secondaryAction={
                  friend.status === 'pending_received' ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        onClick={() => handleAcceptRequest(friend.id)}
                        sx={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10B981',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.3)',
                          },
                        }}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleRejectRequest(friend.id)}
                        sx={{
                          backgroundColor: 'rgba(255, 71, 87, 0.2)',
                          color: '#FF4757',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 71, 87, 0.3)',
                          },
                        }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, friend)}
                    >
                      <MoreVert />
                    </IconButton>
                  )
                }
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ component: 'div' }}
                  secondaryTypographyProps={{ component: 'div' }}
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {friend.name}
                      </Typography>
                      {friend.status === 'pending_sent' && (
                        <Chip 
                          label="Pending" 
                          size="small" 
                          sx={{ 
                            height: 22,
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            color: '#F59E0B',
                            fontSize: '0.7rem',
                          }} 
                        />
                      )}
                      {friend.status === 'pending_received' && (
                        <Chip 
                          label="New Request" 
                          size="small" 
                          sx={{ 
                            height: 22,
                            backgroundColor: 'rgba(0, 212, 255, 0.2)',
                            color: '#00D4FF',
                            fontSize: '0.7rem',
                          }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14 }} />
                        <Typography variant="body2" color="text.secondary">
                          {friend.email}
                        </Typography>
                      </Box>
                      {friend.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Phone sx={{ fontSize: 14 }} />
                          <Typography variant="body2" color="text.secondary">
                            {friend.phone}
                          </Typography>
                        </Box>
                      )}
                      {friend.status === 'active' && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {friend.sharedExpenses} shared expenses • Last activity: {friend.lastActivity}
                          </Typography>
                          {friend.balance !== 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                icon={friend.balance > 0 ? <TrendingUp /> : <TrendingDown />}
                                label={`${friend.balance > 0 ? 'Owes you' : 'You owe'} $${Math.abs(friend.balance).toFixed(2)}`}
                                size="small"
                                sx={{
                                  backgroundColor: friend.balance > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                                  color: friend.balance > 0 ? '#10B981' : '#FF4757',
                                  fontWeight: 600,
                                  '& .MuiChip-icon': {
                                    color: friend.balance > 0 ? '#10B981' : '#FF4757',
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            </GlassCard>
          </motion.div>
        ))}
      </List>

      {filteredFriends.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Group sx={{ fontSize: 80, color: 'rgba(0, 212, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchQuery ? 'No friends found' : 'No friends yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery 
              ? 'Try adjusting your search query' 
              : 'Add friends to start splitting expenses together'}
          </Typography>
        </Box>
      )}

      {/* Add Friend Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 25, 50, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Add New Friend
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={newFriendEmail}
              onChange={(e) => setNewFriendEmail(e.target.value)}
              placeholder="friend@example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#00D4FF' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Phone Number (Optional)"
              type="tel"
              value={newFriendPhone}
              onChange={(e) => setNewFriendPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: '#00D4FF' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QrCode />}
                sx={{
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                  color: '#00D4FF',
                  '&:hover': {
                    borderColor: '#00D4FF',
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                Scan QR
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Share />}
                sx={{
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                  color: '#00D4FF',
                  '&:hover': {
                    borderColor: '#00D4FF',
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                Share Invite
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddFriend}
            disabled={!newFriendEmail}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
              },
            }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Friend Options Menu */}
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
        <MenuItem onClick={handleMenuClose}>
          <EmailIcon sx={{ mr: 2, color: '#00D4FF' }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 2, color: '#00D4FF' }} />
          View Shared Expenses
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleBlockFriend}>
          <Block sx={{ mr: 2, color: '#F59E0B' }} />
          Block Friend
        </MenuItem>
        <MenuItem onClick={handleRemoveFriend}>
          <Delete sx={{ mr: 2, color: '#FF4757' }} />
          Remove Friend
        </MenuItem>
      </Menu>
    </Box>
  );
}
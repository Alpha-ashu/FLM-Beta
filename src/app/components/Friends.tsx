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
  Block,
  TrendingUp,
  TrendingDown,
  Email,
  Phone,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';

interface FriendsProps {
  supabase: any;
  session: any;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number; // positive = they owe you, negative = you owe them
  status: 'active' | 'pending' | 'blocked';
}

export function Friends({ supabase, session }: FriendsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      balance: 125.50,
      status: 'active',
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      balance: -45.00,
      status: 'active',
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      balance: 0,
      status: 'active',
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john.smith@email.com',
      balance: 78.25,
      status: 'active',
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.w@email.com',
      balance: -32.50,
      status: 'active',
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState<Friend[]>([
    {
      id: 'p1',
      name: 'Alex Martinez',
      email: 'alex.m@email.com',
      balance: 0,
      status: 'pending',
    },
    {
      id: 'p2',
      name: 'Rachel Green',
      email: 'rachel.g@email.com',
      balance: 0,
      status: 'pending',
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

  const handleAcceptRequest = (id: string) => {
    const request = pendingRequests.find(r => r.id === id);
    if (request) {
      setFriends([...friends, { ...request, status: 'active' }]);
      setPendingRequests(pendingRequests.filter(r => r.id !== id));
    }
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== id));
  };

  const handleSendRequest = () => {
    if (!newFriendEmail) return;
    
    // In a real app, this would send a friend request via Supabase
    alert(`Friend request sent to ${newFriendEmail}`);
    setNewFriendEmail('');
    setAddDialogOpen(false);
  };

  const handleRemoveFriend = () => {
    if (selectedFriend) {
      setFriends(friends.filter(f => f.id !== selectedFriend.id));
      handleMenuClose();
    }
  };

  const handleSettleUp = () => {
    if (selectedFriend) {
      // In a real app, this would create a settlement transaction
      alert(`Settle up with ${selectedFriend.name}`);
      handleMenuClose();
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOwedToYou = friends.reduce((sum, f) => sum + (f.balance > 0 ? f.balance : 0), 0);
  const totalYouOwe = friends.reduce((sum, f) => sum + (f.balance < 0 ? Math.abs(f.balance) : 0), 0);
  const netBalance = totalOwedToYou - totalYouOwe;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Friends
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Friend
        </Button>
      </Box>

      {/* Balance Summary */}
      <GlassCard sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Owed to You
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TrendingUp />
              ${totalOwedToYou.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total You Owe
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF4757', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TrendingDown />
              ${totalYouOwe.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Net Balance
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: netBalance >= 0 ? '#10b981' : '#FF4757',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {netBalance >= 0 ? <TrendingUp /> : <TrendingDown />}
              ${Math.abs(netBalance).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </GlassCard>

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
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All Friends
                <Chip
                  label={friends.length}
                  size="small"
                  sx={{
                    height: 20,
                    background: 'rgba(0, 212, 255, 0.2)',
                    color: '#00D4FF',
                  }}
                />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pending Requests
                {pendingRequests.length > 0 && (
                  <Chip
                    label={pendingRequests.length}
                    size="small"
                    sx={{
                      height: 20,
                      background: 'rgba(255, 71, 87, 0.2)',
                      color: '#FF4757',
                    }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#00D4FF' }} />
                  </InputAdornment>
                ),
              }}
            />

            {filteredFriends.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery ? 'No friends found' : 'No friends yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {searchQuery ? 'Try a different search term' : 'Add friends to start splitting expenses'}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredFriends.map((friend, index) => (
                  <Box key={friend.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: { xs: 1, md: 2 },
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.05)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem',
                          }}
                        >
                          {friend.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {friend.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 16 }} />
                              {friend.email}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ textAlign: 'right', mr: 2 }}>
                        {friend.balance === 0 ? (
                          <Chip
                            label="Settled up"
                            sx={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          />
                        ) : friend.balance > 0 ? (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              owes you
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                              ${friend.balance.toFixed(2)}
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              you owe
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF4757' }}>
                              ${Math.abs(friend.balance).toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, friend)}
                        sx={{ color: '#8B8FA3' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                    
                    {index < filteredFriends.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {pendingRequests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No pending requests
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {pendingRequests.map((request, index) => (
                  <Box key={request.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: { xs: 1, md: 2 },
                        borderRadius: 2,
                        background: 'rgba(0, 212, 255, 0.05)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem',
                          }}
                        >
                          {request.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {request.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {request.email}
                          </Typography>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleAcceptRequest(request.id)}
                          sx={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            '&:hover': {
                              background: 'rgba(16, 185, 129, 0.3)',
                            },
                          }}
                        >
                          <Check />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeclineRequest(request.id)}
                          sx={{
                            background: 'rgba(255, 71, 87, 0.2)',
                            color: '#FF4757',
                            '&:hover': {
                              background: 'rgba(255, 71, 87, 0.3)',
                            },
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </ListItem>
                    
                    {index < pendingRequests.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}
      </GlassCard>

      {/* Friend Menu */}
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
        {selectedFriend && selectedFriend.balance !== 0 && (
          <MenuItem onClick={handleSettleUp}>
            <Check sx={{ mr: 1, fontSize: 20 }} />
            Settle Up
          </MenuItem>
        )}
        <MenuItem onClick={handleRemoveFriend} sx={{ color: '#FF4757' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Remove Friend
        </MenuItem>
      </Menu>

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
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
                    <Email sx={{ color: '#00D4FF' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              An invitation will be sent to this email address.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={!newFriendEmail}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Groups as GroupsIcon,
  Edit,
  Delete,
  MoreVert,
  AttachMoney,
  People,
  Share,
  ExitToApp,
  Star,
  TrendingUp,
  Receipt,
  Settings,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { motion } from 'motion/react';

interface EnhancedGroupsProps {
  supabase: any;
  session: any;
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  balance: number; // in context of this group
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  totalExpenses: number;
  yourBalance: number; // positive = owed to you, negative = you owe
  currency: string;
  category: 'trip' | 'home' | 'couple' | 'friends' | 'business' | 'other';
  icon: string;
  color: string;
  createdAt: string;
  expenseCount: number;
}

export function EnhancedGroups({ supabase, session }: EnhancedGroupsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'friends' as const,
  });

  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Thailand Trip 2024',
      description: 'Beach vacation with college friends',
      members: [
        { id: '1', name: 'You', email: 'you@email.com', balance: 0 },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', balance: 125.50 },
        { id: '3', name: 'Mike Chen', email: 'mike@email.com', balance: -45.00 },
        { id: '4', name: 'Emily Davis', email: 'emily@email.com', balance: -35.25 },
      ],
      totalExpenses: 2450.75,
      yourBalance: 245.75,
      currency: 'USD',
      category: 'trip',
      icon: '✈️',
      color: '#3B82F6',
      createdAt: 'Created 2 weeks ago',
      expenseCount: 18,
    },
    {
      id: '2',
      name: 'Apartment 42B',
      description: 'Rent and utilities for our apartment',
      members: [
        { id: '1', name: 'You', email: 'you@email.com', balance: 0 },
        { id: '2', name: 'David Wilson', email: 'david@email.com', balance: -156.00 },
        { id: '3', name: 'Lisa Anderson', email: 'lisa@email.com', balance: 89.50 },
      ],
      totalExpenses: 3200.00,
      yourBalance: -66.50,
      currency: 'USD',
      category: 'home',
      icon: '🏠',
      color: '#8B5CF6',
      createdAt: 'Created 3 months ago',
      expenseCount: 25,
    },
    {
      id: '3',
      name: 'Weekend Hiking',
      description: 'Monthly hiking trips and gear',
      members: [
        { id: '1', name: 'You', email: 'you@email.com', balance: 0 },
        { id: '2', name: 'Tom Martinez', email: 'tom@email.com', balance: 45.00 },
        { id: '3', name: 'Alex Brown', email: 'alex@email.com', balance: 22.50 },
        { id: '4', name: 'Rachel Green', email: 'rachel@email.com', balance: -12.00 },
        { id: '5', name: 'Chris Evans', email: 'chris@email.com', balance: -18.75 },
      ],
      totalExpenses: 845.25,
      yourBalance: 36.75,
      currency: 'USD',
      category: 'friends',
      icon: '⛰️',
      color: '#10B981',
      createdAt: 'Created 1 month ago',
      expenseCount: 12,
    },
    {
      id: '4',
      name: 'Startup Expenses',
      description: 'Business expenses for our new venture',
      members: [
        { id: '1', name: 'You', email: 'you@email.com', balance: 0 },
        { id: '2', name: 'James Smith', email: 'james@email.com', balance: -450.00 },
        { id: '3', name: 'Maria Garcia', email: 'maria@email.com', balance: 280.50 },
      ],
      totalExpenses: 12500.00,
      yourBalance: 169.50,
      currency: 'USD',
      category: 'business',
      icon: '💼',
      color: '#F59E0B',
      createdAt: 'Created 4 months ago',
      expenseCount: 42,
    },
  ]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, group: Group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const handleCreateGroup = () => {
    const categoryColors: Record<string, string> = {
      trip: '#3B82F6',
      home: '#8B5CF6',
      couple: '#EC4899',
      friends: '#10B981',
      business: '#F59E0B',
      other: '#64748B',
    };

    const categoryIcons: Record<string, string> = {
      trip: '✈️',
      home: '🏠',
      couple: '💑',
      friends: '👥',
      business: '💼',
      other: '📊',
    };

    const newGroup: Group = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      members: [
        { id: '1', name: 'You', email: 'you@email.com', balance: 0 },
      ],
      totalExpenses: 0,
      yourBalance: 0,
      currency: 'USD',
      category: formData.category,
      icon: categoryIcons[formData.category],
      color: categoryColors[formData.category],
      createdAt: 'Just now',
      expenseCount: 0,
    };

    setGroups([newGroup, ...groups]);
    setDialogOpen(false);
    setFormData({ name: '', description: '', category: 'friends' });
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      setGroups(groups.filter(g => g.id !== selectedGroup.id));
      handleMenuClose();
    }
  };

  const totalOwedToYou = groups.reduce((sum, g) => 
    sum + (g.yourBalance > 0 ? g.yourBalance : 0), 0
  );

  const totalYouOwe = groups.reduce((sum, g) => 
    sum + (g.yourBalance < 0 ? Math.abs(g.yourBalance) : 0), 0
  );

  const categoryOptions = [
    { value: 'trip', label: 'Trip', icon: '✈️' },
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'couple', label: 'Couple', icon: '💑' },
    { value: 'friends', label: 'Friends', icon: '👥' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'other', label: 'Other', icon: '📊' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
              boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
            },
          }}
        >
          Create Group
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
            <GroupsIcon sx={{ fontSize: 40, color: '#00D4FF', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Groups
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00D4FF' }}>
              {groups.length}
            </Typography>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You are Owed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
              ${totalOwedToYou.toFixed(2)}
            </Typography>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard sx={{ p: 3, textAlign: 'center' }}>
            <AttachMoney sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You Owe
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
              ${totalYouOwe.toFixed(2)}
            </Typography>
          </GlassCard>
        </motion.div>
      </Box>

      {/* Groups Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
          >
            <GlassCard
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${group.color}30`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          background: `${group.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                        }}
                      >
                        {group.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {group.name}
                        </Typography>
                        <Chip
                          label={group.category}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            textTransform: 'capitalize',
                            backgroundColor: `${group.color}20`,
                            color: group.color,
                            border: `1px solid ${group.color}40`,
                          }}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, group)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {group.description}
                  </Typography>

                  {/* Members */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Members
                      </Typography>
                      <Typography variant="caption" sx={{ color: group.color, fontWeight: 600 }}>
                        {group.members.length} people
                      </Typography>
                    </Box>
                    <AvatarGroup
                      max={5}
                      sx={{
                        '& .MuiAvatar-root': {
                          width: 36,
                          height: 36,
                          fontSize: '0.9rem',
                          border: '2px solid rgba(15, 18, 41, 1)',
                          background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}CC 100%)`,
                        },
                      }}
                    >
                      {group.members.map((member) => (
                        <Avatar key={member.id}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(0, 212, 255, 0.1)' }} />

                  {/* Stats */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Expenses
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: group.color }}>
                        ${group.totalExpenses.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Your Balance
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: group.yourBalance > 0 ? '#10B981' : group.yourBalance < 0 ? '#F59E0B' : '#8B8FA3',
                        }}
                      >
                        {group.yourBalance > 0 ? '+' : ''}${group.yourBalance.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Receipt sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {group.expenseCount} expenses
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {group.createdAt}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: `${group.color}40`,
                        color: group.color,
                        '&:hover': {
                          borderColor: group.color,
                          background: `${group.color}10`,
                        },
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      sx={{
                        background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}CC 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${group.color}DD 0%, ${group.color}AA 100%)`,
                        },
                      }}
                    >
                      Add Expense
                    </Button>
                  </Box>
                </CardContent>
              </GlassCard>
          </motion.div>
        ))}
      </Box>

      {groups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <GroupsIcon sx={{ fontSize: 80, color: 'rgba(0, 212, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No groups yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a group to start tracking shared expenses
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
              },
            }}
          >
            Create Your First Group
          </Button>
        </Box>
      )}

      {/* Create Group Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
          Create New Group
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Group Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Europe Trip 2024"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Summer vacation with friends"
              multiline
              rows={3}
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Category
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                {categoryOptions.map((option) => (
                  <Box
                    key={option.value}
                    onClick={() => setFormData({ ...formData, category: option.value as any })}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `2px solid ${formData.category === option.value ? '#00D4FF' : 'rgba(0, 212, 255, 0.2)'}`,
                      background: formData.category === option.value ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                      '&:hover': {
                        borderColor: '#00D4FF',
                        background: 'rgba(0, 212, 255, 0.05)',
                      },
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                      {option.icon}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: formData.category === option.value ? 600 : 400 }}>
                      {option.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateGroup}
            disabled={!formData.name}
            sx={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #33DDFF 0%, #38B6F0 100%)',
              },
            }}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Options Menu */}
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
          <Settings sx={{ mr: 2, color: '#00D4FF' }} />
          Group Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <People sx={{ mr: 2, color: '#00D4FF' }} />
          Manage Members
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 2, color: '#00D4FF' }} />
          Invite Friends
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose}>
          <ExitToApp sx={{ mr: 2, color: '#F59E0B' }} />
          Leave Group
        </MenuItem>
        <MenuItem onClick={handleDeleteGroup}>
          <Delete sx={{ mr: 2, color: '#FF4757' }} />
          Delete Group
        </MenuItem>
      </Menu>
    </Box>
  );
}
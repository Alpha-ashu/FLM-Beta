import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Groups as GroupsIcon,
  Person,
  Edit,
  Delete,
  AttachMoney,
} from '@mui/icons-material';

interface GroupsProps {
  supabase: any;
  session: any;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  totalExpenses: number;
  currency: string;
}

export function Groups({ supabase, session }: GroupsProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: '',
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Demo data for groups
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'Family',
          description: 'Family expenses and bills',
          members: ['You', 'Sarah', 'John'],
          totalExpenses: 5420.50,
          currency: 'USD',
        },
        {
          id: '2',
          name: 'Roommates',
          description: 'Apartment and shared expenses',
          members: ['You', 'Mike', 'Alex', 'Emma'],
          totalExpenses: 3200.00,
          currency: 'USD',
        },
        {
          id: '3',
          name: 'Europe Trip 2026',
          description: 'Trip to Europe with friends',
          members: ['You', 'David', 'Lisa', 'Tom', 'Anna'],
          totalExpenses: 8750.25,
          currency: 'EUR',
        },
      ];
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    // Add group logic
    setDialogOpen(false);
    setFormData({ name: '', description: '', members: '' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Groups & Friends
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
        >
          Create Group
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 2 } }}>
          <Tab label="All Groups" icon={<GroupsIcon />} iconPosition="start" sx={{ minHeight: { xs: 56, sm: 64 } }} />
          <Tab label="Friends" icon={<Person />} iconPosition="start" sx={{ minHeight: { xs: 56, sm: 64 } }} />
        </Tabs>
      </Card>

      {activeTab === 0 && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {groups.map((group) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={group.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
                      {group.name}
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {group.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                      Members ({group.members.length})
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                      {group.members.map((member, idx) => (
                        <Avatar key={idx} sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {member[0]}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Expenses
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {group.currency} {group.totalExpenses.toLocaleString()}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AttachMoney />}
                    sx={{ mt: 2 }}
                  >
                    View Expenses
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <List>
              {['Sarah Johnson', 'Mike Chen', 'Alex Rodriguez', 'Emma Wilson', 'David Kim'].map((friend, idx) => (
                <div key={idx}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Chip
                          label={idx % 2 === 0 ? 'You owe $45.50' : 'Owes you $32.00'}
                          color={idx % 2 === 0 ? 'error' : 'success'}
                          size="small"
                        />
                        <Button size="small" variant="text">Settle Up</Button>
                      </Box>
                    }
                    sx={{ py: { xs: 1.5, sm: 2 } }}
                  >
                    <ListItemAvatar>
                      <Avatar>{friend[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend}
                      secondary={`${Math.floor(Math.random() * 10) + 1} shared expenses`}
                    />
                  </ListItem>
                  {idx < 4 && <Divider />}
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            placeholder="e.g., Family, Roommates, Trip"
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="What is this group for?"
          />

          <TextField
            fullWidth
            label="Add Members (comma separated emails)"
            value={formData.members}
            onChange={(e) => setFormData({ ...formData, members: e.target.value })}
            margin="normal"
            placeholder="email1@example.com, email2@example.com"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddGroup}
            variant="contained"
            disabled={!formData.name}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
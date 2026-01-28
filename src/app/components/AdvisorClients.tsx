import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  People,
  TrendingUp,
  Schedule,
  CheckCircle,
  MoreVert,
  Email,
  Phone,
  CalendarToday,
} from '@mui/icons-material';

interface AdvisorClientsProps {
  supabase: any;
  session: any;
}

export function AdvisorClients({ supabase, session }: AdvisorClientsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Mock data for demo
  const mockClients = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      portfolio: 'Personal',
      totalAssets: 125000,
      monthlyIncome: 8500,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-02-20',
      portfolio: 'Family',
      totalAssets: 350000,
      monthlyIncome: 15000,
      status: 'active',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2024-03-10',
      portfolio: 'Business',
      totalAssets: 780000,
      monthlyIncome: 35000,
      status: 'active',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-01-28',
      portfolio: 'Personal',
      totalAssets: 95000,
      monthlyIncome: 6200,
      status: 'active',
    },
  ];

  const mockConsultations = [
    {
      id: '1',
      clientName: 'John Smith',
      topic: 'Retirement Planning',
      date: '2024-01-25',
      time: '10:00 AM',
      status: 'scheduled',
      type: 'video',
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      topic: 'Investment Strategy Review',
      date: '2024-01-26',
      time: '2:00 PM',
      status: 'scheduled',
      type: 'in-person',
    },
    {
      id: '3',
      clientName: 'Michael Chen',
      topic: 'Tax Planning',
      date: '2024-01-23',
      time: '11:00 AM',
      status: 'completed',
      type: 'video',
    },
    {
      id: '4',
      clientName: 'Emily Davis',
      topic: 'Budget Review',
      date: '2024-01-27',
      time: '3:30 PM',
      status: 'pending',
      type: 'phone',
    },
  ];

  const stats = {
    totalClients: mockClients.length,
    activeConsultations: mockConsultations.filter(c => c.status === 'scheduled').length,
    completedThisMonth: mockConsultations.filter(c => c.status === 'completed').length,
    totalAUM: mockClients.reduce((sum, client) => sum + client.totalAssets, 0),
  };

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Clients
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Clients
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Active Consultations
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.activeConsultations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Completed (This Month)
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.completedThisMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '100%',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total AUM
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ${(stats.totalAUM / 1000000).toFixed(2)}M
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Clients and Consultations */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="All Clients" />
          <Tab label="Consultations" />
        </Tabs>
      </Card>

      {/* Clients Table */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Client List
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Portfolio Type</TableCell>
                    <TableCell>Total Assets</TableCell>
                    <TableCell>Monthly Income</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {client.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {client.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {client.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={client.portfolio} size="small" />
                      </TableCell>
                      <TableCell>${client.totalAssets.toLocaleString()}</TableCell>
                      <TableCell>${client.monthlyIncome.toLocaleString()}</TableCell>
                      <TableCell>{new Date(client.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={client.status} 
                          color="success" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleClientClick(client)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Consultations Table */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Consultation Schedule
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockConsultations.map((consultation) => (
                    <TableRow key={consultation.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {consultation.clientName[0]}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {consultation.clientName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{consultation.topic}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {new Date(consultation.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {consultation.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={consultation.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={consultation.status} 
                          color={getStatusColor(consultation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text">
                          {consultation.status === 'scheduled' ? 'Join' : 'View'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Client Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {selectedClient?.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedClient?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedClient?.portfolio} Portfolio
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">{selectedClient?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">{selectedClient?.phone}</Typography>
              </Box>
            </Grid>
            <Grid xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Financial Overview
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Assets
                </Typography>
                <Typography variant="h6" color="primary">
                  ${selectedClient?.totalAssets?.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Income
                </Typography>
                <Typography variant="h6" color="success.main">
                  ${selectedClient?.monthlyIncome?.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Client Since
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2">
                  {selectedClient?.joinDate && new Date(selectedClient.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button variant="contained">Schedule Consultation</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

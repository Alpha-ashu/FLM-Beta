import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Divider,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Schedule,
  CalendarToday,
  AccessTime,
  Person,
  Work,
  Payment,
  CheckCircle,
  Cancel,
  EventAvailable,
  EventBusy,
  Edit,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase/info';

interface Booking {
  id: string;
  consultant_id: string;
  user_id: string;
  consultant_name: string;
  consultant_photo: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

interface BookingManagementProps {
  supabase: any;
  session: any;
  userType: 'user' | 'consultant';
}

export function BookingManagement({ supabase, session, userType }: BookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, filterStatus]);

  const fetchBookings = async () => {
    try {
      let query = supabase
        .from('consultant_bookings')
        .select(`
          *,
          consultants!inner (
            name,
            photo_url
          )
        `);

      if (userType === 'user') {
        query = query.eq('user_id', session.user.id);
      } else {
        query = query.eq('consultant_id', session.user.id);
      }

      const { data, error } = await query.order('date', { ascending: true }).order('time', { ascending: true });

      if (error) throw error;

      const formattedBookings = data.map((booking: any) => ({
        ...booking,
        consultant_name: booking.consultants?.name || 'Unknown',
        consultant_photo: booking.consultants?.photo_url || '',
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showSnackbar('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('consultant_bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      showSnackbar('Booking cancelled successfully!', 'success');
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showSnackbar('Failed to cancel booking', 'error');
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('consultant_bookings')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      showSnackbar('Booking confirmed!', 'success');
      fetchBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
      showSnackbar('Failed to confirm booking', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <EventAvailable />;
      case 'cancelled': return <EventBusy />;
      case 'completed': return <CheckCircle />;
      default: return <Schedule />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = booking.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.consultant_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading bookings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            {userType === 'user' ? 'My Bookings' : 'My Consultations'}
          </Typography>
          <Chip
            icon={<Schedule />}
            label={`${bookings.length} total bookings`}
            variant="outlined"
          />
        </Box>
        
        {/* Search and Filter */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search by consultant name or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Upcoming" icon={<CalendarToday />} />
          <Tab label="Past" icon={<Schedule />} />
          <Tab label="All" icon={<EventAvailable />} />
        </Tabs>

        <CardContent>
          {filteredBookings.length === 0 ? (
            <Alert severity="info">
              No bookings found. {userType === 'user' ? 'Book a consultation to get started!' : 'You have no consultations scheduled.'}
            </Alert>
          ) : (
            <List>
              {filteredBookings.map((booking) => (
                <Card key={booking.id} sx={{ mb: 2, border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar src={booking.consultant_photo} alt={booking.consultant_name}>
                            {booking.consultant_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {booking.consultant_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Consultant
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {booking.purpose}
                          </Typography>
                          <Box display="flex" gap={2} flexWrap="wrap" mb={1}>
                            <Chip
                              icon={<CalendarToday />}
                              label={new Date(booking.date).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<AccessTime />}
                              label={`${booking.time} • ${booking.duration} min`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={getStatusIcon(booking.status)}
                              label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              color={getStatusColor(booking.status) as any}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Booked: {new Date(booking.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} height="100%">
                          {userType === 'consultant' && booking.status === 'pending' && (
                            <>
                              <Button
                                startIcon={<CheckCircle />}
                                onClick={() => handleConfirmBooking(booking.id)}
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ borderRadius: 8 }}
                              >
                                Confirm
                              </Button>
                              <Button
                                startIcon={<Cancel />}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setCancelDialogOpen(true);
                                }}
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ borderRadius: 8 }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {userType === 'user' && booking.status === 'pending' && (
                            <Button
                              startIcon={<Cancel />}
                              onClick={() => {
                                setSelectedBooking(booking);
                                setCancelDialogOpen(true);
                              }}
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{ borderRadius: 8 }}
                            >
                              Cancel Booking
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Chip
                              icon={<Payment />}
                              label={`₹${booking.duration * 50} estimated`}
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </CardContent>
      </Paper>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking?
          </Typography>
          {selectedBooking && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Consultant: {selectedBooking.consultant_name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Date: {new Date(selectedBooking.date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Time: {selectedBooking.time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Booking</Button>
          <Button
            onClick={handleCancelBooking}
            color="error"
            startIcon={<Cancel />}
            variant="contained"
            sx={{ borderRadius: 8 }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip as MuiChip,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Star,
  Verified,
  Schedule,
  Payment,
  Description,
  Reviews,
  Work,
  School,
  Language,
  CheckCircle,
  Close as CloseIcon,
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase/info';

interface Consultant {
  id: string;
  name: string;
  email: string;
  photo_url: string;
  bio: string;
  expertise: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  hourly_rate: number;
  currency: string;
  languages: string[];
  education: string[];
  certifications: string[];
  availability: AvailabilitySlot[];
  is_verified: boolean;
}

interface AvailabilitySlot {
  date: string;
  time_slots: string[];
}

interface Booking {
  id: string;
  consultant_id: string;
  user_id: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

interface ConsultantProfileProps {
  consultantId: string;
  onBack?: () => void;
  supabase: any;
  session: any;
}

export function ConsultantProfile({ consultantId, onBack, supabase, session }: ConsultantProfileProps) {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    duration: 30,
    purpose: '',
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchConsultant();
    fetchReviews();
  }, [consultantId]);

  const fetchConsultant = async () => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', consultantId)
        .single();

      if (error) throw error;
      setConsultant(data);
    } catch (error) {
      console.error('Error fetching consultant:', error);
      showSnackbar('Failed to load consultant profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('consultant_reviews')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDateChange = async (date: string) => {
    setBookingForm({ ...bookingForm, date, time: '' });
    
    // Fetch available time slots for the selected date
    try {
      const { data, error } = await supabase
        .from('consultant_availability')
        .select('time_slots')
        .eq('consultant_id', consultantId)
        .eq('date', date)
        .single();

      if (error) throw error;
      setAvailableSlots(data?.time_slots || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
    }
  };

  const handleBookConsultation = async () => {
    try {
      const { error } = await supabase.from('consultant_bookings').insert([
        {
          consultant_id: consultantId,
          user_id: session.user.id,
          date: bookingForm.date,
          time: bookingForm.time,
          duration: bookingForm.duration,
          purpose: bookingForm.purpose,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      showSnackbar('Booking request sent successfully!', 'success');
      setBookDialogOpen(false);
      setBookingForm({ date: '', time: '', duration: 30, purpose: '' });
    } catch (error) {
      console.error('Error booking consultation:', error);
      showSnackbar('Failed to book consultation', 'error');
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
        <Typography>Loading consultant profile...</Typography>
      </Box>
    );
  }

  if (!consultant) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Consultant not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Avatar
              src={consultant.photo_url}
              alt={consultant.name}
              sx={{ width: 120, height: 120, mx: 'auto', display: 'block' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h4" component="h1">
                {consultant.name}
              </Typography>
              {consultant.is_verified && (
                <Chip
                  icon={<Verified />}
                  label="Verified"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {consultant.expertise.join(' • ')}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Rating value={consultant.rating} readOnly precision={0.1} />
              <Typography variant="body2" color="text.secondary">
                {consultant.rating.toFixed(1)} ({consultant.total_reviews} reviews)
              </Typography>
              <Chip
                icon={<Payment />}
                label={`${consultant.hourly_rate} ${consultant.currency}/hour`}
                color="success"
                variant="outlined"
              />
            </Box>
            <Typography variant="body1" paragraph>
              {consultant.bio}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {consultant.expertise.map((exp) => (
                <Chip key={exp} label={exp} variant="outlined" />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="contained"
          startIcon={<Schedule />}
          onClick={() => setBookDialogOpen(true)}
          sx={{ borderRadius: 8, px: 3 }}
        >
          Book Consultation
        </Button>
        <Button
          variant="outlined"
          startIcon={<Reviews />}
          onClick={() => setActiveTab(2)}
          sx={{ borderRadius: 8, px: 3 }}
        >
          View Reviews
        </Button>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="About" icon={<Description />} />
          <Tab label="Availability" icon={<CalendarToday />} />
          <Tab label="Reviews" icon={<Reviews />} />
        </Tabs>

        {/* About Tab */}
        {activeTab === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid #E2E8F0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Work /> Professional Details
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Experience"
                          secondary={`${consultant.experience_years} years`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Languages"
                          secondary={consultant.languages.join(', ')}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Hourly Rate"
                          secondary={`${consultant.hourly_rate} ${consultant.currency}/hour`}
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
                      <School /> Education & Certifications
                    </Typography>
                    <List>
                      {consultant.education.map((edu, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={edu} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Certifications:
                    </Typography>
                    {consultant.certifications.map((cert, index) => (
                      <Chip
                        key={index}
                        label={cert}
                        icon={<CheckCircle />}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Availability Tab */}
        {activeTab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Time Slots
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a date to view available time slots
            </Typography>
            {/* Here you would implement the calendar and time slot selection */}
            <Alert severity="info">
              Calendar integration would be implemented here to show available dates and times
            </Alert>
          </CardContent>
        )}

        {/* Reviews Tab */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Client Reviews
            </Typography>
            {reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet.</Typography>
            ) : (
              <List>
                {reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, border: '1px solid #E2E8F0' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar>{review.user_name?.[0] || 'U'}</Avatar>
                        <Box>
                          <Typography variant="subtitle2">{review.user_name}</Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </CardContent>
        )}
      </Paper>

      {/* Book Consultation Dialog */}
      <Dialog open={bookDialogOpen} onClose={() => setBookDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Consultation with {consultant.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose of consultation"
                multiline
                rows={3}
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                placeholder="Briefly describe what you'd like to discuss..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Preferred date"
                value={bookingForm.date}
                onChange={(e) => handleDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Time</InputLabel>
                <Select
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  label="Time"
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value as number })}
                  label="Duration"
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1.5 hours</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Estimated cost: {consultant.hourly_rate * (bookingForm.duration / 60)} {consultant.currency}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBookConsultation}
            disabled={!bookingForm.date || !bookingForm.time || !bookingForm.purpose}
          >
            Book Consultation
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
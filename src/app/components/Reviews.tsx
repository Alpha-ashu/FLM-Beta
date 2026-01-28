import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import {
  Star,
  StarBorder,
  Person,
  CalendarToday,
  Edit,
  Delete,
  Send,
  Comment,
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase/info';

interface Review {
  id: string;
  user_id: string;
  consultant_id: string;
  user_name: string;
  user_photo: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  consultantId?: string;
  userId?: string;
  supabase: any;
  session: any;
  userType: 'user' | 'consultant';
}

export function Reviews({ consultantId, userId, supabase, session, userType }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
    if (userType === 'user' && consultantId) {
      fetchUserReview();
    }
  }, []);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('consultant_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (consultantId) {
        query = query.eq('consultant_id', consultantId);
      } else if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showSnackbar('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const { data, error } = await supabase
        .from('consultant_reviews')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('consultant_id', consultantId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
      setUserReview(data || null);
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      showSnackbar('Please provide a rating and comment', 'warning');
      return;
    }

    try {
      const { error } = await supabase.from('consultant_reviews').insert([
        {
          user_id: session.user.id,
          consultant_id: consultantId,
          user_name: session.user.user_metadata?.name || session.user.email,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      showSnackbar('Review submitted successfully!', 'success');
      setReviewDialogOpen(false);
      setReviewForm({ rating: 0, comment: '' });
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      showSnackbar('Failed to submit review', 'error');
    }
  };

  const handleUpdateReview = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('consultant_reviews')
        .update({
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userReview.id);

      if (error) throw error;

      showSnackbar('Review updated successfully!', 'success');
      setReviewDialogOpen(false);
      setReviewForm({ rating: 0, comment: '' });
      fetchReviews();
      fetchUserReview();
    } catch (error) {
      console.error('Error updating review:', error);
      showSnackbar('Failed to update review', 'error');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('consultant_reviews')
        .delete()
        .eq('id', userReview.id);

      if (error) throw error;

      showSnackbar('Review deleted successfully!', 'success');
      setUserReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showSnackbar('Failed to delete review', 'error');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading reviews...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            {consultantId ? 'Client Reviews' : 'My Reviews'}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={<Star />}
              label={`${getAverageRating()} ⭐ (${reviews.length} reviews)`}
              color="primary"
              variant="outlined"
            />
            {userType === 'user' && consultantId && !userReview && (
              <Button
                startIcon={<Send />}
                onClick={() => setReviewDialogOpen(true)}
                variant="contained"
                sx={{ borderRadius: 8 }}
              >
                Write Review
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Reviews List */}
      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0' }}>
        {reviews.length === 0 ? (
          <Box p={3}>
            <Alert severity="info">
              {consultantId 
                ? "No reviews yet. Be the first to share your experience!" 
                : "You haven't written any reviews yet."}
            </Alert>
          </Box>
        ) : (
          <List>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2, border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar src={review.user_photo} alt={review.user_name}>
                      {review.user_name[0]}
                    </Avatar>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {review.user_name}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      {userType === 'user' && review.user_id === session.user.id && (
                        <Box display="flex" gap={1}>
                          <Button
                            startIcon={<Edit />}
                            onClick={() => {
                              setReviewForm({
                                rating: review.rating,
                                comment: review.comment,
                              });
                              setReviewDialogOpen(true);
                            }}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 8 }}
                          >
                            Edit
                          </Button>
                          <Button
                            startIcon={<Delete />}
                            onClick={handleDeleteReview}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ borderRadius: 8 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Paper>

      {/* Write/Edit Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {userReview ? 'Edit Your Review' : 'Write a Review'}
        </DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={reviewForm.rating}
              onChange={(_, newValue) => setReviewForm({ ...reviewForm, rating: newValue || 0 })}
              size="large"
              emptyIcon={<StarBorder fontSize="inherit" />}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            placeholder="Share your experience with this consultant..."
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Your review will be visible to other users.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={userReview ? handleUpdateReview : handleSubmitReview}
            startIcon={<Send />}
            variant="contained"
            disabled={!reviewForm.rating || !reviewForm.comment.trim()}
            sx={{ borderRadius: 8 }}
          >
            {userReview ? 'Update Review' : 'Submit Review'}
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
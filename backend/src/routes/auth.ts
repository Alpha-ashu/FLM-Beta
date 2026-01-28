import express from 'express';
import { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', protect, (req: any, res: any) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export default router;
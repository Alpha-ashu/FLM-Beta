import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { sendEmail } from '../utils/email.js';
import { generateToken } from '../utils/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password, confirmPassword }: RegisterData = req.body;

    // Validate input
    const validatedData = registerSchema.parse({ name, email, password, confirmPassword });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcryptjs.hash(validatedData.password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user.id, user.email, user.role);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      template: 'verify-email',
      data: {
        name: user.name,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${accessToken}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password }: LoginData = req.body;

    // Validate input
    const validatedData = loginSchema.parse({ email, password });

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user.id, user.email, user.role);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

export const logout = async (req: any, res: any) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const refreshToken = async (req: any, res: any) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user.id, user.email, user.role);

    // Set new refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
};

export const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If this email exists, a password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Send reset email
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      template: 'password-reset',
      data: {
        name: user.name,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      },
    });

    res.json({
      success: true,
      message: 'If this email exists, a password reset link has been sent',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const resetPassword = async (req: any, res: any) => {
  try {
    const { token, password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const verifyEmail = async (req: any, res: any) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Update email verification
    await prisma.user.update({
      where: { id: decoded.id },
      data: { emailVerified: true },
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid or expired verification token',
    });
  }
};

export const resendVerification = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified',
      });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      template: 'verify-email',
      data: {
        name: user.name,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
      },
    });

    res.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};
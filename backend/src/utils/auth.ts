import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (id: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as any
  );

  const refreshToken = jwt.sign(
    { id, email, role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    { expiresIn: '7d' } as any
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

export const generateVerificationToken = (id: string, email: string) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const generateResetToken = (id: string, email: string) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};
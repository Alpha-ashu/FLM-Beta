import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: any;
    stack?: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = { message, statusCode: 400 };
  }

  // Prisma errors
  if (err instanceof Error && err.name === 'PrismaClientKnownRequestError') {
    let message = 'Database error occurred';
    let statusCode = 500;

    const prismaError = err as any;
    switch (prismaError.code) {
      case 'P2002':
        message = 'Unique constraint violation';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003':
        message = 'Foreign key constraint violation';
        statusCode = 400;
        break;
      default:
        message = 'Database operation failed';
    }

    error = { message, statusCode };
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = 'Validation failed';
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        message,
        details: errors,
      },
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
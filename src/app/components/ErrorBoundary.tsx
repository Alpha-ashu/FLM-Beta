import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Error, Refresh } from '@mui/icons-material';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEFF 50%, #F0F2FF 100%)',
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an unexpected error. Please try refreshing the page.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {error.message}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
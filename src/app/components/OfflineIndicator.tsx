import { useState, useEffect } from 'react';
import { Alert, Snackbar, Box, Typography } from '@mui/material';
import { CloudOff, CloudDone, Sync } from '@mui/icons-material';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [justWentOnline, setJustWentOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setJustWentOnline(true);
      
      // Hide the "back online" notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
        setJustWentOnline(false);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setJustWentOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Persistent offline banner */}
      {!isOnline && (
        <Box
          sx={{
            position: 'fixed',
            top: 64, // Below app bar
            left: 0,
            right: 0,
            zIndex: 1200,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            py: 1,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            boxShadow: 2,
          }}
        >
          <CloudOff fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You're offline - Changes will sync when you're back online
          </Typography>
        </Box>
      )}

      {/* Toast notification for status changes */}
      <Snackbar
        open={showNotification}
        autoHideDuration={justWentOnline ? 5000 : null}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={isOnline ? 'success' : 'warning'}
          icon={isOnline ? <CloudDone /> : <CloudOff />}
          onClose={() => setShowNotification(false)}
          sx={{ width: '100%', minWidth: 300 }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isOnline ? 'Back Online' : 'You\'re Offline'}
            </Typography>
            <Typography variant="caption">
              {isOnline 
                ? 'Syncing your changes...' 
                : 'Your changes will be saved locally'}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}

import { Box, Typography } from '@mui/material';

interface CircularProgressCardProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
}

export function CircularProgressCard({ 
  value, 
  max, 
  label, 
  color = '#00D4FF',
  size = 120 
}: CircularProgressCardProps) {
  const percentage = (value / max) * 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(30, 35, 60, 0.5)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${label.replace(/\s/g, '')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
            filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.4))',
          }}
        />
        <defs>
          <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${color} 0%, #0EA5E9 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {percentage.toFixed(0)}%
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          color: '#8B8FA3',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

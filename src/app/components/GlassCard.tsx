import { Card, CardProps } from '@mui/material';

export function GlassCard(props: CardProps) {
  return (
    <Card
      {...props}
      sx={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 12px 40px rgba(91, 95, 227, 0.15)',
        borderRadius: '24px',
        ...props.sx,
      }}
    />
  );
}
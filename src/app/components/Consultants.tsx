import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Avatar,
  Rating,
  CircularProgress,
} from '@mui/material';
import { Verified, ContactMail } from '@mui/icons-material';

interface ConsultantsProps {
  supabase: any;
  session: any;
}

export function Consultants({ supabase, session }: ConsultantsProps) {
  const consultants = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Certified Financial Planner',
      specialties: ['Retirement Planning', 'Investment Strategy', 'Tax Planning'],
      rating: 4.9,
      reviews: 127,
      verified: true,
      hourlyRate: 150,
      bio: '15+ years of experience helping individuals and families achieve their financial goals.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Tax Consultant & Auditor',
      specialties: ['Tax Filing', 'Business Taxes', 'Audit Support'],
      rating: 4.8,
      reviews: 98,
      verified: true,
      hourlyRate: 120,
      bio: 'Specialized in tax optimization and compliance for individuals and small businesses.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Investment Advisor',
      specialties: ['Portfolio Management', 'Stock Market', 'Real Estate'],
      rating: 4.7,
      reviews: 85,
      verified: true,
      hourlyRate: 180,
      bio: 'Expert in building diversified investment portfolios aligned with your risk tolerance.',
    },
    {
      id: 4,
      name: 'David Kumar',
      title: 'Business Finance Consultant',
      specialties: ['Business Planning', 'Startup Finance', 'Growth Strategy'],
      rating: 4.9,
      reviews: 112,
      verified: true,
      hourlyRate: 200,
      bio: 'Helping entrepreneurs and businesses with financial planning and strategy.',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Financial Consultants
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Connect with verified financial professionals for personalized advice
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {consultants.map((consultant) => (
          <Card key={consultant.id}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: 'primary.main',
                    fontSize: 24,
                  }}
                >
                  {consultant.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {consultant.name}
                    </Typography>
                    {consultant.verified && (
                      <Verified sx={{ ml: 0.5, color: 'primary.main', fontSize: 20 }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {consultant.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating value={consultant.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {consultant.rating} ({consultant.reviews} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {consultant.bio}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Specialties
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {consultant.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Hourly Rate
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    ${consultant.hourlyRate}/hr
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<ContactMail />}
                >
                  Book Consultation
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Are you a financial professional?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Join our platform and offer your services to thousands of users
          </Typography>
          <Button variant="outlined" size="large">
            Register as Consultant
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
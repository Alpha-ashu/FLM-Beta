import { useState, useEffect } from 'react';
import { Box, Typography, Card, Chip, IconButton, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight, CreditCard, TrendingDown, TrendingUp } from '@mui/icons-material';
import { motion } from 'motion/react';

interface Payment {
  id: string;
  name: string;
  amount: number;
  type: 'loan' | 'subscription' | 'bill';
  date: Date;
  color: string;
}

interface PaymentCalendarProps {
  supabase?: any;
  session?: any;
}

export function PaymentCalendar({ supabase, session }: PaymentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    // Load loans from localStorage
    const storedLoans = localStorage.getItem('financelife_loans');
    const loanPayments: Payment[] = [];

    if (storedLoans) {
      const loans = JSON.parse(storedLoans);
      loans.forEach((loan: any) => {
        loanPayments.push({
          id: loan.id,
          name: loan.name,
          amount: loan.monthlyEMI,
          type: 'loan',
          date: new Date(loan.nextPaymentDate),
          color: loan.color,
        });
      });
    }

    setPayments(loanPayments);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPaymentsForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getDate() === targetDate.getDate() &&
        paymentDate.getMonth() === targetDate.getMonth() &&
        paymentDate.getFullYear() === targetDate.getFullYear()
      );
    });
  };

  const getTotalPaymentsForMonth = () => {
    return payments
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === currentDate.getMonth() &&
          paymentDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142', mb: 1 }}>
          Payment Calendar
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B8FA3' }}>
          View all upcoming payments and due dates
        </Typography>
      </Box>

      {/* Month Summary */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
          borderRadius: 4,
          p: 3,
          mb: 3,
          color: 'white',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
          Total Payments This Month
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          ${getTotalPaymentsForMonth().toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Typography>
      </Card>

      {/* Calendar */}
      <Card
        sx={{
          borderRadius: { xs: 3, sm: 4, md: 4 },
          p: { xs: 2, sm: 3, md: 3 },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <IconButton onClick={handlePreviousMonth} sx={{ color: '#5B5FE3' }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2D3142' }}>
            {monthName}
          </Typography>
          <IconButton onClick={handleNextMonth} sx={{ color: '#5B5FE3' }}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Day Names */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            mb: 1,
          }}
        >
          {dayNames.map((day) => (
            <Box key={day} sx={{ textAlign: 'center', py: { xs: 0.5, sm: 1, md: 1 } }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#8B8FA3', 
                  fontWeight: 600,
                  fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' },
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            mb: 2,
          }}
        >
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <Box key={`empty-${index}`} sx={{ minHeight: { xs: 60, sm: 70, md: 80 } }} />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayPayments = getPaymentsForDate(day);
            const isTodayDate = isToday(day);

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  onClick={() =>
                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                  }
                  sx={{
                    minHeight: { xs: 60, sm: 70, md: 80 },
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    cursor: dayPayments.length > 0 ? 'pointer' : 'default',
                    border: isTodayDate ? '2px solid #5B5FE3' : '1px solid #E0E0E0',
                    background: dayPayments.length > 0 ? 'rgba(91, 95, 227, 0.05)' : 'white',
                    '&:hover': {
                      boxShadow: dayPayments.length > 0 ? '0 4px 12px rgba(91, 95, 227, 0.2)' : 'none',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isTodayDate ? 700 : 600,
                        color: isTodayDate ? '#5B5FE3' : '#2D3142',
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      }}
                    >
                      {day}
                    </Typography>
                    {isTodayDate && (
                      <Chip
                        label="Today"
                        size="small"
                        sx={{
                          height: { xs: 16, sm: 18, md: 20 },
                          fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.7rem' },
                          background: '#5B5FE3',
                          color: 'white',
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </Box>

                  {/* Payment indicators */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.25, sm: 0.5, md: 0.5 }, mt: 0.5 }}>
                    {dayPayments.slice(0, 2).map((payment) => (
                      <Box
                        key={payment.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 0.25, sm: 0.5, md: 0.5 },
                          background: `${payment.color}20`,
                          borderLeft: `3px solid ${payment.color}`,
                          px: { xs: 0.25, sm: 0.5, md: 0.5 },
                          py: { xs: 0.2, sm: 0.3, md: 0.3 },
                          borderRadius: 1,
                          minHeight: { xs: 16, sm: 18, md: 20 },
                        }}
                      >
                        <CreditCard sx={{ fontSize: { xs: 10, sm: 12, md: 12 }, color: payment.color }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.65rem' },
                            fontWeight: 600,
                            color: '#2D3142',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                          }}
                        >
                          ${payment.amount.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                    {dayPayments.length > 2 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.6rem' },
                          color: '#8B8FA3',
                          textAlign: 'center',
                        }}
                      >
                        +{dayPayments.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card
          sx={{
            borderRadius: 4,
            p: 3,
            mt: 3,
            border: '2px solid #5B5FE3',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142', mb: 2 }}>
            Payments on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </Typography>

          {getPaymentsForDate(selectedDate.getDate()).map((payment) => (
            <Box
              key={payment.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 1,
                borderRadius: 2,
                background: `${payment.color}10`,
                border: `1px solid ${payment.color}30`,
              }}
            >
              <Avatar sx={{ background: payment.color }}>
                <CreditCard />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2D3142' }}>
                  {payment.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                  {payment.type.toUpperCase()}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: payment.color }}>
                ${payment.amount.toLocaleString()}
              </Typography>
            </Box>
          ))}

          {getPaymentsForDate(selectedDate.getDate()).length === 0 && (
            <Typography variant="body2" sx={{ color: '#8B8FA3', textAlign: 'center', py: 2 }}>
              No payments scheduled for this day
            </Typography>
          )}
        </Card>
      )}

      {/* Upcoming Payments List */}
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          mt: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142', mb: 2 }}>
          Next 7 Days
        </Typography>

        {payments
          .filter((payment) => {
            const paymentDate = new Date(payment.date);
            const diff = (paymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
            return diff >= 0 && diff <= 7;
          })
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((payment) => {
            const daysUntil = Math.ceil(
              (new Date(payment.date).getTime() - today.getTime()) / (1000 * 3600 * 24)
            );

            return (
              <Box
                key={payment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  background: daysUntil <= 1 ? '#FFF5F5' : 'rgba(91, 95, 227, 0.05)',
                  border: daysUntil <= 1 ? '1px solid #FF5C7C' : '1px solid #E0E0E0',
                }}
              >
                <Avatar sx={{ background: payment.color }}>
                  <CreditCard />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#2D3142' }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                    {daysUntil === 0
                      ? 'Due Today'
                      : daysUntil === 1
                      ? 'Due Tomorrow'
                      : `Due in ${daysUntil} days`}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: payment.color }}>
                  ${payment.amount.toLocaleString()}
                </Typography>
              </Box>
            );
          })}

        {payments.filter((payment) => {
          const paymentDate = new Date(payment.date);
          const diff = (paymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          return diff >= 0 && diff <= 7;
        }).length === 0 && (
          <Typography variant="body2" sx={{ color: '#8B8FA3', textAlign: 'center', py: 2 }}>
            No payments due in the next 7 days
          </Typography>
        )}
      </Card>
    </Box>
  );
}

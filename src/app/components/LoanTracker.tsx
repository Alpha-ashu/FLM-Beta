import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  IconButton,
  Chip,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Home,
  DirectionsCar,
  School,
  CreditCard,
  Business,
  Notifications,
  NotificationsOff,
  CalendarToday,
} from '@mui/icons-material';
import { motion } from 'motion/react';

interface Loan {
  id: string;
  name: string;
  type: 'home-loan' | 'car-loan' | 'personal-loan' | 'education-loan' | 'credit-card' | 'business-loan';
  totalAmount: number;
  remainingAmount: number;
  monthlyEMI: number;
  interestRate: number;
  nextPaymentDate: string;
  lender: string;
  notifications: boolean;
  color: string;
}

interface LoanTrackerProps {
  supabase?: any;
  session?: any;
}

const loanTypeIcons = {
  'home-loan': Home,
  'car-loan': DirectionsCar,
  'personal-loan': CreditCard,
  'education-loan': School,
  'credit-card': CreditCard,
  'business-loan': Business,
};

const loanColors = [
  '#FF5C7C',
  '#FFB547',
  '#A855F7',
  '#EC4899',
  '#F97316',
  '#EF4444',
];

export function LoanTracker({ supabase, session }: LoanTrackerProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal-loan' as Loan['type'],
    totalAmount: '',
    remainingAmount: '',
    monthlyEMI: '',
    interestRate: '',
    nextPaymentDate: '',
    lender: '',
    notifications: true,
  });

  useEffect(() => {
    loadLoans();
    checkUpcomingPayments();
  }, []);

  const loadLoans = () => {
    const storedLoans = localStorage.getItem('financelife_loans');
    if (storedLoans) {
      setLoans(JSON.parse(storedLoans));
    }
  };

  const saveLoans = (newLoans: Loan[]) => {
    setLoans(newLoans);
    localStorage.setItem('financelife_loans', JSON.stringify(newLoans));
  };

  const checkUpcomingPayments = () => {
    const storedLoans = localStorage.getItem('financelife_loans');
    if (!storedLoans) return;

    const loans: Loan[] = JSON.parse(storedLoans);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    loans.forEach((loan) => {
      if (!loan.notifications) return;

      const paymentDate = new Date(loan.nextPaymentDate);
      const timeDiff = paymentDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Check if payment is due tomorrow or today
      if (daysDiff === 0) {
        showNotification(`${loan.name} - Payment Due Today!`, `EMI of $${loan.monthlyEMI} is due today.`);
      } else if (daysDiff === 1) {
        showNotification(`${loan.name} - Payment Due Tomorrow`, `EMI of $${loan.monthlyEMI} is due tomorrow.`);
      }
    });
  };

  const showNotification = (title: string, body: string) => {
    // Check notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    const interval = setInterval(checkUpcomingPayments, 60000 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

  const handleOpenDialog = (loan?: Loan) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({
        name: loan.name,
        type: loan.type,
        totalAmount: loan.totalAmount.toString(),
        remainingAmount: loan.remainingAmount.toString(),
        monthlyEMI: loan.monthlyEMI.toString(),
        interestRate: loan.interestRate.toString(),
        nextPaymentDate: loan.nextPaymentDate,
        lender: loan.lender,
        notifications: loan.notifications,
      });
    } else {
      setEditingLoan(null);
      setFormData({
        name: '',
        type: 'personal-loan',
        totalAmount: '',
        remainingAmount: '',
        monthlyEMI: '',
        interestRate: '',
        nextPaymentDate: '',
        lender: '',
        notifications: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLoan(null);
  };

  const handleSaveLoan = () => {
    if (!formData.name || !formData.totalAmount || !formData.monthlyEMI) return;

    const newLoan: Loan = {
      id: editingLoan?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.remainingAmount || formData.totalAmount),
      monthlyEMI: parseFloat(formData.monthlyEMI),
      interestRate: parseFloat(formData.interestRate || '0'),
      nextPaymentDate: formData.nextPaymentDate,
      lender: formData.lender,
      notifications: formData.notifications,
      color: editingLoan?.color || loanColors[loans.length % loanColors.length],
    };

    if (editingLoan) {
      const updatedLoans = loans.map((loan) =>
        loan.id === editingLoan.id ? newLoan : loan
      );
      saveLoans(updatedLoans);
    } else {
      saveLoans([...loans, newLoan]);
    }

    handleCloseDialog();
  };

  const handleDeleteLoan = (id: string) => {
    const updatedLoans = loans.filter((loan) => loan.id !== id);
    saveLoans(updatedLoans);
  };

  const toggleNotifications = (id: string) => {
    const updatedLoans = loans.map((loan) =>
      loan.id === id ? { ...loan, notifications: !loan.notifications } : loan
    );
    saveLoans(updatedLoans);
  };

  const totalDebt = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalMonthlyEMI = loans.reduce((sum, loan) => sum + loan.monthlyEMI, 0);

  const getUpcomingPayments = () => {
    const today = new Date();
    return loans
      .map((loan) => ({
        ...loan,
        daysUntilPayment: Math.ceil(
          (new Date(loan.nextPaymentDate).getTime() - today.getTime()) / (1000 * 3600 * 24)
        ),
      }))
      .filter((loan) => loan.daysUntilPayment >= 0)
      .sort((a, b) => a.daysUntilPayment - b.daysUntilPayment);
  };

  const upcomingPayments = getUpcomingPayments();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142', mb: 1 }}>
            Loans & EMIs
          </Typography>
          <Typography variant="body1" sx={{ color: '#8B8FA3' }}>
            Track your loans and get payment reminders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #FF5C7C 0%, #FFB547 100%)',
            borderRadius: 3,
            px: 3,
          }}
        >
          Add Loan
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FF5C7C 0%, #FFB547 100%)',
              borderRadius: 4,
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Total Outstanding Debt
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              borderRadius: 4,
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Monthly EMI Commitment
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              ${totalMonthlyEMI.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
              borderRadius: 4,
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Active Loans
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {loans.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142', mb: 2 }}>
            Upcoming Payments
          </Typography>
          <Grid container spacing={2}>
            {upcomingPayments.slice(0, 3).map((payment) => (
              <Grid item xs={12} sm={6} md={4} key={payment.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    p: 2,
                    border: payment.daysUntilPayment <= 1 ? '2px solid #FF5C7C' : '1px solid #E0E0E0',
                    background: payment.daysUntilPayment <= 1 ? '#FFF5F5' : 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <CalendarToday sx={{ color: payment.color, fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3142' }}>
                        {payment.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                        {payment.daysUntilPayment === 0
                          ? 'Due Today'
                          : payment.daysUntilPayment === 1
                          ? 'Due Tomorrow'
                          : `In ${payment.daysUntilPayment} days`}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: payment.color }}>
                      ${payment.monthlyEMI}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Loan List */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142', mb: 2 }}>
          All Loans
        </Typography>
        <Grid container spacing={3}>
          {loans.map((loan, index) => {
            const Icon = loanTypeIcons[loan.type];
            const progress = ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100;

            return (
              <Grid item xs={12} md={6} key={loan.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      p: 3,
                      border: `2px solid ${loan.color}30`,
                      '&:hover': {
                        boxShadow: `0 8px 24px ${loan.color}40`,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            background: loan.color,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Icon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
                            {loan.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                            {loan.lender}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleNotifications(loan.id)}
                          sx={{ color: loan.notifications ? '#10E584' : '#8B8FA3' }}
                        >
                          {loan.notifications ? <Notifications fontSize="small" /> : <NotificationsOff fontSize="small" />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(loan)}
                          sx={{ color: '#8B8FA3' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteLoan(loan.id)}
                          sx={{ color: '#FF5C7C' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Repayment Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: loan.color }}>
                          {progress.toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: `${loan.color}20`,
                          '& .MuiLinearProgress-bar': {
                            background: loan.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Remaining
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: loan.color }}>
                          ${loan.remainingAmount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Monthly EMI
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142' }}>
                          ${loan.monthlyEMI.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Interest Rate
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3142' }}>
                          {loan.interestRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Next Payment
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3142' }}>
                          {new Date(loan.nextPaymentDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {loans.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
            }}
          >
            <CreditCard sx={{ fontSize: 80, color: '#8B8FA3', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#8B8FA3', mb: 1 }}>
              No loans tracked yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 3 }}>
              Add your loans to track payments and get reminders
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, #FF5C7C 0%, #FFB547 100%)',
              }}
            >
              Add Loan
            </Button>
          </Box>
        )}
      </Box>

      {/* Add/Edit Loan Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Loan Type"
              select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Loan['type'] })}
              fullWidth
            >
              <MenuItem value="home-loan">Home Loan</MenuItem>
              <MenuItem value="car-loan">Car Loan</MenuItem>
              <MenuItem value="personal-loan">Personal Loan</MenuItem>
              <MenuItem value="education-loan">Education Loan</MenuItem>
              <MenuItem value="credit-card">Credit Card</MenuItem>
              <MenuItem value="business-loan">Business Loan</MenuItem>
            </TextField>

            <TextField
              label="Loan Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Home Loan - ABC Bank"
              fullWidth
            />

            <TextField
              label="Lender Name"
              value={formData.lender}
              onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
              placeholder="e.g., ABC Bank"
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Total Loan Amount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                placeholder="100000"
                fullWidth
              />
              <TextField
                label="Remaining Amount"
                type="number"
                value={formData.remainingAmount}
                onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                placeholder="75000"
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Monthly EMI"
                type="number"
                value={formData.monthlyEMI}
                onChange={(e) => setFormData({ ...formData, monthlyEMI: e.target.value })}
                placeholder="2500"
                fullWidth
              />
              <TextField
                label="Interest Rate (%)"
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="8.5"
                fullWidth
              />
            </Box>

            <TextField
              label="Next Payment Date"
              type="date"
              value={formData.nextPaymentDate}
              onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Notifications sx={{ color: formData.notifications ? '#10E584' : '#8B8FA3' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Payment Reminders
                </Typography>
                <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                  Get notified before payment due date
                </Typography>
              </Box>
              <Button
                variant={formData.notifications ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
              >
                {formData.notifications ? 'ON' : 'OFF'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveLoan}
            variant="contained"
            disabled={!formData.name || !formData.totalAmount || !formData.monthlyEMI}
          >
            {editingLoan ? 'Save Changes' : 'Add Loan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

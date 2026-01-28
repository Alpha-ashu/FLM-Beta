import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Notifications,
  CheckCircle,
  Payment,
  Person,
  Close,
  Edit,
  Delete,
  NotificationsActive,
} from '@mui/icons-material';

interface LendBorrowTransaction {
  id: string;
  type: 'lend' | 'borrow';
  personName: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'partially_paid' | 'completed';
  amountPaid: number;
  createdDate: string;
  reminderEnabled: boolean;
  reminderDays: number;
  category: string;
}

interface LendBorrowProps {
  supabase: any;
  session: any;
}

export function LendBorrow({ supabase, session }: LendBorrowProps) {
  const [transactions, setTransactions] = useState<LendBorrowTransaction[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const [formData, setFormData] = useState({
    type: 'lend' as 'lend' | 'borrow',
    personName: '',
    amount: '',
    description: '',
    dueDate: '',
    reminderEnabled: true,
    reminderDays: 1,
    category: 'personal',
  });

  useEffect(() => {
    loadTransactions();
    checkNotificationPermission();
    setupReminderChecker();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setSnackbar({ open: true, message: 'Notifications enabled!', severity: 'success' });
      }
    }
  };

  const loadTransactions = () => {
    const stored = localStorage.getItem('lendBorrowTransactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  };

  const saveTransactions = (txns: LendBorrowTransaction[]) => {
    localStorage.setItem('lendBorrowTransactions', JSON.stringify(txns));
    setTransactions(txns);
  };

  const setupReminderChecker = () => {
    // Check for reminders every hour
    const interval = setInterval(() => {
      checkAndSendReminders();
    }, 3600000); // 1 hour

    // Check immediately on load
    checkAndSendReminders();

    return () => clearInterval(interval);
  };

  const checkAndSendReminders = () => {
    const stored = localStorage.getItem('lendBorrowTransactions');
    if (!stored) return;

    const txns: LendBorrowTransaction[] = JSON.parse(stored);
    const today = new Date();

    txns.forEach(txn => {
      if (txn.status !== 'completed' && txn.reminderEnabled) {
        const dueDate = new Date(txn.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= txn.reminderDays && diffDays >= 0) {
          sendNotification(txn);
        }
      }
    });
  };

  const sendNotification = (txn: LendBorrowTransaction) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = txn.type === 'lend' 
        ? `💰 Reminder: Collect from ${txn.personName}`
        : `⚠️ Reminder: Pay to ${txn.personName}`;
      
      const body = `Amount: $${(txn.amount - txn.amountPaid).toFixed(2)}\nDue: ${new Date(txn.dueDate).toLocaleDateString()}`;

      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: txn.id,
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.personName || !formData.amount || !formData.dueDate) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

        const newTransaction: LendBorrowTransaction = {
          id: editingId || Date.now().toString(),
          type: formData.type,
          personName: formData.personName,
          amount: parseFloat(formData.amount),
          description: formData.description,
          dueDate: formData.dueDate,
          status: 'pending',
          amountPaid: 0,
          createdDate: editingId 
            ? transactions.find(t => t.id === editingId)?.createdDate || new Date().toISOString()
            : new Date().toISOString(),
          reminderEnabled: formData.reminderEnabled,
          reminderDays: formData.reminderDays,
          category: formData.category,
        };

    let updatedTransactions;
    if (editingId) {
      updatedTransactions = transactions.map(t => t.id === editingId ? newTransaction : t);
      setSnackbar({ open: true, message: 'Transaction updated successfully!', severity: 'success' });
    } else {
      updatedTransactions = [...transactions, newTransaction];
      setSnackbar({ open: true, message: 'Transaction added successfully!', severity: 'success' });
    }

    saveTransactions(updatedTransactions);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({
      type: 'lend',
      personName: '',
      amount: '',
      description: '',
      dueDate: '',
      reminderEnabled: true,
      reminderDays: 1,
      category: 'personal',
    });
  };

  const handleEdit = (txn: LendBorrowTransaction) => {
    setEditingId(txn.id);
    setFormData({
      type: txn.type,
      personName: txn.personName,
      amount: txn.amount.toString(),
      description: txn.description,
      dueDate: txn.dueDate,
      reminderEnabled: txn.reminderEnabled,
      reminderDays: txn.reminderDays,
      category: txn.category,
    });
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(updatedTransactions);
    setSnackbar({ open: true, message: 'Transaction deleted', severity: 'success' });
  };

  const handlePayment = (id: string, amount: number) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id) {
        const newAmountPaid = t.amountPaid + amount;
        return {
          ...t,
          amountPaid: newAmountPaid,
          status: newAmountPaid >= t.amount ? 'completed' : 'partially_paid',
        };
      }
      return t;
    });
    saveTransactions(updatedTransactions);
    setSnackbar({ open: true, message: 'Payment recorded successfully!', severity: 'success' });
  };

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 0) return t.type === 'lend';
    if (activeTab === 1) return t.type === 'borrow';
    return true;
  });

  const calculateTotals = (type: 'lend' | 'borrow') => {
    return transactions
      .filter(t => t.type === type && t.status !== 'completed')
      .reduce((sum, t) => sum + (t.amount - t.amountPaid), 0);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142' }}>
            Lend & Borrow
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {notificationPermission !== 'granted' && (
              <Button
                variant="outlined"
                startIcon={<NotificationsActive />}
                onClick={requestNotificationPermission}
                sx={{
                  borderRadius: 3,
                  borderColor: 'rgba(91, 95, 227, 0.3)',
                  color: '#5B5FE3',
                  '&:hover': {
                    borderColor: '#5B5FE3',
                    background: 'rgba(91, 95, 227, 0.08)',
                  },
                }}
              >
                Enable Reminders
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FF5 100%)',
                borderRadius: 3,
                px: 3,
                boxShadow: '0 4px 15px rgba(91, 95, 227, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4345B9 0%, #5B5FE3 100%)',
                },
              }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
                    Money to Collect
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#047857' }}>
                    ${calculateTotals('lend').toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', width: 56, height: 56 }}>
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
              border: '1.5px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 600, mb: 1 }}>
                    Money to Pay
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#B91C1C' }}>
                    ${calculateTotals('borrow').toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', width: 56, height: 56 }}>
                  <TrendingDown sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          border: '1px solid rgba(91, 95, 227, 0.1)',
          p: 1,
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': {
                borderRadius: 2,
                fontWeight: 600,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FF5 100%)',
                  color: 'white',
                },
              },
            }}
          >
            <Tab label={`Lent (${transactions.filter(t => t.type === 'lend').length})`} />
            <Tab label={`Borrowed (${transactions.filter(t => t.type === 'borrow').length})`} />
            <Tab label={`All (${transactions.length})`} />
          </Tabs>
        </Box>
      </Box>

      {/* Transactions List */}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {filteredTransactions.length === 0 ? (
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(91, 95, 227, 0.1)',
              p: 6,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#8B8FA3', mb: 2 }}>
              No transactions yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
              Start by adding your first lend or borrow transaction
            </Typography>
          </Card>
        ) : (
          filteredTransactions.map((txn) => {
            const daysUntilDue = getDaysUntilDue(txn.dueDate);
            const isOverdue = daysUntilDue < 0;
            const progress = (txn.amountPaid / txn.amount) * 100;

            return (
              <Card
                key={txn.id}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: `1.5px solid ${txn.type === 'lend' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  boxShadow: '0 4px 20px rgba(91, 95, 227, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(91, 95, 227, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          background: txn.type === 'lend'
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3142' }}>
                          {txn.personName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8B8FA3' }}>
                          {txn.description || 'No description'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(txn)}
                        sx={{
                          color: '#5B5FE3',
                          '&:hover': { background: 'rgba(91, 95, 227, 0.1)' },
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(txn.id)}
                        sx={{
                          color: '#FF5C7C',
                          '&:hover': { background: 'rgba(255, 92, 124, 0.1)' },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: txn.type === 'lend' ? '#059669' : '#DC2626' }}>
                        ${(txn.amount - txn.amountPaid).toFixed(2)}
                      </Typography>
                      <Chip
                        label={txn.status === 'completed' ? 'Completed' : txn.status === 'partially_paid' ? 'Partial' : 'Pending'}
                        icon={txn.status === 'completed' ? <CheckCircle /> : undefined}
                        size="small"
                        sx={{
                          background: txn.status === 'completed'
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : txn.status === 'partially_paid'
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : 'linear-gradient(135deg, #8B8FA3 0%, #6B7280 100%)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    {txn.amountPaid > 0 && (
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 0.5,
                            background: 'rgba(91, 95, 227, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FF5 100%)',
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                          Paid: ${txn.amountPaid.toFixed(2)} / ${txn.amount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<CalendarToday />}
                      label={`Due: ${new Date(txn.dueDate).toLocaleDateString()}`}
                      size="small"
                      sx={{
                        background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(91, 95, 227, 0.1)',
                        color: isOverdue ? '#DC2626' : '#5B5FE3',
                        border: `1px solid ${isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(91, 95, 227, 0.2)'}`,
                      }}
                    />
                    {isOverdue && txn.status !== 'completed' && (
                      <Chip
                        label={`Overdue by ${Math.abs(daysUntilDue)} days`}
                        size="small"
                        sx={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#DC2626',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {!isOverdue && daysUntilDue <= 7 && txn.status !== 'completed' && (
                      <Chip
                        label={`Due in ${daysUntilDue} days`}
                        size="small"
                        sx={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#D97706',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {txn.reminderEnabled && (
                      <Chip
                        icon={<Notifications />}
                        label={`Reminder: ${txn.reminderDays} day${txn.reminderDays > 1 ? 's' : ''} before`}
                        size="small"
                        sx={{
                          background: 'rgba(139, 143, 245, 0.1)',
                          color: '#7B7FF5',
                        }}
                      />
                    )}
                  </Box>

                  {txn.status !== 'completed' && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={() => {
                        const amount = prompt(`Enter payment amount (Remaining: $${(txn.amount - txn.amountPaid).toFixed(2)}):`);
                        if (amount && !isNaN(parseFloat(amount))) {
                          handlePayment(txn.id, parseFloat(amount));
                        }
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FF5 100%)',
                        borderRadius: 2,
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4345B9 0%, #5B5FE3 100%)',
                        },
                      }}
                    >
                      Record Payment
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontWeight: 700 }}>
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'lend' | 'borrow' })}
                label="Transaction Type"
              >
                <MenuItem value="lend">I Lent Money (They owe me)</MenuItem>
                <MenuItem value="borrow">I Borrowed Money (I owe them)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Person Name"
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="family">Family</MenuItem>
                <MenuItem value="friend">Friend</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ 
              background: 'rgba(91, 95, 227, 0.05)', 
              borderRadius: 3, 
              p: 2.5,
              border: '1px solid rgba(91, 95, 227, 0.1)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications /> Reminder Settings
                </Typography>
                <Button
                  size="small"
                  onClick={() => setFormData({ ...formData, reminderEnabled: !formData.reminderEnabled })}
                  sx={{ 
                    color: formData.reminderEnabled ? '#5B5FE3' : '#8B8FA3',
                    fontWeight: 600,
                  }}
                >
                  {formData.reminderEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </Box>
              {formData.reminderEnabled && (
                <FormControl fullWidth size="small">
                  <InputLabel>Remind me before</InputLabel>
                  <Select
                    value={formData.reminderDays}
                    onChange={(e) => setFormData({ ...formData, reminderDays: Number(e.target.value) })}
                    label="Remind me before"
                  >
                    <MenuItem value={1}>1 day before</MenuItem>
                    <MenuItem value={3}>3 days before</MenuItem>
                    <MenuItem value={7}>1 week before</MenuItem>
                    <MenuItem value={14}>2 weeks before</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#8B8FA3' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #7B7FF5 100%)',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #4345B9 0%, #5B5FE3 100%)',
              },
            }}
          >
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Grid,
  Tabs,
  Tab,
  FormLabel,
  InputAdornment,
  Switch,
} from '@mui/material';
import {
  Add,
  Receipt,
  Person,
  Percent,
  Share,
  Delete,
  AttachFile,
  CameraAlt,
  Analytics,
} from '@mui/icons-material';
import { ReceiptScanner, ReceiptData } from '@/app/components/ReceiptScanner';
import { DebtSettlement } from '@/app/components/DebtSettlement';

interface ExpenseSplittingProps {
  supabase: any;
  session: any;
}

export function ExpenseSplitting({ supabase, session }: ExpenseSplittingProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [splitType, setSplitType] = useState('equal');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    group: '',
    currency: 'USD',
    category: 'general',
    paidBy: 'you',
    recurring: false,
  });

  const [customSplits, setCustomSplits] = useState([
    { name: 'You', amount: '' },
    { name: 'Sarah', amount: '' },
    { name: 'John', amount: '' },
  ]);

  const expenses = [
    {
      id: '1',
      description: 'Grocery Shopping',
      amount: 145.50,
      paidBy: 'You',
      group: 'Family',
      date: new Date().toISOString(),
      splits: [
        { name: 'You', amount: 48.50 },
        { name: 'Sarah', amount: 48.50 },
        { name: 'John', amount: 48.50 },
      ],
      currency: 'USD',
    },
    {
      id: '2',
      description: 'Restaurant Dinner',
      amount: 280.00,
      paidBy: 'Mike',
      group: 'Roommates',
      date: new Date(Date.now() - 86400000).toISOString(),
      splits: [
        { name: 'You', amount: 70.00 },
        { name: 'Mike', amount: 70.00 },
        { name: 'Alex', amount: 70.00 },
        { name: 'Emma', amount: 70.00 },
      ],
      currency: 'USD',
    },
  ];

  const handleAddExpense = () => {
    setDialogOpen(false);
    // Reset form
    setFormData({
      description: '',
      amount: '',
      group: '',
      currency: 'USD',
      category: 'general',
      paidBy: 'you',
      recurring: false,
    });
  };

  const handleScanComplete = (data: ReceiptData) => {
    // Pre-fill form with scanned data
    setFormData({
      ...formData,
      description: data.description,
      amount: data.amount.toString(),
      category: data.category,
    });
    setDialogOpen(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Split Expenses
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CameraAlt />}
            onClick={() => setScannerOpen(true)}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Scan Receipt
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Expenses" />
          <Tab label="Settlement" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Expenses List */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {expenses.map((expense) => (
              <Grid size={{ xs: 12 }} key={expense.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {expense.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Chip label={expense.group} size="small" />
                          <Chip label={expense.category} size="small" variant="outlined" />
                          <Chip label={new Date(expense.date).toLocaleDateString()} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Paid by: <strong>{expense.paidBy}</strong>
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Split between {expense.splits.length} people
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                        Split Details:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
                        {expense.splits.map((split, idx) => (
                          <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">{split.name}</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {expense.currency} {split.amount.toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <DebtSettlement expenses={expenses} />
      )}

      {/* Receipt Scanner */}
      <ReceiptScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Add Expense Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                placeholder="What did you buy?"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  label="Currency"
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                  <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Group</InputLabel>
                <Select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  label="Group"
                >
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="roommates">Roommates</MenuItem>
                  <MenuItem value="trip">Europe Trip 2026</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="food">Food & Dining</MenuItem>
                  <MenuItem value="shopping">Shopping</MenuItem>
                  <MenuItem value="transportation">Transportation</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="entertainment">Entertainment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Split Method</FormLabel>
                <RadioGroup
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value)}
                  row
                >
                  <FormControlLabel value="equal" control={<Radio />} label="Equally" />
                  <FormControlLabel value="percentage" control={<Radio />} label="By Percentage" />
                  <FormControlLabel value="shares" control={<Radio />} label="By Shares" />
                  <FormControlLabel value="custom" control={<Radio />} label="Custom Amounts" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {splitType === 'custom' && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Enter amounts for each person:
                </Typography>
                {customSplits.map((split, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                      label="Name"
                      value={split.name}
                      onChange={(e) => {
                        const newSplits = [...customSplits];
                        newSplits[idx].name = e.target.value;
                        setCustomSplits(newSplits);
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Amount"
                      type="number"
                      value={split.amount}
                      onChange={(e) => {
                        const newSplits = [...customSplits];
                        newSplits[idx].amount = e.target.value;
                        setCustomSplits(newSplits);
                      }}
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ width: 150 }}
                    />
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" startIcon={<Add />}>
                  Add Person
                </Button>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Recurring Expense</Typography>
                <Switch
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                startIcon={<AttachFile />}
                fullWidth
              >
                Attach Receipt (Coming Soon)
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddExpense}
            variant="contained"
            disabled={!formData.description || !formData.amount}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
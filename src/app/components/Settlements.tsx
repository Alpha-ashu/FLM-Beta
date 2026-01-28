import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Payment,
  AccountBalance,
  History,
  Close,
} from '@mui/icons-material';
import { GlassCard } from '@/app/components/GlassCard';
import { DebtSettlement } from '@/app/components/DebtSettlement';
import { formatDistanceToNow } from 'date-fns';

interface SettlementsProps {
  supabase: any;
  session: any;
}

interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed';
  date: Date;
  method?: string;
  note?: string;
}

export function Settlements({ supabase, session }: SettlementsProps) {
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [settlementAmount, setSettlementAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [showOptimization, setShowOptimization] = useState(false);

  // Mock expenses data for debt simplification
  const mockExpenses = [
    { id: '1', description: 'Dinner', amount: 120, paidBy: 'You', participants: ['You', 'Sarah', 'Mike', 'John'] },
    { id: '2', description: 'Movie tickets', amount: 60, paidBy: 'Sarah', participants: ['You', 'Sarah', 'Mike'] },
    { id: '3', description: 'Gas', amount: 40, paidBy: 'Mike', participants: ['You', 'Mike'] },
    { id: '4', description: 'Groceries', amount: 80, paidBy: 'John', participants: ['You', 'John', 'Sarah'] },
  ];

  const [settlements, setSettlements] = useState<Settlement[]>([
    {
      id: '1',
      from: 'You',
      to: 'Sarah Johnson',
      amount: 125.50,
      status: 'pending',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: '2',
      from: 'Mike Chen',
      to: 'You',
      amount: 45.00,
      status: 'pending',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '3',
      from: 'You',
      to: 'John Smith',
      amount: 78.25,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      method: 'PayPal',
      note: 'Weekend trip expenses',
    },
    {
      id: '4',
      from: 'Lisa Wang',
      to: 'You',
      amount: 32.50,
      status: 'completed',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      method: 'Venmo',
    },
  ]);

  const handleOpenSettleDialog = (person: string, amount: number) => {
    setSelectedPerson(person);
    setSettlementAmount(amount.toString());
    setSettleDialogOpen(true);
  };

  const handleSettleUp = () => {
    const newSettlement: Settlement = {
      id: Date.now().toString(),
      from: 'You',
      to: selectedPerson,
      amount: parseFloat(settlementAmount),
      status: 'completed',
      date: new Date(),
      method: paymentMethod,
      note: note,
    };

    setSettlements([newSettlement, ...settlements]);
    
    // Reset form
    setSettleDialogOpen(false);
    setSelectedPerson('');
    setSettlementAmount('');
    setPaymentMethod('');
    setNote('');
  };

  const handleMarkAsCompleted = (id: string) => {
    setSettlements(settlements.map(s =>
      s.id === id ? { ...s, status: 'completed' as const } : s
    ));
  };

  const pendingSettlements = settlements.filter(s => s.status === 'pending');
  const completedSettlements = settlements.filter(s => s.status === 'completed');

  const totalPendingToReceive = pendingSettlements
    .filter(s => s.to === 'You')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalPendingToPay = pendingSettlements
    .filter(s => s.from === 'You')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Settlements
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AccountBalance />}
          onClick={() => setShowOptimization(!showOptimization)}
        >
          {showOptimization ? 'Hide' : 'Show'} Optimization
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        <GlassCard sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <TrendingUp />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending to Receive
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                ${totalPendingToReceive.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {pendingSettlements.filter(s => s.to === 'You').length} pending settlement{pendingSettlements.filter(s => s.to === 'You').length !== 1 ? 's' : ''}
          </Typography>
        </GlassCard>

        <GlassCard sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'rgba(255, 71, 87, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF4757',
              }}
            >
              <TrendingDown />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending to Pay
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF4757' }}>
                ${totalPendingToPay.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {pendingSettlements.filter(s => s.from === 'You').length} pending settlement{pendingSettlements.filter(s => s.from === 'You').length !== 1 ? 's' : ''}
          </Typography>
        </GlassCard>
      </Box>

      {/* Debt Optimization */}
      {showOptimization && (
        <Box sx={{ mb: 3 }}>
          <DebtSettlement expenses={mockExpenses} />
        </Box>
      )}

      {/* Pending Settlements */}
      {pendingSettlements.length > 0 && (
        <GlassCard sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment sx={{ color: '#00D4FF' }} />
            Pending Settlements
            <Chip
              label={pendingSettlements.length}
              size="small"
              sx={{
                background: 'rgba(0, 212, 255, 0.2)',
                color: '#00D4FF',
              }}
            />
          </Typography>

          <List sx={{ p: 0 }}>
            {pendingSettlements.map((settlement, index) => (
              <Box key={settlement.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      background: settlement.from === 'You'
                        ? 'rgba(255, 71, 87, 0.2)'
                        : 'rgba(16, 185, 129, 0.2)',
                      color: settlement.from === 'You' ? '#FF4757' : '#10b981',
                    }}
                  >
                    {settlement.from === 'You' ? <TrendingDown /> : <TrendingUp />}
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {settlement.from === 'You'
                          ? `Pay ${settlement.to}`
                          : `Receive from ${settlement.from}`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(settlement.date, { addSuffix: true })}
                      </Typography>
                    }
                  />
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: settlement.from === 'You' ? '#FF4757' : '#10b981',
                      mr: 2,
                    }}
                  >
                    {settlement.from === 'You' ? '-' : '+'}${settlement.amount.toFixed(2)}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() =>
                      settlement.from === 'You'
                        ? handleOpenSettleDialog(settlement.to, settlement.amount)
                        : handleMarkAsCompleted(settlement.id)
                    }
                  >
                    {settlement.from === 'You' ? 'Settle' : 'Mark Paid'}
                  </Button>
                </ListItem>
                
                {index < pendingSettlements.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
                )}
              </Box>
            ))}
          </List>
        </GlassCard>
      )}

      {/* Settlement History */}
      <GlassCard sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <History sx={{ color: '#00D4FF' }} />
          Settlement History
        </Typography>

        {completedSettlements.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <History sx={{ fontSize: 64, color: '#8B8FA3', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No settlement history
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {completedSettlements.map((settlement, index) => (
              <Box key={settlement.id}>
                <ListItem sx={{ py: 2, px: 2 }}>
                  <Avatar
                    sx={{
                      mr: 2,
                      background: settlement.from === 'You'
                        ? 'rgba(255, 71, 87, 0.2)'
                        : 'rgba(16, 185, 129, 0.2)',
                      color: settlement.from === 'You' ? '#FF4757' : '#10b981',
                    }}
                  >
                    <CheckCircle />
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {settlement.from === 'You'
                            ? `Paid ${settlement.to}`
                            : `Received from ${settlement.from}`}
                        </Typography>
                        {settlement.note && (
                          <Typography variant="caption" color="text.secondary">
                            {settlement.note}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <span style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {formatDistanceToNow(settlement.date, { addSuffix: true })}
                        </Typography>
                        {settlement.method && (
                          <>
                            <Typography component="span" variant="caption" color="text.secondary">•</Typography>
                            <Chip
                              label={settlement.method}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                background: 'rgba(0, 212, 255, 0.2)',
                                color: '#00D4FF',
                              }}
                            />
                          </>
                        )}
                      </span>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: settlement.from === 'You' ? '#FF4757' : '#10b981',
                    }}
                  >
                    {settlement.from === 'You' ? '-' : '+'}${settlement.amount.toFixed(2)}
                  </Typography>
                </ListItem>
                
                {index < completedSettlements.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.1)' }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </GlassCard>

      {/* Settle Up Dialog */}
      <Dialog
        open={settleDialogOpen}
        onClose={() => setSettleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 25, 50, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Settle Up with {selectedPerson}
            <IconButton onClick={() => setSettleDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <Alert severity="info">
              Recording a payment to {selectedPerson}
            </Alert>

            <TextField
              label="Amount"
              type="number"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="venmo">Venmo</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="zelle">Zelle</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettleDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSettleUp}
            disabled={!settlementAmount || !paymentMethod}
            startIcon={<CheckCircle />}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
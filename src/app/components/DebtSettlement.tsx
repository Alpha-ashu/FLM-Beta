import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Alert,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  SwapHoriz,
} from '@mui/icons-material';
import { simplifyDebts, calculateBalances, getSettlementPlan } from '@/app/utils/debtSimplification';

interface DebtSettlementProps {
  expenses: Array<{
    id: string;
    amount: number;
    paidBy: string;
    splits: Array<{ name: string; amount: number }>;
  }>;
}

export function DebtSettlement({ expenses }: DebtSettlementProps) {
  const [settlement, setSettlement] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (expenses.length > 0) {
      const plan = getSettlementPlan(expenses);
      setSettlement(plan);
    }
  }, [expenses]);

  if (!settlement || expenses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Debt Settlement
          </Typography>
          <Alert severity="info">
            No expenses to settle. Add some expenses to see the settlement plan.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { balances, transactions, summary } = settlement;
  const savingsPercentage = summary.totalTransactions > 0 
    ? ((summary.totalTransactions - summary.simplifiedTransactions) / summary.totalTransactions * 100)
    : 0;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Debt Settlement Plan
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalance sx={{ color: 'white', mr: 1 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Total Amount
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                ${summary.totalExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SwapHoriz sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Transactions Needed
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {summary.simplifiedTransactions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Simplified from {summary.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Efficiency Gain
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {savingsPercentage.toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fewer transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Settlement Transactions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Settlement Transactions
          </Typography>
          
          {transactions.length === 0 ? (
            <Alert severity="success" icon={<CheckCircle />}>
              All settled! No transactions needed.
            </Alert>
          ) : (
            <List>
              {transactions.map((transaction, index) => (
                <Box key={index}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={transaction.from} 
                            size="small" 
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            pays
                          </Typography>
                          <Chip 
                            label={transaction.to} 
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Settlement amount
                        </Typography>
                      }
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${transaction.amount.toFixed(2)}
                    </Typography>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Individual Balances */}
      <Card>
        <CardContent>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={() => setShowDetails(!showDetails)}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Individual Balances
            </Typography>
            <IconButton size="small">
              {showDetails ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showDetails}>
            <List>
              {balances.map((balance, index) => (
                <Box key={index}>
                  {index > 0 && <Divider sx={{ my: 1 }} />}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {balance.balance >= 0 ? (
                        <TrendingUp sx={{ color: 'success.main' }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {balance.person}
                        </Typography>
                      }
                      secondary={
                        balance.balance >= 0 
                          ? `Gets back $${balance.balance.toFixed(2)}`
                          : `Owes $${Math.abs(balance.balance).toFixed(2)}`
                      }
                    />
                    <Chip
                      label={balance.balance >= 0 ? 'Owed' : 'Owes'}
                      color={balance.balance >= 0 ? 'success' : 'error'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: balance.balance >= 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      ${Math.abs(balance.balance).toFixed(2)}
                    </Typography>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Collapse>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>How it works:</strong> Our algorithm minimizes the number of transactions needed 
          to settle all debts. Instead of everyone paying back the exact person who paid, 
          we find the most efficient way to settle up.
        </Typography>
      </Alert>
    </Box>
  );
}
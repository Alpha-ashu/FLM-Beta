import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Add,
  AccountBalance,
  CreditCard,
  AccountBalanceWallet,
  Wallet,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { motion } from 'motion/react';

interface Account {
  id: string;
  name: string;
  type: 'bank' | 'credit-card' | 'digital-wallet' | 'physical-wallet';
  balance: number;
  currency: string;
  lastFourDigits?: string;
  institution?: string;
  color: string;
}

interface AccountsManagerProps {
  supabase?: any;
  session?: any;
}

const accountTypeIcons = {
  'bank': AccountBalance,
  'credit-card': CreditCard,
  'digital-wallet': AccountBalanceWallet,
  'physical-wallet': Wallet,
};

const accountColors = [
  '#5B5FE3',
  '#00D4FF',
  '#10E584',
  '#FF5C7C',
  '#FFB547',
  '#A855F7',
  '#EC4899',
  '#14B8A6',
];

export function AccountsManager({ supabase, session }: AccountsManagerProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [hideBalances, setHideBalances] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as Account['type'],
    balance: '',
    currency: '$',
    lastFourDigits: '',
    institution: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const storedAccounts = localStorage.getItem('financelife_accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    } else {
      // Initialize with empty accounts for live deployment
      setAccounts([]);
    }
  };

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('financelife_accounts', JSON.stringify(newAccounts));
  };

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        currency: account.currency,
        lastFourDigits: account.lastFourDigits || '',
        institution: account.institution || '',
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: '',
        type: 'bank',
        balance: '',
        currency: '$',
        lastFourDigits: '',
        institution: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
  };

  const handleSaveAccount = () => {
    if (!formData.name || !formData.balance) return;

    const newAccount: Account = {
      id: editingAccount?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      currency: formData.currency,
      lastFourDigits: formData.lastFourDigits,
      institution: formData.institution,
      color: editingAccount?.color || accountColors[accounts.length % accountColors.length],
    };

    if (editingAccount) {
      const updatedAccounts = accounts.map((acc) =>
        acc.id === editingAccount.id ? newAccount : acc
      );
      saveAccounts(updatedAccounts);
    } else {
      saveAccounts([...accounts, newAccount]);
    }

    handleCloseDialog();
  };

  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter((acc) => acc.id !== id);
    saveAccounts(updatedAccounts);
  };

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.type === 'credit-card') {
      return sum - acc.balance; // Credit card balance is debt
    }
    return sum + acc.balance;
  }, 0);

  const accountsByType = {
    bank: accounts.filter((a) => a.type === 'bank'),
    'credit-card': accounts.filter((a) => a.type === 'credit-card'),
    'digital-wallet': accounts.filter((a) => a.type === 'digital-wallet'),
    'physical-wallet': accounts.filter((a) => a.type === 'physical-wallet'),
  };

  const formatBalance = (amount: number, currency: string) => {
    if (hideBalances) return '••••••';
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3142', mb: 1 }}>
            My Accounts
          </Typography>
          <Typography variant="body1" sx={{ color: '#8B8FA3' }}>
            Manage all your financial accounts in one place
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setHideBalances(!hideBalances)}
            sx={{
              background: 'rgba(91, 95, 227, 0.1)',
              '&:hover': { background: 'rgba(91, 95, 227, 0.2)' },
            }}
          >
            {hideBalances ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
              borderRadius: 3,
              px: 3,
            }}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      {/* Total Net Worth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: 'white',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            Total Net Worth
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {formatBalance(totalBalance, '$')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Total Assets
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatBalance(
                  accounts
                    .filter((a) => a.type !== 'credit-card')
                    .reduce((sum, a) => sum + a.balance, 0),
                  '$'
                )}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Total Debt
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatBalance(
                  accounts
                    .filter((a) => a.type === 'credit-card')
                    .reduce((sum, a) => sum + a.balance, 0),
                  '$'
                )}
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>

      {/* Account Categories */}
      {Object.entries(accountsByType).map(([type, typeAccounts]) => {
        if (typeAccounts.length === 0) return null;

        const Icon = accountTypeIcons[type as Account['type']];
        const typeLabels = {
          bank: 'Bank Accounts',
          'credit-card': 'Credit Cards',
          'digital-wallet': 'Digital Wallets',
          'physical-wallet': 'Physical Wallets',
        };

        return (
          <Box key={type} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Icon sx={{ color: '#5B5FE3' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3142' }}>
                {typeLabels[type as Account['type']]}
              </Typography>
              <Chip
                label={typeAccounts.length}
                size="small"
                sx={{
                  background: 'rgba(91, 95, 227, 0.1)',
                  color: '#5B5FE3',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Grid container spacing={2}>
              {typeAccounts.map((account, index) => (
                <Grid component="div" xs={12} sm={6} md={4} key={account.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        p: 3,
                        background: `linear-gradient(135deg, ${account.color}15 0%, ${account.color}05 100%)`,
                        border: `2px solid ${account.color}30`,
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                          boxShadow: `0 8px 24px ${account.color}40`,
                          transform: 'translateY(-4px)',
                          transition: 'all 0.3s',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar
                          sx={{
                            background: account.color,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Icon />
                        </Avatar>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(account)}
                            sx={{ color: '#8B8FA3' }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAccount(account.id)}
                            sx={{ color: '#FF5C7C' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#2D3142' }}>
                        {account.name}
                      </Typography>

                      {account.institution && (
                        <Typography variant="caption" sx={{ color: '#8B8FA3', display: 'block', mb: 2 }}>
                          {account.institution}
                          {account.lastFourDigits && ` •••• ${account.lastFourDigits}`}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#8B8FA3' }}>
                            {account.type === 'credit-card' ? 'Outstanding' : 'Balance'}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: account.color }}>
                            {formatBalance(account.balance, account.currency)}
                          </Typography>
                        </Box>
                        {account.type === 'credit-card' ? (
                          <TrendingDown sx={{ color: '#FF5C7C' }} />
                        ) : (
                          <TrendingUp sx={{ color: '#10E584' }} />
                        )}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {accounts.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <AccountBalance sx={{ fontSize: 80, color: '#8B8FA3', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#8B8FA3', mb: 1 }}>
            No accounts added yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B8FA3', mb: 3 }}>
            Add your first account to start tracking your finances
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
            }}
          >
            Add Account
          </Button>
        </Box>
      )}

      {/* Add/Edit Account Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Account Type"
              select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
              fullWidth
            >
              <MenuItem value="bank">Bank Account</MenuItem>
              <MenuItem value="credit-card">Credit Card</MenuItem>
              <MenuItem value="digital-wallet">Digital Wallet</MenuItem>
              <MenuItem value="physical-wallet">Physical Wallet</MenuItem>
            </TextField>

            <TextField
              label="Account Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Primary Checking"
              fullWidth
            />

            {(formData.type === 'bank' || formData.type === 'credit-card') && (
              <>
                <TextField
                  label="Institution Name"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., Chase Bank"
                  fullWidth
                />
                <TextField
                  label="Last 4 Digits"
                  value={formData.lastFourDigits}
                  onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
                  placeholder="1234"
                  inputProps={{ maxLength: 4 }}
                  fullWidth
                />
              </>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Currency"
                select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                sx={{ width: 120 }}
              >
                <MenuItem value="$">USD ($)</MenuItem>
                <MenuItem value="€">EUR (€)</MenuItem>
                <MenuItem value="₹">INR (₹)</MenuItem>
                <MenuItem value="£">GBP (£)</MenuItem>
              </TextField>

              <TextField
                label={formData.type === 'credit-card' ? 'Outstanding Balance' : 'Current Balance'}
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="0.00"
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveAccount}
            variant="contained"
            disabled={!formData.name || !formData.balance}
          >
            {editingAccount ? 'Save Changes' : 'Add Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

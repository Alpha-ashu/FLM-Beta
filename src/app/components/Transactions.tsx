import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Delete,
  TrendingUp,
  TrendingDown,
  Receipt,
  GetApp,
  Publish,
} from '@mui/icons-material';
import { LoadingState } from '@/app/components/LoadingState';
import { EmptyState } from '@/app/components/EmptyState';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useCurrency } from '@/app/contexts/CurrencyContext';

interface TransactionsProps {
  supabase: any;
  session: any;
}

export function Transactions({ supabase, session }: TransactionsProps) {
  const { selectedCurrency, convertAmount } = useCurrency();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    portfolioId: 'default',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
    expense: ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Education', 'Other'],
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (isDemoMode) {
        // Use mock data for demo mode
        const mockTransactions = [
          { 
            id: '1', 
            description: 'Monthly Salary', 
            category: 'Salary', 
            date: new Date().toISOString(), 
            amount: 5000, 
            type: 'income' 
          },
          { 
            id: '2', 
            description: 'Grocery Shopping at Whole Foods', 
            category: 'Food', 
            date: new Date(Date.now() - 86400000).toISOString(), 
            amount: 150, 
            type: 'expense' 
          },
          { 
            id: '3', 
            description: 'Freelance Web Design Project', 
            category: 'Freelance', 
            date: new Date(Date.now() - 172800000).toISOString(), 
            amount: 1200, 
            type: 'income' 
          },
          { 
            id: '4', 
            description: 'Electric Bill Payment', 
            category: 'Bills', 
            date: new Date(Date.now() - 259200000).toISOString(), 
            amount: 120, 
            type: 'expense' 
          },
          { 
            id: '5', 
            description: 'Dinner at Italian Restaurant', 
            category: 'Food', 
            date: new Date(Date.now() - 345600000).toISOString(), 
            amount: 85, 
            type: 'expense' 
          },
          { 
            id: '6', 
            description: 'Uber Rides', 
            category: 'Transport', 
            date: new Date(Date.now() - 432000000).toISOString(), 
            amount: 45, 
            type: 'expense' 
          },
          { 
            id: '7', 
            description: 'Monthly Rent', 
            category: 'Housing', 
            date: new Date(Date.now() - 518400000).toISOString(), 
            amount: 1800, 
            type: 'expense' 
          },
          { 
            id: '8', 
            description: 'Stock Dividend Payment', 
            category: 'Investment', 
            date: new Date(Date.now() - 604800000).toISOString(), 
            amount: 250, 
            type: 'income' 
          },
          { 
            id: '9', 
            description: 'Movie Tickets', 
            category: 'Entertainment', 
            date: new Date(Date.now() - 691200000).toISOString(), 
            amount: 40, 
            type: 'expense' 
          },
          { 
            id: '10', 
            description: 'Doctor Visit', 
            category: 'Healthcare', 
            date: new Date(Date.now() - 777600000).toISOString(), 
            amount: 150, 
            type: 'expense' 
          },
        ];
        
        setTransactions(mockTransactions);
        setLoading(false);
        return;
      }

      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/transactions?portfolioId=default`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      const accessToken = session.access_token;
      await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/transactions/${id}?portfolioId=default`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(transactions.map(tx => ({
      Date: new Date(tx.date).toLocaleDateString(),
      Type: tx.type,
      Category: tx.category,
      Description: tx.description,
      Amount: tx.amount,
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  const exportJSON = () => {
    const json = JSON.stringify(transactions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'transactions.json');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transactions', 20, 10);
    const tableData = transactions.map(tx => [
      new Date(tx.date).toLocaleDateString(),
      tx.type,
      tx.category,
      tx.description,
      `${selectedCurrency}${convertAmount(parseFloat(tx.amount), 'USD', selectedCurrency).toLocaleString()}`,
    ]);
    (doc as any).autoTable({
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: tableData,
    });
    doc.save('transactions.pdf');
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const importedTransactions = (results.data as any[]).map((row: any) => ({
            type: row.Type?.toLowerCase(),
            category: row.Category,
            amount: row.Amount,
            description: row.Description,
            date: new Date(row.Date).toISOString().split('T')[0],
            portfolioId: 'default',
          })).filter(tx => tx.type && tx.category && tx.amount && tx.description);

          // Add each transaction
          for (const tx of importedTransactions) {
            await handleAddTransaction(tx);
          }
          fetchTransactions();
        },
      });
    }
  };

  const handleAddTransaction = async (data = formData) => {
    try {
      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        if (data === formData) {
          setDialogOpen(false);
          setFormData({
            type: 'expense',
            category: '',
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            portfolioId: 'default',
          });
        }
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={exportCSV}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={exportJSON}
            size="small"
          >
            Export JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={exportPDF}
            size="small"
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Publish />}
            onClick={handleImportCSV}
            size="small"
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2 }, overflow: 'auto' }}>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Date</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Type</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Category</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Amount</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          icon={tx.type === 'income' ? <TrendingUp /> : <TrendingDown />}
                          label={tx.type}
                          color={tx.type === 'income' ? 'success' : 'error'}
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{tx.category}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{tx.description}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {tx.type === 'income' ? '+' : '-'}{selectedCurrency}{convertAmount(parseFloat(tx.amount), 'USD', selectedCurrency).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(tx.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <EmptyState
                        icon={<Receipt />}
                        title="No transactions yet"
                        description="Click 'Add Transaction' to get started!"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories[formData.type as 'income' | 'expense'].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleAddTransaction()}
            variant="contained"
            disabled={!formData.category || !formData.amount || !formData.description}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
    </Box>
  );
}
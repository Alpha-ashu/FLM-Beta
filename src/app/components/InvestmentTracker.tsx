import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Delete,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { LoadingState } from '@/app/components/LoadingState';
import { EmptyState } from '@/app/components/EmptyState';
import axios from 'axios';
import { useCurrency } from '@/app/contexts/CurrencyContext';

interface InvestmentTrackerProps {
  supabase: any;
  session: any;
}

interface Holding {
  id: string;
  symbol: string;
  type: 'stock' | 'crypto';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export function InvestmentTracker({ supabase, session }: InvestmentTrackerProps) {
  const { selectedCurrency, convertAmount } = useCurrency();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'stock' as 'stock' | 'crypto',
    quantity: '',
    purchasePrice: '',
  });

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      const mockHoldings: Holding[] = [
        {
          id: '1',
          symbol: 'AAPL',
          type: 'stock',
          quantity: 10,
          purchasePrice: 150,
          currentPrice: 175,
          totalValue: 1750,
          gainLoss: 250,
          gainLossPercent: 16.67,
        },
        {
          id: '2',
          symbol: 'BTC',
          type: 'crypto',
          quantity: 0.5,
          purchasePrice: 30000,
          currentPrice: 45000,
          totalValue: 22500,
          gainLoss: 7500,
          gainLossPercent: 25,
        },
      ];

      // Fetch real prices
      for (const holding of mockHoldings) {
        const price = await fetchPrice(holding.symbol, holding.type);
        if (price) {
          holding.currentPrice = price;
          holding.totalValue = holding.quantity * price;
          holding.gainLoss = holding.totalValue - (holding.quantity * holding.purchasePrice);
          holding.gainLossPercent = ((price - holding.purchasePrice) / holding.purchasePrice) * 100;
        }
      }

      setHoldings(mockHoldings);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async (symbol: string, type: 'stock' | 'crypto'): Promise<number | null> => {
    try {
      if (type === 'stock') {
        // Alpha Vantage API
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=YOUR_API_KEY`);
        const price = parseFloat(response.data['Global Quote']['05. price']);
        return price;
      } else {
        // For crypto, use CoinGecko or similar
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
        return response.data[symbol.toLowerCase()]?.usd || null;
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  };

  const handleAddHolding = async () => {
    try {
      const quantity = parseFloat(formData.quantity);
      const purchasePrice = parseFloat(formData.purchasePrice);
      const price = await fetchPrice(formData.symbol, formData.type);
      const currentPrice = price || purchasePrice;
      const totalValue = quantity * currentPrice;
      const gainLoss = totalValue - (quantity * purchasePrice);
      const gainLossPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100;

      const newHolding: Holding = {
        id: Date.now().toString(),
        symbol: formData.symbol.toUpperCase(),
        type: formData.type,
        quantity,
        purchasePrice,
        currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
      };

      setHoldings([...holdings, newHolding]);
      setDialogOpen(false);
      setFormData({
        symbol: '',
        type: 'stock',
        quantity: '',
        purchasePrice: '',
      });
    } catch (error) {
      console.error('Error adding holding:', error);
    }
  };

  const handleDelete = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalGainLoss = holdings.reduce((sum, h) => sum + h.gainLoss, 0);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Investment Portfolio
        </Typography>
        <Button
          className="btn-gradient"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Holding
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        <Card className="glass-card animate-fade-in">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h4" color="primary">
              {selectedCurrency}{convertAmount(totalPortfolioValue, 'USD', selectedCurrency).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card className="glass-card animate-fade-in">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Gain/Loss
            </Typography>
            <Typography variant="h4" color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}>
              {totalGainLoss >= 0 ? '+' : ''}{selectedCurrency}{convertAmount(Math.abs(totalGainLoss), 'USD', selectedCurrency).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card className="glass-card animate-fade-in">
        <CardContent sx={{ p: { xs: 1, sm: 2 }, overflow: 'auto' }}>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Symbol</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Type</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Purchase Price</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Current Price</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Total Value</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Gain/Loss</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.length > 0 ? (
                  holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{holding.symbol}</TableCell>
                      <TableCell>
                        <Chip
                          label={holding.type}
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{holding.quantity}</TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {selectedCurrency}{convertAmount(holding.purchasePrice, 'USD', selectedCurrency).toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {selectedCurrency}{convertAmount(holding.currentPrice, 'USD', selectedCurrency).toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {selectedCurrency}{convertAmount(holding.totalValue, 'USD', selectedCurrency).toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {holding.gainLoss >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                          <Typography color={holding.gainLoss >= 0 ? 'success.main' : 'error.main'}>
                            {holding.gainLoss >= 0 ? '+' : ''}{selectedCurrency}{convertAmount(Math.abs(holding.gainLoss), 'USD', selectedCurrency).toLocaleString()} ({holding.gainLossPercent.toFixed(2)}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(holding.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <EmptyState
                        icon={<TrendingUp />}
                        title="No investments yet"
                        description="Click 'Add Holding' to start tracking your portfolio!"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(20, 25, 50, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px' } }}>
        <DialogTitle>Add Investment Holding</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'stock' | 'crypto' })}
            >
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="crypto">Cryptocurrency</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Symbol (e.g., AAPL, BTC)"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Purchase Price (USD)"
            type="number"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            className="btn-gradient"
            onClick={handleAddHolding}
            disabled={!formData.symbol || !formData.quantity || !formData.purchasePrice}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
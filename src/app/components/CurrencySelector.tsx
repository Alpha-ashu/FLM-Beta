import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from '@mui/material';
import { useCurrency } from '@/app/contexts/CurrencyContext';

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  // Add more as needed
];

export const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency, loading } = useCurrency();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        Loading currencies...
      </Box>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Currency</InputLabel>
      <Select
        value={selectedCurrency}
        label="Currency"
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        {currencies.map((currency) => (
          <MenuItem key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
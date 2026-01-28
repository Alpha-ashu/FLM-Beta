import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from '@mui/material';
import { Calculate } from '@mui/icons-material';
import { useCurrency } from '@/app/contexts/CurrencyContext';

interface TaxCalculatorProps {
  supabase: any;
  session: any;
}

interface TaxData {
  filingStatus: 'single' | 'married';
  income: number;
  deductions: number;
  credits: number;
}

export function TaxCalculator({ supabase, session }: TaxCalculatorProps) {
  const { selectedCurrency, convertAmount } = useCurrency();
  const [taxData, setTaxData] = useState<TaxData>({
    filingStatus: 'single',
    income: 0,
    deductions: 0,
    credits: 0,
  });
  const [calculatedTax, setCalculatedTax] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);

  // US Federal Tax Brackets 2024
  const taxBrackets = {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
    married: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ],
  };

  const calculateTax = () => {
    const taxableIncome = Math.max(0, taxData.income - taxData.deductions);
    const brackets = taxBrackets[taxData.filingStatus];
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      const bracketIncome = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += bracketIncome * bracket.rate;
      remainingIncome -= bracketIncome;
    }

    const finalTax = Math.max(0, tax - taxData.credits);
    setCalculatedTax(finalTax);
    setEffectiveRate(taxableIncome > 0 ? (finalTax / taxableIncome) * 100 : 0);
  };

  useEffect(() => {
    calculateTax();
  }, [taxData]);

  const deductions = [
    { category: 'Standard Deduction', amount: taxData.filingStatus === 'single' ? 14600 : 29200 },
    { category: 'Medical Expenses', amount: 0 },
    { category: 'State Taxes', amount: 0 },
    { category: 'Home Mortgage Interest', amount: 0 },
    { category: 'Charitable Donations', amount: 0 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Tax Calculator
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tax Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label="Single"
                onClick={() => setTaxData({ ...taxData, filingStatus: 'single' })}
                color={taxData.filingStatus === 'single' ? 'primary' : 'default'}
                variant={taxData.filingStatus === 'single' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Married Filing Jointly"
                onClick={() => setTaxData({ ...taxData, filingStatus: 'married' })}
                color={taxData.filingStatus === 'married' ? 'primary' : 'default'}
                variant={taxData.filingStatus === 'married' ? 'filled' : 'outlined'}
              />
            </Box>
            <TextField
              fullWidth
              label="Annual Income"
              type="number"
              value={taxData.income}
              onChange={(e) => setTaxData({ ...taxData, income: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Deductions"
              type="number"
              value={taxData.deductions}
              onChange={(e) => setTaxData({ ...taxData, deductions: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tax Credits"
              type="number"
              value={taxData.credits}
              onChange={(e) => setTaxData({ ...taxData, credits: parseFloat(e.target.value) || 0 })}
              margin="normal"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tax Calculation Results
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Taxable Income
              </Typography>
              <Typography variant="h6">
                {selectedCurrency}{convertAmount(Math.max(0, taxData.income - taxData.deductions), 'USD', selectedCurrency).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Estimated Tax
              </Typography>
              <Typography variant="h6" color="error.main">
                {selectedCurrency}{convertAmount(calculatedTax, 'USD', selectedCurrency).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Effective Tax Rate
              </Typography>
              <Typography variant="h6">
                {effectiveRate.toFixed(2)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                After-Tax Income
              </Typography>
              <Typography variant="h6" color="success.main">
                {selectedCurrency}{convertAmount(Math.max(0, taxData.income - calculatedTax), 'USD', selectedCurrency).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Common Deductions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Standard Amount</TableCell>
                  <TableCell align="right">Your Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deductions.map((deduction) => (
                  <TableRow key={deduction.category}>
                    <TableCell>{deduction.category}</TableCell>
                    <TableCell align="right">
                      {selectedCurrency}{convertAmount(deduction.amount, 'USD', selectedCurrency).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        defaultValue={deduction.amount}
                        onChange={(e) => {
                          // Could update deductions here
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tax Planning Tips
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Maximize Deductions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consider itemizing deductions if they exceed the standard deduction. Track charitable contributions and home office expenses.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tax-Advantaged Accounts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contribute to 401(k), IRA, or HSA accounts to reduce taxable income and grow savings tax-free.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Capital Gains
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hold investments for over a year to qualify for lower long-term capital gains rates.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quarterly Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you expect to owe $1,000+ in taxes, consider making quarterly estimated payments to avoid penalties.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
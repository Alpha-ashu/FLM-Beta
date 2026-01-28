import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
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
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Calculate,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CalculatorsProps {
  supabase: any;
  session: any;
}

export function Calculators({ supabase, session }: CalculatorsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  // Lumpsum Calculator State
  const [lumpsumAmount, setLumpsumAmount] = useState('100000');
  const [lumpsumRate, setLumpsumRate] = useState('12');
  const [lumpsumYears, setLumpsumYears] = useState('10');

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState('1000000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [loanTenure, setLoanTenure] = useState('20');

  // Retirement Calculator State
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [monthlyExpense, setMonthlyExpense] = useState('50000');
  const [inflationRate, setInflationRate] = useState('6');
  const [expectedReturn, setExpectedReturn] = useState('12');

  // PPF Calculator State
  const [ppfAmount, setPpfAmount] = useState('150000');
  const [ppfYears, setPpfYears] = useState('15');
  const ppfRate = 7.1; // Current PPF rate

  // FD Calculator State
  const [fdAmount, setFdAmount] = useState('100000');
  const [fdRate, setFdRate] = useState('6.5');
  const [fdYears, setFdYears] = useState('5');

  // SIP Calculation
  const calculateSIP = () => {
    const P = parseFloat(sipAmount);
    const r = parseFloat(sipRate) / 100 / 12;
    const n = parseFloat(sipYears) * 12;
    
    if (!P || !r || !n) return { maturityAmount: 0, invested: 0, gains: 0 };
    
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = P * n;
    const gains = maturityAmount - invested;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      invested: Math.round(invested),
      gains: Math.round(gains),
    };
  };

  // Lumpsum Calculation
  const calculateLumpsum = () => {
    const P = parseFloat(lumpsumAmount);
    const r = parseFloat(lumpsumRate) / 100;
    const n = parseFloat(lumpsumYears);
    
    if (!P || !r || !n) return { maturityAmount: 0, invested: 0, gains: 0 };
    
    const maturityAmount = P * Math.pow(1 + r, n);
    const invested = P;
    const gains = maturityAmount - invested;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      invested: Math.round(invested),
      gains: Math.round(gains),
    };
  };

  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTenure) * 12;
    
    if (!P || !r || !n) return { emi: 0, totalAmount: 0, totalInterest: 0 };
    
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
    };
  };

  // Retirement Calculation
  const calculateRetirement = () => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const expense = parseFloat(monthlyExpense);
    const inflation = parseFloat(inflationRate) / 100;
    const returns = parseFloat(expectedReturn) / 100;
    
    if (!age || !retAge || !expense || !inflation || !returns) {
      return { corpusNeeded: 0, monthlySavings: 0 };
    }
    
    const yearsToRetirement = retAge - age;
    const retirementYears = 25; // Assume 25 years post retirement
    
    // Future value of monthly expenses at retirement
    const futureExpense = expense * Math.pow(1 + inflation, yearsToRetirement);
    
    // Corpus needed
    const corpusNeeded = (futureExpense * 12 * retirementYears) / Math.pow(1 + returns - inflation, retirementYears);
    
    // Monthly savings needed (SIP formula reversed)
    const r = returns / 12;
    const n = yearsToRetirement * 12;
    const monthlySavings = corpusNeeded / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    
    return {
      corpusNeeded: Math.round(corpusNeeded),
      monthlySavings: Math.round(monthlySavings),
      futureExpense: Math.round(futureExpense),
    };
  };

  // PPF Calculation
  const calculatePPF = () => {
    const P = parseFloat(ppfAmount);
    const r = ppfRate / 100;
    const n = parseFloat(ppfYears);
    
    if (!P || !n) return { maturityAmount: 0, invested: 0, interest: 0 };
    
    // PPF compound interest formula
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r));
    const invested = P * n;
    const interest = maturityAmount - invested;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      invested: Math.round(invested),
      interest: Math.round(interest),
    };
  };

  // FD Calculation
  const calculateFD = () => {
    const P = parseFloat(fdAmount);
    const r = parseFloat(fdRate) / 100;
    const n = parseFloat(fdYears);
    
    if (!P || !r || !n) return { maturityAmount: 0, invested: 0, interest: 0 };
    
    const maturityAmount = P * Math.pow(1 + r, n);
    const invested = P;
    const interest = maturityAmount - invested;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      invested: Math.round(invested),
      interest: Math.round(interest),
    };
  };

  const sipResults = calculateSIP();
  const lumpsumResults = calculateLumpsum();
  const emiResults = calculateEMI();
  const retirementResults = calculateRetirement();
  const ppfResults = calculatePPF();
  const fdResults = calculateFD();

  // Generate year-wise data for SIP
  const generateSIPData = () => {
    const data = [];
    const P = parseFloat(sipAmount);
    const r = parseFloat(sipRate) / 100 / 12;
    const years = parseInt(sipYears);
    
    for (let year = 1; year <= years; year++) {
      const n = year * 12;
      const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const invested = P * n;
      data.push({
        year,
        invested: Math.round(invested),
        value: Math.round(maturityAmount),
      });
    }
    return data;
  };

  const calculatorTabs = [
    { label: 'SIP', icon: <Calculate /> },
    { label: 'Lumpsum', icon: <Calculate /> },
    { label: 'EMI', icon: <Calculate /> },
    { label: 'Retirement', icon: <Calculate /> },
    { label: 'PPF', icon: <Calculate /> },
    { label: 'FD', icon: <Calculate /> },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Financial Calculators
      </Typography>

      <Card sx={{ mb: 3, overflow: 'auto' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {calculatorTabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: { xs: 56, sm: 64 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
            />
          ))}
        </Tabs>
      </Card>

      {/* SIP Calculator */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  SIP Investment Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Monthly Investment (₹)"
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expected Annual Return (%)"
                  type="number"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Investment Period (Years)"
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Invested Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{sipResults.invested.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Estimated Returns
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{sipResults.gains.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Value
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{sipResults.maturityAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Growth Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateSIPData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="invested" stroke="#6366f1" name="Invested" strokeWidth={2} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" name="Total Value" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Lumpsum Calculator */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Lumpsum Investment Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Investment Amount (₹)"
                  type="number"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expected Annual Return (%)"
                  type="number"
                  value={lumpsumRate}
                  onChange={(e) => setLumpsumRate(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Investment Period (Years)"
                  type="number"
                  value={lumpsumYears}
                  onChange={(e) => setLumpsumYears(e.target.value)}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Invested Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{lumpsumResults.invested.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Estimated Returns
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{lumpsumResults.gains.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Value
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{lumpsumResults.maturityAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* EMI Calculator */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  EMI Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Loan Amount (₹)"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Interest Rate (% per annum)"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Loan Tenure (Years)"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Monthly EMI
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{emiResults.emi.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Interest
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{emiResults.totalInterest.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{emiResults.totalAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Principal Amount:</strong> ₹{parseFloat(loanAmount).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Total Interest Payable:</strong> ₹{emiResults.totalInterest.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Payment:</strong> ₹{emiResults.totalAmount.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Retirement Calculator */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Retirement Planning Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Current Age"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Retirement Age"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Current Monthly Expenses (₹)"
                  type="number"
                  value={monthlyExpense}
                  onChange={(e) => setMonthlyExpense(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expected Inflation Rate (%)"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expected Return on Investment (%)"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Retirement Corpus Needed
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{(retirementResults.corpusNeeded / 10000000).toFixed(2)}Cr
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Monthly Savings Required
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{retirementResults.monthlySavings.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Years to Retirement:</strong> {parseInt(retirementAge) - parseInt(currentAge)} years
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Monthly Expense at Retirement:</strong> ₹{retirementResults.futureExpense?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    * Calculations assume 25 years of post-retirement life
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* PPF Calculator */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  PPF Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Yearly Investment (₹)"
                  type="number"
                  value={ppfAmount}
                  onChange={(e) => setPpfAmount(e.target.value)}
                  margin="normal"
                  helperText="Maximum: ₹1,50,000 per year"
                />
                <TextField
                  fullWidth
                  label="Investment Period (Years)"
                  type="number"
                  value={ppfYears}
                  onChange={(e) => setPpfYears(e.target.value)}
                  margin="normal"
                  helperText="Minimum: 15 years"
                />
                <Chip 
                  label={`Current PPF Rate: ${ppfRate}% p.a.`} 
                  color="primary" 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Invested
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{ppfResults.invested.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Interest Earned
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{ppfResults.interest.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Maturity Value
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{ppfResults.maturityAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* FD Calculator */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Fixed Deposit Calculator
                </Typography>
                <TextField
                  fullWidth
                  label="Deposit Amount (₹)"
                  type="number"
                  value={fdAmount}
                  onChange={(e) => setFdAmount(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Interest Rate (% per annum)"
                  type="number"
                  value={fdRate}
                  onChange={(e) => setFdRate(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tenure (Years)"
                  type="number"
                  value={fdYears}
                  onChange={(e) => setFdYears(e.target.value)}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Principal Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{fdResults.invested.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Interest Earned
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{fdResults.interest.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', borderRadius: 2, color: 'white' }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Maturity Value
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                        ₹{fdResults.maturityAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
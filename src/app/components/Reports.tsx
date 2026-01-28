import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Assessment, GetApp } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportsProps {
  supabase: any;
  session: any;
}

export function Reports({ supabase, session }: ReportsProps) {
  const [period, setPeriod] = useState('monthly');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (isDemoMode) {
        // Use mock data for demo mode
        const mockReport = {
          summary: {
            totalIncome: 8500,
            totalExpenses: 5200,
            netSavings: 3300,
            savingsRate: 38.8,
          },
          categoryBreakdown: {
            'Food & Dining': { total: 1200, percentage: 23.1 },
            'Shopping': { total: 800, percentage: 15.4 },
            'Transportation': { total: 600, percentage: 11.5 },
            'Utilities': { total: 400, percentage: 7.7 },
            'Entertainment': { total: 500, percentage: 9.6 },
            'Healthcare': { total: 700, percentage: 13.5 },
            'Other': { total: 1000, percentage: 19.2 },
          },
          insights: [
            'Your savings rate of 38.8% is excellent and well above the recommended 20%.',
            'Food & Dining is your largest expense category at $1,200 per month.',
            'You\'re on track to meet your emergency fund goal in 12 months.',
          ],
        };
        
        setReport(mockReport);
        setLoading(false);
        return;
      }

      const accessToken = session.access_token;
      const res = await fetch(
        `https://${supabase.supabaseUrl.split('//')[1]}/functions/v1/make-server-e9ec81de/reports?portfolioId=default&period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('financial_report.pdf');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Financial Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={exportPDF}
            size="small"
          >
            Export PDF
          </Button>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="annual">Annual</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box>
        <Card ref={reportRef}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight={600}>
                Summary Report - {period.charAt(0).toUpperCase() + period.slice(1)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  ${report?.summary?.totalIncome?.toLocaleString() || '0'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" color="error.main" fontWeight={700}>
                  ${report?.summary?.totalExpenses?.toLocaleString() || '0'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Net Savings
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  ${report?.summary?.netSavings?.toLocaleString() || '0'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Savings Rate
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {report?.summary?.savingsRate || '0'}%
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Category Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              {report?.categoryBreakdown && Object.keys(report.categoryBreakdown).length > 0 ? (
                Object.entries(report.categoryBreakdown).map(([category, data]: [string, any]) => (
                  <Box key={category} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {category}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        ${data.total.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {data.count} transactions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.type === 'income' ? 'Income' : 'Expense'}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No data available for this period
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Insights
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
              <Typography variant="body1" paragraph>
                <strong>Financial Health Score:</strong>{' '}
                {report?.summary?.savingsRate >= 20 ? 'Excellent' : 
                 report?.summary?.savingsRate >= 10 ? 'Good' : 
                 report?.summary?.savingsRate >= 0 ? 'Fair' : 'Needs Improvement'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {report?.summary?.savingsRate >= 20 
                  ? 'Great job! You are saving a healthy portion of your income.'
                  : report?.summary?.savingsRate >= 10 
                  ? 'You are on the right track. Consider increasing your savings rate.'
                  : report?.summary?.savingsRate >= 0 
                  ? 'Try to reduce expenses and increase your savings.'
                  : 'You are spending more than you earn. Review your expenses urgently.'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
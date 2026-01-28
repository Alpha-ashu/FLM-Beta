import { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CameraAlt,
  Upload,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import Tesseract from 'tesseract.js';

interface ReceiptScannerProps {
  open: boolean;
  onClose: () => void;
  onScanComplete: (data: ReceiptData) => void;
}

export interface ReceiptData {
  amount: number;
  description: string;
  date: string;
  category: string;
  merchant?: string;
}

export function ReceiptScanner({ open, onClose, onScanComplete }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
        processReceipt(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseReceiptText = (text: string): ReceiptData => {
    // Convert text to uppercase for easier matching
    const upperText = text.toUpperCase();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract merchant name (usually the first few lines contain business name)
    let merchant = 'Unknown Merchant';
    if (lines.length > 0) {
      // Get the first significant line (longer than 3 chars)
      const firstLine = lines.find(line => line.length > 3);
      if (firstLine) {
        merchant = firstLine.replace(/[^a-zA-Z0-9\s&'-]/g, '').trim();
      }
    }
    
    // Extract total amount - look for keywords like TOTAL, AMOUNT, BALANCE
    let amount = 0;
    const amountPatterns = [
      /(?:TOTAL|AMOUNT|BALANCE|DUE)[:\s]*\$?[\s]*([\d,]+\.?\d{0,2})/i,
      /\$[\s]*([\d,]+\.?\d{2})\s*(?:TOTAL|AMOUNT|BALANCE|DUE)/i,
      /(?:GRAND\s*TOTAL|TOTAL\s*AMOUNT)[:\s]*\$?[\s]*([\d,]+\.?\d{0,2})/i,
    ];
    
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const parsedAmount = parseFloat(match[1].replace(/,/g, ''));
        if (parsedAmount > amount) {
          amount = parsedAmount;
        }
      }
    }
    
    // If no total found, try to find any dollar amount
    if (amount === 0) {
      const dollarMatches = text.match(/\$[\s]*([\d,]+\.?\d{2})/g);
      if (dollarMatches && dollarMatches.length > 0) {
        const amounts = dollarMatches.map(m => {
          const numStr = m.replace(/[$,\s]/g, '');
          return parseFloat(numStr);
        }).filter(n => !isNaN(n) && n > 0);
        
        // Get the largest amount (likely the total)
        if (amounts.length > 0) {
          amount = Math.max(...amounts);
        }
      }
    }
    
    // Extract date
    let date = new Date().toISOString().split('T')[0];
    const datePatterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,
      /(\d{1,2}\s+(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\s+\d{2,4})/i,
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        try {
          const parsedDate = new Date(match[1]);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0];
            break;
          }
        } catch (e) {
          // Continue to next pattern
        }
      }
    }
    
    // Determine category based on merchant name and items
    let category = 'shopping';
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('coffee') || lowerText.includes('cafe') || lowerText.includes('restaurant') ||
        lowerText.includes('food') || lowerText.includes('bar') || lowerText.includes('grill')) {
      category = 'food';
    } else if (lowerText.includes('gas') || lowerText.includes('fuel') || lowerText.includes('station')) {
      category = 'transportation';
    } else if (lowerText.includes('pharmacy') || lowerText.includes('medical') || lowerText.includes('health')) {
      category = 'healthcare';
    } else if (lowerText.includes('hotel') || lowerText.includes('motel') || lowerText.includes('inn')) {
      category = 'travel';
    }
    
    return {
      amount,
      description: `${merchant} - Purchase`,
      date,
      category,
      merchant,
    };
  };

  const processReceipt = async (imageData: string) => {
    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Perform OCR using Tesseract.js
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m) => {
            // Update progress based on Tesseract's progress
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);

      // Parse the extracted text to get receipt data
      const parsedData = parseReceiptText(extractedText);

      setResult(parsedData);
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process receipt. Please try again or enter details manually.');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onScanComplete(result);
      handleClose();
    }
  };

  const handleClose = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setProcessing(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Scan Receipt</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {!image && !processing && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload a photo of your receipt to automatically extract expense details
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<CameraAlt />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ minWidth: 150 }}
              >
                Take Photo
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ minWidth: 150 }}
              >
                Upload Image
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Tips for best results:</strong>
              </Typography>
              <Typography variant="caption" component="div">
                • Make sure the receipt is well-lit and in focus
                <br />
                • Avoid shadows and glare
                <br />
                • Capture the entire receipt in the frame
              </Typography>
            </Alert>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {image && !result && (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <img 
                  src={image} 
                  alt="Receipt" 
                  style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
              </CardContent>
            </Card>

            {processing && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Processing receipt...
                </Typography>
                {progress > 0 && (
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {progress}% complete
                    </Typography>
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  Extracting text and analyzing data
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {result && (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <img 
                  src={image!} 
                  alt="Receipt" 
                  style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
              </CardContent>
            </Card>

            <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
              Receipt processed successfully! Review the details below.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Merchant"
                value={result.merchant}
                onChange={(e) => setResult({ ...result, merchant: e.target.value })}
                fullWidth
              />
              
              <TextField
                label="Description"
                value={result.description}
                onChange={(e) => setResult({ ...result, description: e.target.value })}
                fullWidth
              />
              
              <TextField
                label="Amount"
                type="number"
                value={result.amount}
                onChange={(e) => setResult({ ...result, amount: parseFloat(e.target.value) })}
                fullWidth
              />
              
              <TextField
                label="Date"
                type="date"
                value={result.date}
                onChange={(e) => setResult({ ...result, date: e.target.value })}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true }
                }}
              />
              
              <TextField
                label="Category"
                value={result.category}
                onChange={(e) => setResult({ ...result, category: e.target.value })}
                fullWidth
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {image && !result && !processing && (
          <Button onClick={() => setImage(null)}>
            Retake
          </Button>
        )}
        
        {result && (
          <>
            <Button onClick={() => setImage(null)}>
              Retake
            </Button>
            <Button variant="contained" onClick={handleConfirm}>
              Use This Data
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
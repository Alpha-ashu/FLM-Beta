import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { SmartToy, Send, Person } from '@mui/icons-material';

interface AIAssistantProps {
  supabase: any;
  session: any;
}

export function AIAssistant({ supabase, session }: AIAssistantProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Financial Assistant. I can help you with:\n\n• Understanding your spending patterns\n• Creating savings plans\n• Setting financial goals\n• Tax planning guidance\n• Investment advice\n• Budget optimization\n\nWhat would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'How can I save $10,000 in 12 months?',
    'What are my biggest expenses?',
    'How should I allocate my income?',
    'Tips for reducing monthly expenses',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: generateResponse(input),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string) => {
    if (question.toLowerCase().includes('save')) {
      return "To save $10,000 in 12 months, you need to save approximately $833 per month. Here's a step-by-step plan:\n\n1. **Analyze Your Current Spending**: Review your expenses to identify areas where you can cut back.\n\n2. **Create a Budget**: Allocate 50% to needs, 30% to wants, and 20% to savings (adjust as needed).\n\n3. **Automate Savings**: Set up automatic transfers of $833 to your savings account on payday.\n\n4. **Increase Income**: Consider freelancing, selling unused items, or taking on a side hustle.\n\n5. **Track Progress**: Monitor your savings monthly and adjust your budget if needed.\n\nWould you like help creating a detailed budget plan?";
    } else if (question.toLowerCase().includes('expense')) {
      return "Based on typical spending patterns, here are common expense categories and tips to reduce them:\n\n1. **Food & Dining**: Meal prep at home, use coupons, buy in bulk\n2. **Transportation**: Carpool, use public transit, maintain your vehicle\n3. **Housing**: Consider refinancing, reduce utility usage, negotiate rent\n4. **Entertainment**: Look for free activities, use library services, cancel unused subscriptions\n5. **Shopping**: Wait 24 hours before purchases, use cash-back apps, buy secondhand\n\nFor personalized insights, track your expenses for 30 days and I can analyze your spending patterns!";
    } else if (question.toLowerCase().includes('allocate') || question.toLowerCase().includes('income')) {
      return "Here's a recommended income allocation strategy (50/30/20 rule):\n\n**50% - Needs** (Essential expenses)\n• Housing (rent/mortgage)\n• Utilities\n• Groceries\n• Transportation\n• Insurance\n• Minimum debt payments\n\n**30% - Wants** (Discretionary spending)\n• Dining out\n• Entertainment\n• Hobbies\n• Shopping\n• Travel\n\n**20% - Savings & Debt** (Future security)\n• Emergency fund\n• Retirement savings\n• Investment contributions\n• Extra debt payments\n• Financial goals\n\nAdjust these percentages based on your personal situation and goals!";
    } else {
      return "That's a great question! As your AI financial assistant, I'm here to help you make informed decisions about your money. Here are some general tips:\n\n• **Track everything**: Knowledge is power. Know where every dollar goes.\n• **Emergency fund first**: Build 3-6 months of expenses before investing.\n• **Pay yourself first**: Automate savings before you have a chance to spend.\n• **Avoid lifestyle inflation**: Don't increase spending just because income increases.\n• **Review regularly**: Check your finances monthly and adjust as needed.\n\nWould you like specific advice on any of these topics?";
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        AI Financial Assistant
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {quickQuestions.map((question, index) => (
              <Chip
                key={index}
                label={question}
                onClick={() => setInput(question)}
                clickable
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {message.role === 'assistant' ? (
                    <SmartToy sx={{ mr: 1, fontSize: 20 }} />
                  ) : (
                    <Person sx={{ mr: 1, fontSize: 20 }} />
                  )}
                  <Typography variant="caption" fontWeight={600}>
                    {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {message.content}
                </Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2">Thinking...</Typography>
              </Paper>
            </Box>
          )}
        </CardContent>

        <CardContent>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about your finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

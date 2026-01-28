import { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import {
  Celebration,
  TrendingUp,
  SmartToy,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Work,
  School,
  Business,
  Person,
} from '@mui/icons-material';
import { useOnboarding } from '@/app/contexts/OnboardingContext';

interface ComprehensiveOnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

type OnboardingStep = 
  | 'splash'
  | 'tutorial-1'
  | 'tutorial-2'
  | 'tutorial-3'
  | 'role'
  | 'income'
  | 'expenses'
  | 'categories'
  | 'goals'
  | 'ai-ready';

const expenseCategoryOptions = [
  'Rent / Home',
  'Food',
  'Transport',
  'Subscriptions',
  'Shopping',
  'Loans / EMI',
  'Others',
];

const goalOptions = [
  'Control spending',
  'Save more money',
  'Get out of debt',
  'Grow income',
  'Learn finance',
];

export function ComprehensiveOnboarding({ onComplete, onSkip }: ComprehensiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');
  const [showSplash, setShowSplash] = useState(true);
  const { onboardingData, updateOnboardingData, completeOnboarding } = useOnboarding();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState<'₹' | '$' | '€'>('$');
  const [expenseRange, setExpenseRange] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Auto-advance from splash screen
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setCurrentStep('tutorial-1');
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    const stepFlow: OnboardingStep[] = [
      'splash',
      'tutorial-1',
      'tutorial-2',
      'tutorial-3',
      'role',
      'income',
      'expenses',
      'categories',
      'goals',
      'ai-ready',
    ];

    const currentIndex = stepFlow.indexOf(currentStep);
    
    if (currentStep === 'role' && selectedRole) {
      updateOnboardingData({ role: selectedRole as any });
    }
    
    if (currentStep === 'income' && income) {
      updateOnboardingData({ monthlyIncome: parseFloat(income), currency });
    }
    
    if (currentStep === 'expenses' && expenseRange) {
      updateOnboardingData({ expenseRange: expenseRange as any });
    }
    
    if (currentStep === 'categories') {
      updateOnboardingData({ expenseCategories: selectedCategories });
    }
    
    if (currentStep === 'goals') {
      updateOnboardingData({ goals: selectedGoals });
    }

    if (currentIndex < stepFlow.length - 1) {
      setCurrentStep(stepFlow[currentIndex + 1]);
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleBack = () => {
    const stepFlow: OnboardingStep[] = [
      'splash',
      'tutorial-1',
      'tutorial-2',
      'tutorial-3',
      'role',
      'income',
      'expenses',
      'categories',
      'goals',
      'ai-ready',
    ];

    const currentIndex = stepFlow.indexOf(currentStep);
    if (currentIndex > 1) {
      setCurrentStep(stepFlow[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'role':
        return selectedRole !== null;
      case 'income':
        return income !== '' && parseFloat(income) > 0;
      case 'expenses':
        return expenseRange !== '';
      case 'categories':
      case 'goals':
        return true; // Optional screens
      default:
        return true;
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const slideVariants = {
    enter: { x: 1000, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -1000, opacity: 0 },
  };

  // Splash Screen
  if (currentStep === 'splash' && showSplash) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Celebration sx={{ fontSize: 80, color: 'white' }} />
          </Box>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            FinanceLife
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>
            Your money. Your clarity.
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #5B5FE3 0%, #8B8FF5 50%, #00D4FF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        overflow: 'auto',
      }}
    >
      {/* Main Content Area */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%',
          p: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 600, md: 700 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: '100%' }}
            >
              {/* Tutorial Slide 1 */}
              {currentStep === 'tutorial-1' && (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: { xs: 50, sm: 60 }, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: 'white',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Understand Your Money Clearly
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      lineHeight: 1.6, 
                      maxWidth: 550, 
                      margin: '0 auto',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Track income, expenses, and habits in one place — without linking your bank.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                  </Box>
                </Box>
              )}

              {/* Tutorial Slide 2 */}
              {currentStep === 'tutorial-2' && (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                    }}
                  >
                    <SmartToy sx={{ fontSize: { xs: 50, sm: 60 }, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: 'white',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Learn From Your Mistakes
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      lineHeight: 1.6, 
                      maxWidth: 550, 
                      margin: '0 auto',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Our AI shows where money leaks happen and how to fix them.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                  </Box>
                </Box>
              )}

              {/* Tutorial Slide 3 */}
              {currentStep === 'tutorial-3' && (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: { xs: 50, sm: 60 }, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: 'white',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Get Help When You Need It
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      lineHeight: 1.6, 
                      maxWidth: 550, 
                      margin: '0 auto',
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      px: { xs: 2, sm: 0 },
                    }}
                  >
                    Consult verified finance professionals or use AI anytime.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.4)' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }} />
                  </Box>
                </Box>
              )}

              {/* Role Selection */}
              {currentStep === 'role' && (
                <Box sx={{ width: '100%' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 4, 
                      color: 'white', 
                      textAlign: 'center',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                    }}
                  >
                    What describes you best?
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2, maxWidth: 500, mx: 'auto' }}>
                    {[
                      { value: 'employed', label: 'Employed', icon: <Work /> },
                      { value: 'unemployed', label: 'Unemployed / Student', icon: <School /> },
                      { value: 'business-owner', label: 'Business Owner', icon: <Business /> },
                      { value: 'freelancer', label: 'Freelancer / Consultant', icon: <Person /> },
                    ].map((option) => (
                      <Box
                        key={option.value}
                        onClick={() => setSelectedRole(option.value)}
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: selectedRole === option.value ? 'white' : 'rgba(255, 255, 255, 0.3)',
                          background: selectedRole === option.value ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'white',
                            background: 'rgba(255, 255, 255, 0.25)',
                          },
                        }}
                      >
                        <Box sx={{ color: 'white' }}>{option.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {option.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Monthly Income */}
              {currentStep === 'income' && (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    What is your average monthly income?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, textAlign: 'center', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    This helps us personalize insights. You can edit later.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
                    {(['₹', '$', '€'] as const).map((curr) => (
                      <Button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        sx={{
                          minWidth: { xs: 50, sm: 60 },
                          background: currency === curr ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                          backdropFilter: currency === curr ? 'blur(10px)' : 'none',
                          color: 'white',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            border: '2px solid white',
                          },
                        }}
                      >
                        {curr}
                      </Button>
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Enter amount"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'white', fontWeight: 700 }}>{currency}</Typography>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        fontWeight: 700,
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Monthly Expenses */}
              {currentStep === 'expenses' && (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'white', textAlign: 'center', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Your average monthly expenses?
                  </Typography>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup value={expenseRange} onChange={(e) => setExpenseRange(e.target.value)}>
                      {[
                        { value: 'less-than-income', label: 'Less than income' },
                        { value: 'same-as-income', label: 'About the same as income' },
                        { value: 'more-than-income', label: 'More than income' },
                      ].map((option) => (
                        <Box
                          key={option.value}
                          onClick={() => setExpenseRange(option.value)}
                          sx={{
                            p: { xs: 2.5, sm: 3 },
                            mb: 2,
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: expenseRange === option.value ? 'white' : 'rgba(255, 255, 255, 0.3)',
                            background: expenseRange === option.value ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: 'white',
                              background: 'rgba(255, 255, 255, 0.25)',
                            },
                          }}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio sx={{ display: 'none' }} />}
                            label={
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                {option.label}
                              </Typography>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {/* Expense Categories */}
              {currentStep === 'categories' && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Where does most of your money go?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, textAlign: 'center', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    Select all that apply
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', maxWidth: 600, mx: 'auto' }}>
                    {expenseCategoryOptions.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => toggleCategory(category)}
                        sx={{
                          px: { xs: 2, sm: 2.5 },
                          py: { xs: 2.5, sm: 3 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 600,
                          background: selectedCategories.includes(category) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          border: '2px solid',
                          borderColor: selectedCategories.includes(category) ? 'white' : 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'white',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* User Goals */}
              {currentStep === 'goals' && (
                <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'white', textAlign: 'center', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    What do you want help with?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, textAlign: 'center', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    Select all that apply
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {goalOptions.map((goal) => (
                      <Box
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        sx={{
                          p: { xs: 2.5, sm: 3 },
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: selectedGoals.includes(goal) ? 'white' : 'rgba(255, 255, 255, 0.3)',
                          background: selectedGoals.includes(goal) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'white',
                            background: 'rgba(255, 255, 255, 0.25)',
                          },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {goal}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* AI Ready */}
              {currentStep === 'ai-ready' && (
                <Box sx={{ textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Box
                      sx={{
                        width: { xs: 120, sm: 140 },
                        height: { xs: 120, sm: 140 },
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 3rem',
                      }}
                    >
                      <SmartToy sx={{ fontSize: { xs: 70, sm: 80 }, color: 'white' }} />
                    </Box>
                  </motion.div>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'white', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, px: { xs: 2, sm: 0 } }}>
                    Your AI Assistant Is Ready
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, maxWidth: 550, margin: '0 auto', fontSize: { xs: '1rem', sm: '1.25rem' }, px: { xs: 2, sm: 0 } }}>
                    We've personalized your experience based on your answers.
                  </Typography>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Navigation Footer */}
      <Box sx={{ width: '100%', p: { xs: 2, sm: 3 }, background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', maxWidth: 700, mx: 'auto' }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 'splash' || currentStep === 'tutorial-1' || currentStep === 'tutorial-2' || currentStep === 'tutorial-3'}
            startIcon={<ArrowBack />}
            sx={{
              color: 'white',
              visibility: currentStep === 'splash' || currentStep === 'tutorial-1' || currentStep === 'tutorial-2' || currentStep === 'tutorial-3' ? 'hidden' : 'visible',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Back
          </Button>

          {(currentStep === 'categories' || currentStep === 'goals') && (
            <Button onClick={handleNext} sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Skip for now
            </Button>
          )}

          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!canProceed()}
            endIcon={currentStep !== 'ai-ready' ? <ArrowForward /> : undefined}
            sx={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '2px solid white',
              px: { xs: 3, sm: 4 },
              py: 1.5,
              fontWeight: 700,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.4)',
                border: '2px solid white',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {currentStep === 'tutorial-1' || currentStep === 'tutorial-2' ? 'Next' : currentStep === 'tutorial-3' ? 'Get Started' : currentStep === 'ai-ready' ? 'Go to Dashboard' : 'Continue'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

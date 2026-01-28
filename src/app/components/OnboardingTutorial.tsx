import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  MobileStepper,
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  Close,
  Wallet,
  PeopleAlt,
  TrendingUp,
  Shield,
  Celebration,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface Slide {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
}

const slides: Slide[] = [
  {
    icon: <Celebration sx={{ fontSize: 80 }} />,
    title: 'Welcome to FinanceLife',
    message: 'Your complete financial life, simplified.',
    color: '#5B5FE3',
  },
  {
    icon: <Wallet sx={{ fontSize: 80 }} />,
    title: 'Track Every Expense',
    message: 'Manually track expenses with full privacy & control.',
    color: '#00D4FF',
  },
  {
    icon: <PeopleAlt sx={{ fontSize: 80 }} />,
    title: 'Share & Settle Easily',
    message: 'Split bills with friends, family, or teams.',
    color: '#10E584',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 80 }} />,
    title: 'Plan Your Future',
    message: 'Plan savings, track goals, and understand spending.',
    color: '#FF5C7C',
  },
  {
    icon: <Shield sx={{ fontSize: 80 }} />,
    title: 'Your Data, Your Control',
    message: 'No bank access. No SMS reading. No hidden tracking.',
    color: '#8B8FF5',
  },
];

export function OnboardingTutorial({ onComplete, onSkip }: OnboardingTutorialProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = () => {
    if (activeStep === slides.length - 1) {
      onComplete();
    } else {
      setDirection('forward');
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection('backward');
    setActiveStep((prev) => prev - 1);
  };

  const currentSlide = slides[activeStep];

  const variants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === 'forward' ? -1000 : 1000,
      opacity: 0,
    }),
  };

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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 3,
      }}
    >
      {/* Skip Button */}
      {onSkip && activeStep < slides.length - 1 && (
        <IconButton
          onClick={onSkip}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      )}

      {/* Content Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          height: { xs: '80vh', md: '70vh' },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 6,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Slide Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${currentSlide.color}33 0%, ${currentSlide.color}66 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentSlide.color,
                  mb: 4,
                }}
              >
                {currentSlide.icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#2D3142',
                }}
              >
                {currentSlide.title}
              </Typography>

              {/* Message */}
              <Typography
                variant="h6"
                sx={{
                  color: '#8B8FA3',
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                {currentSlide.message}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Bottom Navigation */}
        <Box sx={{ p: 3, background: 'rgba(91, 95, 227, 0.05)' }}>
          <MobileStepper
            variant="dots"
            steps={slides.length}
            position="static"
            activeStep={activeStep}
            sx={{
              background: 'transparent',
              justifyContent: 'center',
              mb: 2,
              '& .MuiMobileStepper-dot': {
                width: 12,
                height: 12,
                margin: '0 6px',
              },
              '& .MuiMobileStepper-dotActive': {
                background: currentSlide.color,
              },
            }}
            nextButton={<div />}
            backButton={<div />}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
              sx={{
                color: '#8B8FA3',
                visibility: activeStep === 0 ? 'hidden' : 'visible',
              }}
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={activeStep === slides.length - 1 ? undefined : <ArrowForward />}
              sx={{
                background: `linear-gradient(135deg, ${currentSlide.color} 0%, ${currentSlide.color}CC 100%)`,
                px: 4,
                '&:hover': {
                  background: `linear-gradient(135deg, ${currentSlide.color}DD 0%, ${currentSlide.color}AA 100%)`,
                },
              }}
            >
              {activeStep === slides.length - 1 ? 'Start Using FinanceLife' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

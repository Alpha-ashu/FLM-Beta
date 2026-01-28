import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OnboardingData {
  role: 'employed' | 'unemployed' | 'business-owner' | 'freelancer' | null;
  monthlyIncome: number;
  currency: '₹' | '$' | '€';
  expenseRange: 'less-than-income' | 'same-as-income' | 'more-than-income' | null;
  expenseCategories: string[];
  goals: string[];
  completedAt?: string;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  hasCompletedOnboarding: (userId?: string) => boolean;
}

const defaultOnboardingData: OnboardingData = {
  role: null,
  monthlyIncome: 0,
  currency: '$',
  expenseRange: null,
  expenseCategories: [],
  goals: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    const completedData = {
      ...onboardingData,
      completedAt: new Date().toISOString(),
    };
    setOnboardingData(completedData);
    
    // Store in localStorage
    localStorage.setItem('onboarding_data', JSON.stringify(completedData));
  };

  const hasCompletedOnboarding = (userId?: string): boolean => {
    if (userId) {
      return localStorage.getItem(`onboarding_completed_${userId}`) === 'true';
    }
    return localStorage.getItem('onboarding_completed') === 'true';
  };

  // Load onboarding data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('onboarding_data');
    if (storedData) {
      try {
        setOnboardingData(JSON.parse(storedData));
      } catch (error) {
        console.error('Failed to parse onboarding data:', error);
      }
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        completeOnboarding,
        hasCompletedOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

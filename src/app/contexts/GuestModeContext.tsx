import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestModeContextType {
  isGuestMode: boolean;
  setGuestMode: (isGuest: boolean) => void;
  clearGuestData: () => void;
  guestData: any;
  setGuestData: (data: any) => void;
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestData, setGuestDataState] = useState<any>({
    expenses: [],
    budgets: [],
    goals: [],
  });

  // Check if user is in guest mode on mount
  useEffect(() => {
    const guestMode = sessionStorage.getItem('guest_mode') === 'true';
    setIsGuestMode(guestMode);

    // Load guest data from sessionStorage if in guest mode
    if (guestMode) {
      const storedData = sessionStorage.getItem('guest_data');
      if (storedData) {
        try {
          setGuestDataState(JSON.parse(storedData));
        } catch (error) {
          console.error('Failed to parse guest data:', error);
        }
      }
    }
  }, []);

  // Save guest data to sessionStorage whenever it changes
  useEffect(() => {
    if (isGuestMode) {
      sessionStorage.setItem('guest_data', JSON.stringify(guestData));
    }
  }, [guestData, isGuestMode]);

  const setGuestMode = (isGuest: boolean) => {
    setIsGuestMode(isGuest);
    sessionStorage.setItem('guest_mode', isGuest.toString());
    
    if (!isGuest) {
      clearGuestData();
    }
  };

  const clearGuestData = () => {
    sessionStorage.removeItem('guest_data');
    sessionStorage.removeItem('guest_mode');
    setGuestDataState({
      expenses: [],
      budgets: [],
      goals: [],
    });
  };

  const setGuestData = (data: any) => {
    setGuestDataState((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <GuestModeContext.Provider
      value={{
        isGuestMode,
        setGuestMode,
        clearGuestData,
        guestData,
        setGuestData,
      }}
    >
      {children}
    </GuestModeContext.Provider>
  );
}

export function useGuestMode() {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}

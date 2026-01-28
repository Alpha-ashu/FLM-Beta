import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface CurrencyContextType {
  baseCurrency: string;
  selectedCurrency: string;
  rates: { [key: string]: number };
  setSelectedCurrency: (currency: string) => void;
  convertAmount: (amount: number, from: string, to: string) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [baseCurrency] = useState('USD');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Check if in demo mode
        const isDemoMode = localStorage.getItem('demo_mode') === 'true';
        
        if (isDemoMode) {
          // Use demo rates for demo mode
          setRates({
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            INR: 74.5,
            JPY: 110.0,
            AUD: 1.35,
            CAD: 1.25,
            SGD: 1.35,
            CHF: 0.92,
            HKD: 7.85,
          });
          setLoading(false);
          return;
        }

        // Using Open Exchange Rates API (free tier)
        const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID`);
        setRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback rates
        setRates({
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
          INR: 74.5,
          JPY: 110.0,
          AUD: 1.35,
          CAD: 1.25,
          SGD: 1.35,
          CHF: 0.92,
          HKD: 7.85,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertAmount = (amount: number, from: string, to: string): number => {
    if (from === to) return amount;
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    return (amount / fromRate) * toRate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        selectedCurrency,
        rates,
        setSelectedCurrency,
        convertAmount,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
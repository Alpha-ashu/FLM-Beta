import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database Schema
interface FinanceLifeDB extends DBSchema {
  accounts: {
    key: string;
    value: Account;
    indexes: { 'by-user': string };
  };
  cards: {
    key: string;
    value: Card;
    indexes: { 'by-user': string; 'by-account': string };
  };
  loans: {
    key: string;
    value: Loan;
    indexes: { 'by-user': string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-user': string; 'by-date': Date; 'by-category': string };
  };
  budgets: {
    key: string;
    value: Budget;
    indexes: { 'by-user': string };
  };
  goals: {
    key: string;
    value: Goal;
    indexes: { 'by-user': string };
  };
  friends: {
    key: string;
    value: Friend;
    indexes: { 'by-user': string };
  };
  lendBorrow: {
    key: string;
    value: LendBorrowRecord;
    indexes: { 'by-user': string; 'by-friend': string };
  };
  categories: {
    key: string;
    value: Category;
    indexes: { 'by-user': string };
  };
}

// Type Definitions
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'savings' | 'checking' | 'investment' | 'cash';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  userId: string;
  accountId?: string;
  name: string;
  type: 'credit' | 'debit';
  last4Digits: string;
  expiryDate: string;
  cardNetwork: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  creditLimit?: number;
  currentBalance?: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  userId: string;
  name: string;
  type: 'home' | 'car' | 'personal' | 'education' | 'other';
  principalAmount: number;
  interestRate: number;
  remainingAmount: number;
  emiAmount: number;
  startDate: Date;
  endDate: Date;
  nextPaymentDate: Date;
  bankName?: string;
  notificationEnabled: boolean;
  notificationDaysBefore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  cardId?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';
  receipt?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  spent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LendBorrowRecord {
  id: string;
  userId: string;
  friendId: string;
  type: 'lend' | 'borrow';
  amount: number;
  description: string;
  date: Date;
  dueDate?: Date;
  status: 'pending' | 'partially_paid' | 'paid';
  paidAmount: number;
  notificationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextValue {
  // Database
  db: IDBPDatabase<FinanceLifeDB> | null;
  
  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Account>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Cards
  cards: Card[];
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card>;
  updateCard: (id: string, data: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  
  // Loans
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Loan>;
  updateLoan: (id: string, data: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Budgets
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Budget>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Friends
  friends: Friend[];
  addFriend: (friend: Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Friend>;
  updateFriend: (id: string, data: Partial<Friend>) => Promise<void>;
  deleteFriend: (id: string) => Promise<void>;
  
  // Lend/Borrow
  lendBorrowRecords: LendBorrowRecord[];
  addLendBorrowRecord: (record: Omit<LendBorrowRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<LendBorrowRecord>;
  updateLendBorrowRecord: (id: string, data: Partial<LendBorrowRecord>) => Promise<void>;
  deleteLendBorrowRecord: (id: string) => Promise<void>;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Utility
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
  userId: string;
}

export function DataProvider({ children, userId }: DataProviderProps) {
  const [db, setDb] = useState<IDBPDatabase<FinanceLifeDB> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for all data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [lendBorrowRecords, setLendBorrowRecords] = useState<LendBorrowRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize IndexedDB
  useEffect(() => {
    async function initDB() {
      try {
        const database = await openDB<FinanceLifeDB>('financelife-db', 1, {
          upgrade(db) {
            // Accounts store
            if (!db.objectStoreNames.contains('accounts')) {
              const accountStore = db.createObjectStore('accounts', { keyPath: 'id' });
              accountStore.createIndex('by-user', 'userId');
            }
            
            // Cards store
            if (!db.objectStoreNames.contains('cards')) {
              const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
              cardStore.createIndex('by-user', 'userId');
              cardStore.createIndex('by-account', 'accountId');
            }
            
            // Loans store
            if (!db.objectStoreNames.contains('loans')) {
              const loanStore = db.createObjectStore('loans', { keyPath: 'id' });
              loanStore.createIndex('by-user', 'userId');
            }
            
            // Transactions store
            if (!db.objectStoreNames.contains('transactions')) {
              const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
              txStore.createIndex('by-user', 'userId');
              txStore.createIndex('by-date', 'date');
              txStore.createIndex('by-category', 'category');
            }
            
            // Budgets store
            if (!db.objectStoreNames.contains('budgets')) {
              const budgetStore = db.createObjectStore('budgets', { keyPath: 'id' });
              budgetStore.createIndex('by-user', 'userId');
            }
            
            // Goals store
            if (!db.objectStoreNames.contains('goals')) {
              const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
              goalStore.createIndex('by-user', 'userId');
            }
            
            // Friends store
            if (!db.objectStoreNames.contains('friends')) {
              const friendStore = db.createObjectStore('friends', { keyPath: 'id' });
              friendStore.createIndex('by-user', 'userId');
            }
            
            // Lend/Borrow store
            if (!db.objectStoreNames.contains('lendBorrow')) {
              const lbStore = db.createObjectStore('lendBorrow', { keyPath: 'id' });
              lbStore.createIndex('by-user', 'userId');
              lbStore.createIndex('by-friend', 'friendId');
            }
            
            // Categories store
            if (!db.objectStoreNames.contains('categories')) {
              const catStore = db.createObjectStore('categories', { keyPath: 'id' });
              catStore.createIndex('by-user', 'userId');
            }
          },
        });
        
        setDb(database);
        await loadAllData(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setLoading(false);
      }
    }

    initDB();
  }, [userId]);

  // Load all data from IndexedDB
  async function loadAllData(database: IDBPDatabase<FinanceLifeDB>) {
    try {
      const [
        accountsData,
        cardsData,
        loansData,
        transactionsData,
        budgetsData,
        goalsData,
        friendsData,
        lendBorrowData,
        categoriesData,
      ] = await Promise.all([
        database.getAllFromIndex('accounts', 'by-user', userId),
        database.getAllFromIndex('cards', 'by-user', userId),
        database.getAllFromIndex('loans', 'by-user', userId),
        database.getAllFromIndex('transactions', 'by-user', userId),
        database.getAllFromIndex('budgets', 'by-user', userId),
        database.getAllFromIndex('goals', 'by-user', userId),
        database.getAllFromIndex('friends', 'by-user', userId),
        database.getAllFromIndex('lendBorrow', 'by-user', userId),
        database.getAllFromIndex('categories', 'by-user', userId),
      ]);

      setAccounts(accountsData);
      setCards(cardsData);
      setLoans(loansData);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
      setFriends(friendsData);
      setLendBorrowRecords(lendBorrowData);
      setCategories(categoriesData);

      // Initialize default categories if none exist
      if (categoriesData.length === 0) {
        await initializeDefaultCategories(database);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  // Initialize default categories
  async function initializeDefaultCategories(database: IDBPDatabase<FinanceLifeDB>) {
    const defaultCategories: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { userId, name: 'Salary', type: 'income', icon: '💰', color: '#10E584', isDefault: true },
      { userId, name: 'Investment Returns', type: 'income', icon: '📈', color: '#00D4FF', isDefault: true },
      { userId, name: 'Rent/Home', type: 'expense', icon: '🏠', color: '#FF6B9D', isDefault: true },
      { userId, name: 'Food & Dining', type: 'expense', icon: '🍽️', color: '#FFD93D', isDefault: true },
      { userId, name: 'Transport', type: 'expense', icon: '🚗', color: '#A8DADC', isDefault: true },
      { userId, name: 'Shopping', type: 'expense', icon: '🛍️', color: '#E76F51', isDefault: true },
      { userId, name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8B5CF6', isDefault: true },
      { userId, name: 'Healthcare', type: 'expense', icon: '⚕️', color: '#EF4444', isDefault: true },
      { userId, name: 'Education', type: 'expense', icon: '📚', color: '#3B82F6', isDefault: true },
      { userId, name: 'Utilities', type: 'expense', icon: '⚡', color: '#F59E0B', isDefault: true },
    ];

    const tx = database.transaction('categories', 'readwrite');
    const createdCategories = await Promise.all(
      defaultCategories.map(async (cat) => {
        const category: Category = {
          ...cat,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await tx.store.add(category);
        return category;
      })
    );
    await tx.done;
    setCategories(createdCategories);
  }

  // CRUD Operations for Accounts
  const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> => {
    if (!db) throw new Error('Database not initialized');
    const account: Account = {
      ...accountData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('accounts', account);
    setAccounts((prev) => [...prev, account]);
    return account;
  };

  const updateAccount = async (id: string, data: Partial<Account>) => {
    if (!db) throw new Error('Database not initialized');
    const account = accounts.find((a) => a.id === id);
    if (!account) throw new Error('Account not found');
    const updated = { ...account, ...data, updatedAt: new Date() };
    await db.put('accounts', updated);
    setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const deleteAccount = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('accounts', id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD Operations for Cards
  const addCard = async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> => {
    if (!db) throw new Error('Database not initialized');
    const card: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('cards', card);
    setCards((prev) => [...prev, card]);
    return card;
  };

  const updateCard = async (id: string, data: Partial<Card>) => {
    if (!db) throw new Error('Database not initialized');
    const card = cards.find((c) => c.id === id);
    if (!card) throw new Error('Card not found');
    const updated = { ...card, ...data, updatedAt: new Date() };
    await db.put('cards', updated);
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const deleteCard = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('cards', id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD Operations for Loans
  const addLoan = async (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Loan> => {
    if (!db) throw new Error('Database not initialized');
    const loan: Loan = {
      ...loanData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('loans', loan);
    setLoans((prev) => [...prev, loan]);
    return loan;
  };

  const updateLoan = async (id: string, data: Partial<Loan>) => {
    if (!db) throw new Error('Database not initialized');
    const loan = loans.find((l) => l.id === id);
    if (!loan) throw new Error('Loan not found');
    const updated = { ...loan, ...data, updatedAt: new Date() };
    await db.put('loans', updated);
    setLoans((prev) => prev.map((l) => (l.id === id ? updated : l)));
  };

  const deleteLoan = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('loans', id);
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  // CRUD Operations for Transactions
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    if (!db) throw new Error('Database not initialized');
    const transaction: Transaction = {
      ...txData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('transactions', transaction);
    setTransactions((prev) => [...prev, transaction]);
    
    // Update account balance if accountId is provided
    if (transaction.accountId) {
      const account = accounts.find((a) => a.id === transaction.accountId);
      if (account) {
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        await updateAccount(account.id, { balance: account.balance + balanceChange });
      }
    }
    
    return transaction;
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    if (!db) throw new Error('Database not initialized');
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    const updated = { ...transaction, ...data, updatedAt: new Date() };
    await db.put('transactions', updated);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTransaction = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    const transaction = transactions.find((t) => t.id === id);
    if (transaction && transaction.accountId) {
      const account = accounts.find((a) => a.id === transaction.accountId);
      if (account) {
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
        await updateAccount(account.id, { balance: account.balance + balanceChange });
      }
    }
    await db.delete('transactions', id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD Operations for Budgets
  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    if (!db) throw new Error('Database not initialized');
    const budget: Budget = {
      ...budgetData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('budgets', budget);
    setBudgets((prev) => [...prev, budget]);
    return budget;
  };

  const updateBudget = async (id: string, data: Partial<Budget>) => {
    if (!db) throw new Error('Database not initialized');
    const budget = budgets.find((b) => b.id === id);
    if (!budget) throw new Error('Budget not found');
    const updated = { ...budget, ...data, updatedAt: new Date() };
    await db.put('budgets', updated);
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
  };

  const deleteBudget = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('budgets', id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // CRUD Operations for Goals
  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> => {
    if (!db) throw new Error('Database not initialized');
    const goal: Goal = {
      ...goalData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('goals', goal);
    setGoals((prev) => [...prev, goal]);
    return goal;
  };

  const updateGoal = async (id: string, data: Partial<Goal>) => {
    if (!db) throw new Error('Database not initialized');
    const goal = goals.find((g) => g.id === id);
    if (!goal) throw new Error('Goal not found');
    const updated = { ...goal, ...data, updatedAt: new Date() };
    await db.put('goals', updated);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  const deleteGoal = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('goals', id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // CRUD Operations for Friends
  const addFriend = async (friendData: Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>): Promise<Friend> => {
    if (!db) throw new Error('Database not initialized');
    const friend: Friend = {
      ...friendData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('friends', friend);
    setFriends((prev) => [...prev, friend]);
    return friend;
  };

  const updateFriend = async (id: string, data: Partial<Friend>) => {
    if (!db) throw new Error('Database not initialized');
    const friend = friends.find((f) => f.id === id);
    if (!friend) throw new Error('Friend not found');
    const updated = { ...friend, ...data, updatedAt: new Date() };
    await db.put('friends', updated);
    setFriends((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const deleteFriend = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('friends', id);
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  // CRUD Operations for Lend/Borrow
  const addLendBorrowRecord = async (recordData: Omit<LendBorrowRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<LendBorrowRecord> => {
    if (!db) throw new Error('Database not initialized');
    const record: LendBorrowRecord = {
      ...recordData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('lendBorrow', record);
    setLendBorrowRecords((prev) => [...prev, record]);
    return record;
  };

  const updateLendBorrowRecord = async (id: string, data: Partial<LendBorrowRecord>) => {
    if (!db) throw new Error('Database not initialized');
    const record = lendBorrowRecords.find((r) => r.id === id);
    if (!record) throw new Error('Record not found');
    const updated = { ...record, ...data, updatedAt: new Date() };
    await db.put('lendBorrow', updated);
    setLendBorrowRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const deleteLendBorrowRecord = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    await db.delete('lendBorrow', id);
    setLendBorrowRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // CRUD Operations for Categories
  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    if (!db) throw new Error('Database not initialized');
    const category: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.add('categories', category);
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    if (!db) throw new Error('Database not initialized');
    const category = categories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');
    const updated = { ...category, ...data, updatedAt: new Date() };
    await db.put('categories', updated);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const deleteCategory = async (id: string) => {
    if (!db) throw new Error('Database not initialized');
    const category = categories.find((c) => c.id === id);
    if (category?.isDefault) {
      throw new Error('Cannot delete default category');
    }
    await db.delete('categories', id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const refreshAll = async () => {
    if (db) {
      await loadAllData(db);
    }
  };

  const value: DataContextValue = {
    db,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    cards,
    addCard,
    updateCard,
    deleteCard,
    loans,
    addLoan,
    updateLoan,
    deleteLoan,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    friends,
    addFriend,
    updateFriend,
    deleteFriend,
    lendBorrowRecords,
    addLendBorrowRecord,
    updateLendBorrowRecord,
    deleteLendBorrowRecord,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
    refreshAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

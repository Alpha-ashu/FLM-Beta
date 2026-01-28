// Debt Simplification Algorithm
// Minimizes the number of transactions needed to settle all debts

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface Balance {
  person: string;
  balance: number; // positive = owed, negative = owes
}

/**
 * Simplifies debts using greedy algorithm
 * Matches largest creditor with largest debtor iteratively
 */
export function simplifyDebts(balances: Balance[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  // Create working copy
  const workingBalances = balances.map(b => ({ ...b }));
  
  while (true) {
    // Find person who owes the most (most negative)
    const maxDebtor = workingBalances.reduce((max, current) => 
      current.balance < max.balance ? current : max
    );
    
    // Find person who is owed the most (most positive)
    const maxCreditor = workingBalances.reduce((max, current) => 
      current.balance > max.balance ? current : max
    );
    
    // If both are close to zero, we're done
    if (Math.abs(maxDebtor.balance) < 0.01 && Math.abs(maxCreditor.balance) < 0.01) {
      break;
    }
    
    // Calculate settlement amount (minimum of what's owed and what's due)
    const settleAmount = Math.min(
      Math.abs(maxDebtor.balance),
      maxCreditor.balance
    );
    
    if (settleAmount < 0.01) break;
    
    // Create transaction
    transactions.push({
      from: maxDebtor.person,
      to: maxCreditor.person,
      amount: Math.round(settleAmount * 100) / 100, // Round to 2 decimals
    });
    
    // Update balances
    maxDebtor.balance += settleAmount;
    maxCreditor.balance -= settleAmount;
  }
  
  return transactions;
}

/**
 * Calculate balances from expenses
 */
export function calculateBalances(
  expenses: Array<{
    amount: number;
    paidBy: string;
    splits: Array<{ name: string; amount: number }>;
  }>
): Balance[] {
  const balanceMap = new Map<string, number>();
  
  expenses.forEach(expense => {
    // Person who paid gets credited
    const currentPaidBy = balanceMap.get(expense.paidBy) || 0;
    balanceMap.set(expense.paidBy, currentPaidBy + expense.amount);
    
    // Each person in split gets debited
    expense.splits.forEach(split => {
      const currentSplit = balanceMap.get(split.name) || 0;
      balanceMap.set(split.name, currentSplit - split.amount);
    });
  });
  
  // Convert to array
  return Array.from(balanceMap.entries()).map(([person, balance]) => ({
    person,
    balance: Math.round(balance * 100) / 100,
  }));
}

/**
 * Get simplified settlement plan
 */
export function getSettlementPlan(
  expenses: Array<{
    amount: number;
    paidBy: string;
    splits: Array<{ name: string; amount: number }>;
  }>
): {
  balances: Balance[];
  transactions: Transaction[];
  summary: {
    totalExpenses: number;
    totalTransactions: number;
    simplifiedTransactions: number;
  };
} {
  const balances = calculateBalances(expenses);
  const transactions = simplifyDebts(balances);
  
  // Calculate total number of original transactions needed
  let originalTransactions = 0;
  expenses.forEach(expense => {
    expense.splits.forEach(split => {
      if (split.name !== expense.paidBy) {
        originalTransactions++;
      }
    });
  });
  
  return {
    balances,
    transactions,
    summary: {
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      totalTransactions: originalTransactions,
      simplifiedTransactions: transactions.length,
    },
  };
}

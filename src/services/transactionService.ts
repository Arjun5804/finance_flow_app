import { Transaction } from '../components/Transactions/TransactionForm';

// Key for storing transactions in localStorage
const TRANSACTIONS_STORAGE_KEY = 'financeflow_transactions';

// Generate a unique ID for new transactions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all transactions from localStorage
export const getTransactions = (): Transaction[] => {
  const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  if (!storedTransactions) return [];
  
  try {
    // Parse the stored JSON string and ensure dates are properly converted back to Date objects
    const transactions: Transaction[] = JSON.parse(storedTransactions);
    return transactions.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date)
    }));
  } catch (error) {
    console.error('Error parsing transactions from localStorage:', error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId()
  };
  
  const transactions = getTransactions();
  const updatedTransactions = [newTransaction, ...transactions];
  
  saveTransactions(updatedTransactions);
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (id: string, updatedData: Omit<Transaction, 'id'>): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTransaction: Transaction = {
    ...updatedData,
    id
  };
  
  transactions[index] = updatedTransaction;
  saveTransactions(transactions);
  
  return updatedTransaction;
};

// Delete a transaction
export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (filteredTransactions.length === transactions.length) {
    return false; // No transaction was deleted
  }
  
  saveTransactions(filteredTransactions);
  return true;
};

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

// Search transactions by keyword in description or category
export const searchTransactions = (query: string): Transaction[] => {
  if (!query.trim()) return getTransactions();
  
  const transactions = getTransactions();
  const lowerCaseQuery = query.toLowerCase();
  
  return transactions.filter(transaction => 
    transaction.description?.toLowerCase().includes(lowerCaseQuery) ||
    transaction.category.toLowerCase().includes(lowerCaseQuery)
  );
};

// Get transactions by date range
export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  const transactions = getTransactions();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};
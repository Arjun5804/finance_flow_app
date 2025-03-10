import { BudgetCategory } from '../components/Budgeting/BudgetCategoryForm';
import { Transaction } from '../components/Transactions/TransactionForm';
import { getTransactionsByDateRange } from './transactionService';

// Key for storing budget categories in localStorage
const BUDGET_CATEGORIES_STORAGE_KEY = 'financeflow_budget_categories';

// Generate a unique ID for new categories
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all budget categories from localStorage
export const getBudgetCategories = (): BudgetCategory[] => {
  const storedCategories = localStorage.getItem(BUDGET_CATEGORIES_STORAGE_KEY);
  if (!storedCategories) return [];
  
  try {
    return JSON.parse(storedCategories);
  } catch (error) {
    console.error('Error parsing budget categories from localStorage:', error);
    return [];
  }
};

// Add a new budget category
export const addBudgetCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>): BudgetCategory => {
  const newCategory: BudgetCategory = {
    ...category,
    id: generateId(),
    spent: 0 // Initialize spent amount to 0
  };
  
  const categories = getBudgetCategories();
  const updatedCategories = [...categories, newCategory];
  
  saveBudgetCategories(updatedCategories);
  return newCategory;
};

// Update an existing budget category
export const updateBudgetCategory = (id: string, updatedData: Omit<BudgetCategory, 'id' | 'spent'>): BudgetCategory | null => {
  const categories = getBudgetCategories();
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  // Preserve the current spent amount
  const updatedCategory: BudgetCategory = {
    ...updatedData,
    id,
    spent: categories[index].spent
  };
  
  categories[index] = updatedCategory;
  saveBudgetCategories(categories);
  
  return updatedCategory;
};

// Delete a budget category
export const deleteBudgetCategory = (id: string): boolean => {
  const categories = getBudgetCategories();
  const filteredCategories = categories.filter(c => c.id !== id);
  
  if (filteredCategories.length === categories.length) {
    return false; // No category was deleted
  }
  
  saveBudgetCategories(filteredCategories);
  return true;
};

// Save budget categories to localStorage
const saveBudgetCategories = (categories: BudgetCategory[]): void => {
  try {
    localStorage.setItem(BUDGET_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving budget categories to localStorage:', error);
  }
};

// Calculate spending for each budget category based on transactions in a date range
export const calculateCategorySpending = (startDate: Date, endDate: Date): BudgetCategory[] => {
  const categories = getBudgetCategories();
  const transactions = getTransactionsByDateRange(startDate, endDate);
  
  // Only consider expense transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Create a map to track spending by category name (case insensitive)
  const spendingByCategory: Record<string, number> = {};
  
  // Calculate total spending for each category
  expenses.forEach(transaction => {
    const categoryName = transaction.category.toLowerCase();
    spendingByCategory[categoryName] = (spendingByCategory[categoryName] || 0) + transaction.amount;
  });
  
  // Update the spent amount for each budget category
  return categories.map(category => {
    const categoryNameLower = category.name.toLowerCase();
    return {
      ...category,
      spent: spendingByCategory[categoryNameLower] || 0
    };
  });
};

// Get the first and last day of a month
export const getMonthDateRange = (date: Date): { startDate: Date, endDate: Date } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  // Set the time to include the full day
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};
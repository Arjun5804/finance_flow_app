import { Goal } from '../components/Goals/GoalForm';
import { getTransactions } from './transactionService';

// Key for storing goals in localStorage
const GOALS_STORAGE_KEY = 'financeflow_goals';

// Generate a unique ID for new goals
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all goals from localStorage
export const getGoals = (): Goal[] => {
  const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
  if (!storedGoals) return [];
  
  try {
    // Parse the stored JSON string and ensure dates are properly converted back to Date objects
    const goals: Goal[] = JSON.parse(storedGoals);
    return goals.map(goal => ({
      ...goal,
      deadline: new Date(goal.deadline)
    }));
  } catch (error) {
    console.error('Error parsing goals from localStorage:', error);
    return [];
  }
};

// Add a new goal
export const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>): Goal => {
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    currentAmount: 0 // Initialize with zero progress
  };
  
  const goals = getGoals();
  const updatedGoals = [newGoal, ...goals];
  
  saveGoals(updatedGoals);
  return newGoal;
};

// Update an existing goal
export const updateGoal = (id: string, updatedData: Omit<Goal, 'id'>): Goal | null => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  
  if (index === -1) return null;
  
  const updatedGoal: Goal = {
    ...updatedData,
    id
  };
  
  goals[index] = updatedGoal;
  saveGoals(goals);
  
  return updatedGoal;
};

// Delete a goal
export const deleteGoal = (id: string): boolean => {
  const goals = getGoals();
  const filteredGoals = goals.filter(g => g.id !== id);
  
  if (filteredGoals.length === goals.length) {
    return false; // No goal was deleted
  }
  
  saveGoals(filteredGoals);
  return true;
};

// Save goals to localStorage
const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to localStorage:', error);
  }
};

// Calculate current amount for a goal based on related transactions
export const calculateGoalProgress = (goalId: string, goalCategory: string): number => {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return 0;
  
  // Get all transactions
  const transactions = getTransactions();
  
  // Filter transactions by category matching the goal's category
  // and only include savings/investment type transactions
  const relevantTransactions = transactions.filter(transaction => 
    (transaction.category === goalCategory || 
     transaction.category === 'Savings' || 
     transaction.category === 'Investments') &&
    transaction.type === 'expense' // Savings are tracked as expenses in many finance apps
  );
  
  // Sum up the amounts
  const totalAmount = relevantTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  return totalAmount;
};

// Update progress for all goals based on transactions
export const updateAllGoalsProgress = (): void => {
  const goals = getGoals();
  const updatedGoals = goals.map(goal => {
    const currentAmount = calculateGoalProgress(goal.id, goal.category);
    return {
      ...goal,
      currentAmount
    };
  });
  
  saveGoals(updatedGoals);
};

// Get overall progress statistics
export const getGoalsStatistics = () => {
  const goals = getGoals();
  
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
  
  return {
    totalTargetAmount,
    totalCurrentAmount,
    overallProgress,
    totalGoals: goals.length,
    completedGoals: goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
  };
};
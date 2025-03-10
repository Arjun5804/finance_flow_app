import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../Transactions/TransactionForm';
import clsx from 'clsx';
import { formatCurrency } from '../../services/settingsService';
import { translate, getCurrentLanguage } from '../../services/translationService';

type TopExpenseCategoriesProps = {
  darkMode: boolean;
  timeFrame: 'week' | 'month' | 'year';
  limit?: number;
};

type CategoryTotal = {
  category: string;
  total: number;
  percentage: number;
};

const TopExpenseCategories: React.FC<TopExpenseCategoriesProps> = ({ 
  darkMode, 
  timeFrame,
  limit = 5 
}) => {
  const [categoryData, setCategoryData] = useState<CategoryTotal[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const currentLanguage = getCurrentLanguage();
  
  useEffect(() => {
    // Get all transactions
    const transactions = getTransactions();
    
    // Filter for expenses only
    const expenses = transactions.filter(transaction => transaction.type === 'expense');
    
    // Filter by timeframe
    const filteredExpenses = filterByTimeFrame(expenses, timeFrame);
    
    // Calculate totals by category
    const { categoryTotals, total } = calculateCategoryTotals(filteredExpenses);
    
    setCategoryData(categoryTotals.slice(0, limit));
    setTotalExpenses(total);
  }, [timeFrame, limit]);
  
  const filterByTimeFrame = (transactions: Transaction[], timeFrame: 'week' | 'month' | 'year'): Transaction[] => {
    const now = new Date();
    let startDate = new Date();
    
    if (timeFrame === 'week') {
      // Set to beginning of current week (Sunday)
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      startDate.setDate(now.getDate() - day);
    } else if (timeFrame === 'month') {
      // Set to beginning of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeFrame === 'year') {
      // Set to beginning of current year
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    // Reset time to start of day
    startDate.setHours(0, 0, 0, 0);
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  };
  
  const calculateCategoryTotals = (transactions: Transaction[]) => {
    const categoryMap = new Map<string, number>();
    let total = 0;
    
    // Sum up amounts by category
    transactions.forEach(transaction => {
      const currentTotal = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentTotal + transaction.amount);
      total += transaction.amount;
    });
    
    // Convert map to array, calculate percentages, and sort by total (descending)
    const categoryTotals = Array.from(categoryMap.entries())
      .map(([category, categoryTotal]) => ({ 
        category, 
        total: categoryTotal,
        percentage: total > 0 ? (categoryTotal / total) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
    
    return { categoryTotals, total };
  };
  
  return (
    <div className={clsx(
      'rounded-lg p-4',
      darkMode ? 'bg-gray-700' : 'bg-white'
    )}>
      <h3 className="text-lg font-semibold mb-4">{translate('reports.topExpenses', currentLanguage) || 'Top Expense Categories'}</h3>
      
      {categoryData.length > 0 ? (
        <div className="space-y-3">
          {categoryData.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 text-sm text-gray-500">{index + 1}.</div>
                <div>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-gray-500">
                    {item.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>
              <div className="font-semibold">{formatCurrency(item.total)}</div>
            </div>
          ))}
          
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <span className="font-medium">{translate('reports.totalExpenses', currentLanguage) || 'Total Expenses:'}:</span>
            <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">{translate('reports.noExpenseData', currentLanguage) || 'No expense data available for this time period'}</p>
        </div>
      )}
    </div>
  );
};

export default TopExpenseCategories;
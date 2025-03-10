import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../Transactions/TransactionForm';
import clsx from 'clsx';
import { LightbulbIcon } from 'lucide-react';

type FinancialAdviceSectionProps = {
  darkMode: boolean;
  timeFrame: 'week' | 'month' | 'year';
};

type CategorySpending = {
  category: string;
  total: number;
  percentage: number;
  count: number;
};

type FinancialInsight = {
  type: 'positive' | 'suggestion' | 'warning' | 'forecast';
  title: string;
  description: string;
};

const FinancialAdviceSection: React.FC<FinancialAdviceSectionProps> = ({ darkMode, timeFrame }) => {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  
  useEffect(() => {
    // Get all transactions
    const transactions = getTransactions();
    
    // Filter by timeframe
    const filteredTransactions = filterByTimeFrame(transactions, timeFrame);
    
    // Generate insights based on transaction data
    const generatedInsights = generateInsights(filteredTransactions, timeFrame);
    
    setInsights(generatedInsights);
  }, [timeFrame]);
  
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
  
  const generateInsights = (transactions: Transaction[], timeFrame: 'week' | 'month' | 'year'): FinancialInsight[] => {
    const insights: FinancialInsight[] = [];
    
    if (transactions.length === 0) {
      insights.push({
        type: 'suggestion',
        title: 'No Transaction Data',
        description: `Start tracking your finances for this ${timeFrame} to get personalized insights.`
      });
      return insights;
    }
    
    // Calculate income and expenses
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category spending
    const categorySpending = calculateCategorySpending(transactions.filter(t => t.type === 'expense'));
    
    // Generate savings insight
    if (income > 0) {
      const savingsRate = (income - expenses) / income * 100;
      
      if (savingsRate >= 20) {
        insights.push({
          type: 'positive',
          title: 'Excellent Savings Rate',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income, which is above the recommended 20%.`
        });
      } else if (savingsRate > 0) {
        insights.push({
          type: 'suggestion',
          title: 'Improve Your Savings',
          description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Try to aim for at least 20% to build financial security.`
        });
      } else {
        insights.push({
          type: 'warning',
          title: 'Spending Exceeds Income',
          description: 'Your expenses are higher than your income. Consider reviewing your budget to avoid debt.'  
        });
      }
    }
    
    // Find highest spending category
    if (categorySpending.length > 0) {
      const highestCategory = categorySpending[0];
      
      if (highestCategory.percentage > 30) {
        insights.push({
          type: 'suggestion',
          title: `High ${highestCategory.category} Spending`,
          description: `${highestCategory.category} accounts for ${highestCategory.percentage.toFixed(1)}% of your expenses. Consider if there are ways to reduce this.`
        });
      }
    }
    
    // Check for frequent small transactions
    const smallTransactions = transactions.filter(t => t.type === 'expense' && t.amount < 20);
    if (smallTransactions.length >= 5) {
      insights.push({
        type: 'suggestion',
        title: 'Frequent Small Purchases',
        description: `You made ${smallTransactions.length} small purchases under $20. These can add up quickly.`
      });
    }
    
    // Add a forecast insight
    if (timeFrame === 'month' || timeFrame === 'year') {
      insights.push({
        type: 'forecast',
        title: 'Spending Forecast',
        description: `If your spending patterns continue, you'll spend approximately $${(expenses * 12).toFixed(2)} this year.`
      });
    }
    
    return insights;
  };
  
  const calculateCategorySpending = (transactions: Transaction[]): CategorySpending[] => {
    const categoryMap = new Map<string, { total: number; count: number }>();
    const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Group by category
    transactions.forEach(transaction => {
      const current = categoryMap.get(transaction.category) || { total: 0, count: 0 };
      categoryMap.set(transaction.category, {
        total: current.total + transaction.amount,
        count: current.count + 1
      });
    });
    
    // Convert to array with percentages
    return Array.from(categoryMap.entries())
      .map(([category, { total, count }]) => ({
        category,
        total,
        count,
        percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total);
  };
  
  const getInsightColor = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'positive':
        return darkMode ? 'bg-gray-700 border-[#16A34A]' : 'bg-green-50 border-[#16A34A]';
      case 'suggestion':
        return darkMode ? 'bg-gray-700 border-[#FACC15]' : 'bg-yellow-50 border-[#FACC15]';
      case 'warning':
        return darkMode ? 'bg-gray-700 border-[#DC2626]' : 'bg-red-50 border-[#DC2626]';
      case 'forecast':
        return darkMode ? 'bg-gray-700 border-[#1E3A8A]' : 'bg-blue-50 border-[#1E3A8A]';
      default:
        return darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300';
    }
  };
  
  return (
    <div className={clsx(
      'rounded-lg p-4',
      darkMode ? 'bg-gray-700' : 'bg-white'
    )}>
      <div className="flex items-center mb-4">
        <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
        <h3 className="text-lg font-semibold">Financial Insights & Advice</h3>
      </div>
      
      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={clsx(
                'p-4 rounded-lg border-l-4',
                getInsightColor(insight.type)
              )}
            >
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-sm mt-1">{insight.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No insights available for this time period</p>
        </div>
      )}
    </div>
  );
};

export default FinancialAdviceSection;
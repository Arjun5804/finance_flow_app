import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../Transactions/TransactionForm';
import clsx from 'clsx';
import { formatCurrency } from '../../services/settingsService';
import { translate, getCurrentLanguage } from '../../services/translationService';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type SpendingBreakdownChartProps = {
  darkMode: boolean;
  timeFrame: 'week' | 'month' | 'year';
};

type CategoryTotal = {
  category: string;
  total: number;
};

const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({ darkMode, timeFrame }) => {
  const [categoryData, setCategoryData] = useState<CategoryTotal[]>([]);
  const currentLanguage = getCurrentLanguage();
  
  useEffect(() => {
    // Get all transactions
    const transactions = getTransactions();
    
    // Filter for expenses only
    const expenses = transactions.filter(transaction => transaction.type === 'expense');
    
    // Filter by timeframe
    const filteredExpenses = filterByTimeFrame(expenses, timeFrame);
    
    // Calculate totals by category
    const categoryTotals = calculateCategoryTotals(filteredExpenses);
    
    setCategoryData(categoryTotals);
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
  
  const calculateCategoryTotals = (transactions: Transaction[]): CategoryTotal[] => {
    const categoryMap = new Map<string, number>();
    
    // Sum up amounts by category
    transactions.forEach(transaction => {
      const currentTotal = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentTotal + transaction.amount);
    });
    
    // Convert map to array and sort by total (descending)
    const categoryTotals = Array.from(categoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
    
    return categoryTotals;
  };
  
  // Prepare data for Chart.js
  const chartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5',
          '#00BBF9', '#00F5D4'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return (
    <div className={clsx(
      'rounded-lg p-4',
      darkMode ? 'bg-gray-700' : 'bg-white',
      'h-[300px] w-full'
    )}>
      {categoryData.length > 0 ? (
        <Pie data={chartData} options={chartOptions} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">{translate('reports.noExpenseData', currentLanguage) || 'No expense data available for this time period'}</p>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdownChart;
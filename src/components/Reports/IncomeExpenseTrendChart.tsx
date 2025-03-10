import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../Transactions/TransactionForm';
import clsx from 'clsx';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { formatCurrency } from '../../services/settingsService';
import { translate, getCurrentLanguage } from '../../services/translationService';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type IncomeExpenseTrendChartProps = {
  darkMode: boolean;
  timeFrame: 'week' | 'month' | 'year';
};

type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

const IncomeExpenseTrendChart: React.FC<IncomeExpenseTrendChartProps> = ({ darkMode, timeFrame }) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const currentLanguage = getCurrentLanguage();
  
  useEffect(() => {
    // Get all transactions
    const transactions = getTransactions();
    
    // Calculate monthly data based on timeframe
    const calculatedData = calculateMonthlyData(transactions, timeFrame);
    
    setMonthlyData(calculatedData);
  }, [timeFrame]);
  
  const calculateMonthlyData = (transactions: Transaction[], timeFrame: 'week' | 'month' | 'year'): MonthlyData[] => {
    const now = new Date();
    let startDate: Date;
    
    // Determine the start date based on timeframe
    if (timeFrame === 'week') {
      // For week, show daily data for the past 7 days
      // But since we're using monthly data structure, we'll show the last 6 months
      startDate = subMonths(now, 5);
    } else if (timeFrame === 'month') {
      // For month, show the last 6 months
      startDate = subMonths(now, 5);
    } else { // year
      // For year, show the last 12 months
      startDate = subMonths(now, 11);
    }
    
    // Get all months in the interval
    const monthsInRange = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(now)
    });
    
    // Initialize data structure with zero values
    const data: MonthlyData[] = monthsInRange.map(date => ({
      month: format(date, 'MMM yyyy'),
      income: 0,
      expense: 0
    }));
    
    // Aggregate transaction data by month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      
      // Skip transactions outside our date range
      if (transactionDate < startDate || transactionDate > now) return;
      
      const monthKey = format(transactionDate, 'MMM yyyy');
      const monthData = data.find(d => d.month === monthKey);
      
      if (monthData) {
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }
      }
    });
    
    return data;
  };
  
  // Prepare data for Chart.js
  const chartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: translate('reports.income', currentLanguage) || 'Income',
        data: monthlyData.map(data => data.income),
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.5)',
        tension: 0.3,
        fill: false
      },
      {
        label: translate('reports.expenses', currentLanguage) || 'Expenses',
        data: monthlyData.map(data => data.expense),
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.5)',
        tension: 0.3,
        fill: false
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#E5E7EB' : '#374151',
          callback: (value: number) => formatCurrency(value)
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#E5E7EB' : '#374151'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };
  
  return (
    <div className="h-80">
      <Line 
        data={chartData} 
        options={{
          ...chartOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: darkMode ? '#E5E7EB' : '#374151',
                callback: function(
                  this: any,
                  tickValue: number | string,
                  _index: number,
                  _ticks: any[]
                ): string {
                  return formatCurrency(Number(tickValue));
                }
              }
            },
            x: {
              grid: {
                color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: darkMode ? '#E5E7EB' : '#374151'
              }
            }
          }
        }} 
      />
    </div>
  );
};

export default IncomeExpenseTrendChart;
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getTransactions } from '../../services/transactionService';
import { Transaction } from '../Transactions/TransactionForm';
import clsx from 'clsx';
import { formatCurrency } from '../../services/settingsService';
import { translate, getCurrentLanguage } from '../../services/translationService';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type YearlyFinancialSummaryProps = {
  darkMode: boolean;
};

type YearlyData = {
  year: number;
  income: number;
  expense: number;
};

const YearlyFinancialSummary: React.FC<YearlyFinancialSummaryProps> = ({ darkMode }) => {
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const currentLanguage = getCurrentLanguage();
  
  useEffect(() => {
    // Get all transactions
    const transactions = getTransactions();
    
    // Calculate yearly data
    const calculatedData = calculateYearlyData(transactions);
    
    setYearlyData(calculatedData);
  }, []);
  
  const calculateYearlyData = (transactions: Transaction[]): YearlyData[] => {
    const yearMap = new Map<number, YearlyData>();
    
    // Get current year and 2 years back
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    
    // Initialize data structure with zero values for the last 3 years
    for (let year = startYear; year <= currentYear; year++) {
      yearMap.set(year, { year, income: 0, expense: 0 });
    }
    
    // Aggregate transaction data by year
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const year = transactionDate.getFullYear();
      
      // Skip transactions outside our year range
      if (year < startYear || year > currentYear) return;
      
      const yearData = yearMap.get(year);
      
      if (yearData) {
        if (transaction.type === 'income') {
          yearData.income += transaction.amount;
        } else {
          yearData.expense += transaction.amount;
        }
      }
    });
    
    // Convert map to array and sort by year (ascending)
    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  };
  
  // Prepare data for Chart.js
  const chartData = {
    labels: yearlyData.map(data => data.year.toString()),
    datasets: [
      {
        label: translate('reports.income', currentLanguage) || 'Income',
        data: yearlyData.map(data => data.income),
        backgroundColor: 'rgba(22, 163, 74, 0.7)', // Green
        borderColor: '#16A34A',
        borderWidth: 1
      },
      {
        label: translate('reports.expenses', currentLanguage) || 'Expenses',
        data: yearlyData.map(data => data.expense),
        backgroundColor: 'rgba(220, 38, 38, 0.7)', // Red
        borderColor: '#DC2626',
        borderWidth: 1
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
    <div className={clsx(
      'rounded-lg p-4',
      darkMode ? 'bg-gray-700' : 'bg-white'
    )}>
      <h3 className="text-lg font-semibold mb-4">{'Yearly Financial Summary'}</h3>
      
      <div className="h-80">
        <Bar data={chartData} options={chartOptions as any} />
      </div>
    </div>
  );
};

export default YearlyFinancialSummary;
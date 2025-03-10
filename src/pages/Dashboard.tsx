import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { getTransactions } from '../services/transactionService';
import { Transaction } from '../components/Transactions/TransactionForm';
import FinancialSummary from '../components/Dashboard/FinancialSummary';
import MonthlySpendingChart from '../components/Dashboard/MonthlySpendingChart';
import RecentTransactionsList from '../components/Dashboard/RecentTransactionsList';
import FinancialHealthScore from '../components/Dashboard/FinancialHealthScore';

type DashboardProps = {
  darkMode: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{month: string; income: number; expenses: number}[]>([]);

  useEffect(() => {
    // Load transactions from service
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    
    // Calculate totals
    const income = loadedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = loadedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
    
    // Generate monthly data for chart
    generateMonthlyData(loadedTransactions);
  }, []);
  
  // Generate monthly data for the spending chart
  const generateMonthlyData = (transactions: Transaction[]) => {
    const months: {[key: string]: {income: number; expenses: number}} = {};
    
    // Get last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = month.toLocaleString('default', { month: 'short' });
      months[monthKey] = { income: 0, expenses: 0 };
    }
    
    // Aggregate transaction data by month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = transactionDate.toLocaleString('default', { month: 'short' });
      
      // Only include transactions from the last 6 months
      if (months[monthKey]) {
        if (transaction.type === 'income') {
          months[monthKey].income += transaction.amount;
        } else {
          months[monthKey].expenses += transaction.amount;
        }
      }
    });
    
    // Convert to array format for chart
    const data = Object.entries(months).map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses
    }));
    
    setMonthlyData(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Financial Summary */}
      <FinancialSummary 
        darkMode={darkMode} 
        income={totalIncome} 
        expenses={totalExpenses} 
      />
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Monthly Spending Chart */}
          <MonthlySpendingChart 
            darkMode={darkMode} 
            monthlyData={monthlyData} 
          />
          
          {/* Financial Health Score */}
          <FinancialHealthScore 
            darkMode={darkMode} 
            income={totalIncome} 
            expenses={totalExpenses} 
          />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <RecentTransactionsList 
            darkMode={darkMode} 
            transactions={transactions} 
            limit={5} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import clsx from 'clsx';
import { formatCurrency } from '../../services/settingsService';

type FinancialSummaryProps = {
  darkMode: boolean;
  income: number;
  expenses: number;
};

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ darkMode, income, expenses }) => {
  const balance = income - expenses;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={clsx(
        'p-4 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Income</span>
          <ArrowUpCircle className="h-5 w-5 text-[#16A34A]" />
        </div>
        <p className="text-2xl font-bold mt-2 text-[#16A34A]">{formatCurrency(income)}</p>
      </div>
      
      <div className={clsx(
        'p-4 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Expenses</span>
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
        </div>
        <p className="text-2xl font-bold mt-2 text-red-500">{formatCurrency(expenses)}</p>
      </div>
      
      <div className={clsx(
        'p-4 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Balance</span>
          <DollarSign className="h-5 w-5 text-[#1E3A8A]" />
        </div>
        <p className="text-2xl font-bold mt-2 text-[#1E3A8A]">{formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default FinancialSummary;
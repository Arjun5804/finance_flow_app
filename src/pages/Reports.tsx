import React, { useState } from 'react';
import { Calendar, ArrowUpDown } from 'lucide-react';
import clsx from 'clsx';
import {
  SpendingBreakdownChart,
  IncomeExpenseTrendChart,
  YearlyFinancialSummary,
  TopExpenseCategories,
  FinancialAdviceSection
} from '../components/Reports';

type ReportsProps = {
  darkMode: boolean;
};

const Reports: React.FC<ReportsProps> = ({ darkMode }) => {
  const [reportType, setReportType] = useState<'income' | 'expenses' | 'overview'>('overview');
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports & Insights</h1>
      
      {/* Controls */}
      <div className={clsx(
        'p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div>
          <label className="text-sm font-medium mr-2">Report Type:</label>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'income' | 'expenses' | 'overview')}
            className={clsx(
              'rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A] text-sm',
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
            )}
          >
            <option value="overview">Overview</option>
            <option value="income">Income Analysis</option>
            <option value="expenses">Expense Analysis</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mr-2"><Calendar className="h-4 w-4 inline mr-1" /> Time Frame:</label>
          <select 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as 'week' | 'month' | 'year')}
            className={clsx(
              'rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A] text-sm',
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
            )}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <button className={clsx(
          'ml-auto px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
          'flex items-center gap-2'
        )}>
          <span>Export Report</span>
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </div>
      
      {/* Main Report */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <h2 className="text-xl font-bold mb-6">
          {reportType === 'overview' && 'Financial Overview'}
          {reportType === 'income' && 'Income Analysis'}
          {reportType === 'expenses' && 'Expense Analysis'}
          {' '}
          <span className="text-gray-500 font-normal text-base">
            ({timeFrame === 'week' && 'This Week'})
            ({timeFrame === 'month' && 'This Month'})
            ({timeFrame === 'year' && 'This Year'})
          </span>
        </h2>
        
        <div className="space-y-6">
          {/* Main Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income vs Expense Trend Chart */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-2">Income vs Expense Trend</h3>
              <IncomeExpenseTrendChart darkMode={darkMode} timeFrame={timeFrame} />
            </div>
            
            {/* Spending Breakdown Chart */}
            <div>
              <h3 className="text-lg font-medium mb-2">Spending Breakdown</h3>
              <SpendingBreakdownChart darkMode={darkMode} timeFrame={timeFrame} />
            </div>
            
            {/* Top Expense Categories */}
            <div>
              <TopExpenseCategories darkMode={darkMode} timeFrame={timeFrame} />
            </div>
          </div>
          
          {/* Yearly Financial Summary */}
          <div>
            <YearlyFinancialSummary darkMode={darkMode} />
          </div>
        </div>
      </div>
      
      {/* Financial Advice & Insights */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <h2 className="text-xl font-bold mb-4">Financial Advice & Insights</h2>
        <FinancialAdviceSection darkMode={darkMode} timeFrame={timeFrame} />
      </div>
    </div>
  );
};

export default Reports;
import React from 'react';
import clsx from 'clsx';

type FinancialHealthScoreProps = {
  darkMode: boolean;
  income: number;
  expenses: number;
};

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ darkMode, income, expenses }) => {
  // Calculate health score based on income-to-spending ratio
  // Higher score is better (more income relative to expenses)
  const healthScore = income > 0 ? Math.min(Math.max((1 - expenses / income) * 100, 0), 100) : 0;
  
  // Determine status based on score
  const getHealthStatus = () => {
    if (healthScore >= 70) return { label: '🟢 Excellent', color: 'text-[#16A34A]' };
    if (healthScore >= 50) return { label: '🟢 Good', color: 'text-[#16A34A]' };
    if (healthScore >= 30) return { label: '🟡 Average', color: 'text-[#FACC15]' };
    if (healthScore >= 10) return { label: '🟠 Concerning', color: 'text-amber-500' };
    return { label: '🔴 Critical', color: 'text-red-600' };
  };

  const healthStatus = getHealthStatus();

  // Get color for progress bar
  const getProgressBarColor = () => {
    if (healthScore >= 70) return 'bg-[#16A34A]';
    if (healthScore >= 50) return 'bg-[#16A34A]';
    if (healthScore >= 30) return 'bg-[#FACC15]';
    if (healthScore >= 10) return 'bg-amber-500';
    return 'bg-red-600';
  };

  return (
    <div className={clsx(
      'p-6 rounded-lg shadow-md',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <h2 className="text-xl font-bold mb-4">Financial Health Score</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={clsx(
            'font-medium',
            healthStatus.color
          )}>
            {healthStatus.label}
          </span>
          <span className="font-bold">{Math.round(healthScore)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-500',
              getProgressBarColor()
            )}
            style={{ width: `${healthScore}%` }}
          />
        </div>
        <p className={clsx(
          'text-sm',
          darkMode ? 'text-gray-400' : 'text-gray-600'
        )}>
          Based on your income-to-spending ratio and saving patterns
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium mb-2">How to improve your score:</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>Reduce non-essential expenses</li>
            <li>Increase your income sources</li>
            <li>Build an emergency fund</li>
            <li>Pay down high-interest debt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
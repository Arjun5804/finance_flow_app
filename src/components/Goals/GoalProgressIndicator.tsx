import React from 'react';
import clsx from 'clsx';

type GoalProgressIndicatorProps = {
  darkMode: boolean;
  currentAmount: number;
  targetAmount: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

type ProgressStatus = 'good' | 'average' | 'poor';

const GoalProgressIndicator: React.FC<GoalProgressIndicatorProps> = ({
  darkMode,
  currentAmount,
  targetAmount,
  showLabel = true,
  size = 'md'
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  
  // Determine status based on percentage
  const getProgressStatus = (): ProgressStatus => {
    if (progressPercentage >= 75) return 'good';
    if (progressPercentage >= 50) return 'average';
    return 'poor';
  };
  
  const status = getProgressStatus();
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'average': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
    }
  };
  
  // Get status message
  const getStatusMessage = () => {
    switch (status) {
      case 'good': return 'On Track!';
      case 'average': return 'Making Progress';
      case 'poor': return 'Needs Attention';
    }
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2 text-xs';
      case 'lg': return 'h-4 text-base';
      default: return 'h-3 text-sm';
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex items-center">
            <span className={clsx(
              'inline-block w-2 h-2 rounded-full mr-1',
              getStatusColor()
            )} />
            <span className={clsx(
              'font-medium',
              status === 'good' ? darkMode ? 'text-green-400' : 'text-green-600' :
              status === 'average' ? darkMode ? 'text-yellow-400' : 'text-yellow-600' :
              darkMode ? 'text-red-400' : 'text-red-600'
            )}>
              {getStatusMessage()}
            </span>
          </div>
        )}
        <span className="text-right font-medium">{progressPercentage}%</span>
      </div>
      
      <div className={clsx(
        'w-full rounded-full overflow-hidden',
        darkMode ? 'bg-gray-700' : 'bg-gray-200',
        getSizeClasses()
      )}>
        <div 
          className={clsx(
            'transition-all duration-500 rounded-full',
            getStatusColor()
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default GoalProgressIndicator;
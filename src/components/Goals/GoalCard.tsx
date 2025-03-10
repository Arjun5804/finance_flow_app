import React from 'react';
import { Target, Calendar, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import GoalProgressIndicator from './GoalProgressIndicator';
import { Goal } from './GoalForm';
import { formatCurrency } from '../../services/settingsService';

type GoalCardProps = {
  darkMode: boolean;
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
};

const GoalCard: React.FC<GoalCardProps> = ({
  darkMode,
  goal,
  onEdit,
  onDelete
}) => {
  const { id, name, targetAmount, currentAmount, deadline, category, priority } = goal;
  
  // Calculate remaining amount
  const remainingAmount = targetAmount - currentAmount;
  
  // Calculate days remaining until deadline
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format deadline date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div 
      className={clsx(
        'p-4 rounded-lg border',
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-[#1E3A8A]" />
            <h3 className="font-bold text-lg">{name}</h3>
            <span className={clsx(
              'ml-2 px-2 py-0.5 text-xs rounded-full',
              priority === 'high' ? 'bg-red-100 text-red-800' :
              priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800',
              darkMode && 'bg-opacity-20'
            )}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{category}</div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
            <div className="font-medium">
              {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
            <div className="font-medium text-[#1E3A8A]">{formatCurrency(remainingAmount)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Deadline</div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span className="font-medium">{daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}</span>
            </div>
            <div className="text-xs text-gray-500">{formatDate(deadline)}</div>
          </div>
          
          <div className="flex space-x-1 ml-auto">
            <button 
              onClick={() => onEdit(goal)}
              className={clsx(
                'p-1 rounded',
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              )}
              aria-label="Edit goal"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(id)}
              className={clsx(
                'p-1 rounded',
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              )}
              aria-label="Delete goal"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <GoalProgressIndicator 
          darkMode={darkMode}
          currentAmount={currentAmount}
          targetAmount={targetAmount}
        />
      </div>
      
      {/* Motivational message based on progress */}
      {currentAmount / targetAmount >= 0.9 && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
          You're almost there! Just a little more to reach your goal.
        </div>
      )}
      
      {daysRemaining < 30 && currentAmount / targetAmount < 0.75 && (
        <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
          Your deadline is approaching. Consider increasing your contributions.
        </div>
      )}
    </div>
  );
};

export default GoalCard;
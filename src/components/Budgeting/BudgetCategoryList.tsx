import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { BudgetCategory } from './BudgetCategoryForm';
import { formatCurrency } from '../../services/settingsService';

type BudgetCategoryListProps = {
  darkMode: boolean;
  categories: BudgetCategory[];
  onEdit: (category: BudgetCategory) => void;
  onDelete: (categoryId: string) => void;
};

const BudgetCategoryList: React.FC<BudgetCategoryListProps> = ({
  darkMode,
  categories,
  onEdit,
  onDelete
}) => {
  
  // Calculate totals
  const totalAllocated = categories.reduce((sum, category) => sum + category.allocated, 0);
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;
  const spentPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">{'Total Budget'}</span>
          <p className="text-xl font-bold mt-1 text-[#1E3A8A]">{formatCurrency(totalAllocated)}</p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">{'Spent'}</span>
          <p className={clsx(
            "text-xl font-bold mt-1",
            spentPercentage > 100 ? "text-red-500" : "text-orange-500"
          )}>
            {formatCurrency(totalSpent)} ({Math.round(spentPercentage)}%)
          </p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">{'Remaining'}</span>
          <p className={clsx(
            "text-xl font-bold mt-1",
            remainingBudget < 0 ? "text-red-500" : "text-[#16A34A]"
          )}>
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className={clsx(
            'p-6 rounded-lg shadow-md text-center',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <p className="text-gray-500">No budget categories yet. Add your first category to start tracking your budget.</p>
          </div>
        ) : (
          categories.map((category) => {
            const percentSpent = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
            const isOverBudget = percentSpent > 100;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={clsx(
                      'text-sm',
                      isOverBudget ? 'text-red-500' : 'text-gray-500'
                    )}>
                      {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => onEdit(category)}
                        className={clsx(
                          'p-1 rounded',
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        )}
                        aria-label={`Edit ${category.name} category`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(category.id)}
                        className={clsx(
                          'p-1 rounded',
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        )}
                        aria-label={`Delete ${category.name} category`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full transition-all duration-500',
                      isOverBudget ? 'bg-red-500' : ''
                    )}
                    style={{ 
                      width: `${Math.min(percentSpent, 100)}%`,
                      backgroundColor: isOverBudget ? undefined : category.color 
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetCategoryList;
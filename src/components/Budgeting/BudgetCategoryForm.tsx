import React, { useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { getCurrencySymbol } from '../../services/settingsService';

export type BudgetCategory = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
};

type BudgetCategoryFormProps = {
  darkMode: boolean;
  onSubmit: (category: Omit<BudgetCategory, 'id' | 'spent'>) => void;
  onCancel: () => void;
  initialData?: BudgetCategory;
  isEditing?: boolean;
};

// Predefined colors for budget categories
const categoryColors = [
  '#1E3A8A', // Blue
  '#16A34A', // Green
  '#FACC15', // Yellow
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#6366F1', // Indigo
];

const BudgetCategoryForm: React.FC<BudgetCategoryFormProps> = ({
  darkMode,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [allocated, setAllocated] = useState(initialData?.allocated?.toString() || '');
  const [color, setColor] = useState(initialData?.color || categoryColors[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Category name is required';
    if (!allocated || isNaN(Number(allocated)) || Number(allocated) <= 0) {
      newErrors.allocated = 'Please enter a valid amount greater than 0';
    }
    if (!color) newErrors.color = 'Please select a color';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name,
        allocated: Number(allocated),
        color
      });
    }
  };

  return (
    <div className={clsx(
      'fixed inset-0 flex items-center justify-center z-50 p-4',
      'bg-black bg-opacity-50'
    )}>
      <div className={clsx(
        'w-full max-w-md rounded-lg shadow-xl p-6',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Budget Category' : 'Add Budget Category'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
                placeholder="e.g., Housing, Food, Transportation"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Budget Amount */}
            <div>
              <label htmlFor="allocated" className="block text-sm font-medium mb-1">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {getCurrencySymbol()}
                </span>
                <input
                  type="number"
                  id="allocated"
                  value={allocated}
                  onChange={(e) => setAllocated(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={clsx(
                    'w-full rounded-md border shadow-sm py-2 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                    errors.allocated ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                  )}
                />
              </div>
              {errors.allocated && <p className="mt-1 text-sm text-red-500">{errors.allocated}</p>}
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categoryColors.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2',
                      color === colorOption ? 'border-gray-900 dark:border-white' : 'border-transparent'
                    )}
                    style={{ backgroundColor: colorOption }}
                    aria-label={`Select color ${colorOption}`}
                  />
                ))}
              </div>
              {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className={clsx(
                  'flex-1 py-2 px-4 rounded-md border text-sm font-medium',
                  darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-md text-sm font-medium"
              >
                {isEditing ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetCategoryForm;
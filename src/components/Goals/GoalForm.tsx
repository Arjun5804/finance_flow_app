import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { getCurrencySymbol } from '../../services/settingsService';

type GoalFormProps = {
  darkMode: boolean;
  onSubmit: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  onCancel: () => void;
  initialData?: Goal;
  isEditing?: boolean;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
};

const categories = [
  'Savings',
  'Investment',
  'Purchase',
  'Travel',
  'Housing',
  'Education',
  'Retirement',
  'Other'
];

const GoalForm: React.FC<GoalFormProps> = ({
  darkMode,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount?.toString() || '');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Format the date for the input field when editing
    if (initialData?.deadline) {
      const dateObj = new Date(initialData.deadline);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDeadline(`${year}-${month}-${day}`);
    } else {
      // Set a default deadline 1 year from today
      const today = new Date();
      today.setFullYear(today.getFullYear() + 1);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDeadline(`${year}-${month}-${day}`);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Goal name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid amount greater than 0';
    }
    if (!deadline) newErrors.deadline = 'Deadline is required';
    if (new Date(deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name,
        category,
        targetAmount: Number(targetAmount),
        deadline: new Date(deadline),
        priority
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
            {isEditing ? 'Edit Goal' : 'Add New Goal'}
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
            {/* Goal Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emergency Fund, New Car"
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {getCurrencySymbol()}
                </span>
                <input
                  type="number"
                  id="targetAmount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={clsx(
                    'w-full rounded-md border shadow-sm py-2 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                    errors.targetAmount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                  )}
                />
              </div>
              {errors.targetAmount && <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>}
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium mb-1">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
              />
              {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <div className="flex space-x-4">
                <label className={clsx(
                  'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
                  priority === 'low' ? 'border-green-500 bg-green-500/10' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={priority === 'low'}
                    onChange={() => setPriority('low')}
                    className="sr-only"
                  />
                  <span className={priority === 'low' ? 'text-green-500 font-medium' : ''}>Low</span>
                </label>
                <label className={clsx(
                  'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
                  priority === 'medium' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={priority === 'medium'}
                    onChange={() => setPriority('medium')}
                    className="sr-only"
                  />
                  <span className={priority === 'medium' ? 'text-yellow-500 font-medium' : ''}>Medium</span>
                </label>
                <label className={clsx(
                  'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
                  priority === 'high' ? 'border-red-500 bg-red-500/10' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={priority === 'high'}
                    onChange={() => setPriority('high')}
                    className="sr-only"
                  />
                  <span className={priority === 'high' ? 'text-red-500 font-medium' : ''}>High</span>
                </label>
              </div>
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
                {isEditing ? 'Update' : 'Add'} Goal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
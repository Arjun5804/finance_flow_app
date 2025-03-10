import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { getCurrencySymbol } from '../../services/settingsService';

type TransactionFormProps = {
  darkMode: boolean;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction;
  isEditing?: boolean;
};

export type Transaction = {
  id: string;
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  description?: string;
};

const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
  expense: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Personal Care', 'Debt', 'Savings', 'Other Expense']
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  darkMode,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [category, setCategory] = useState(initialData?.category || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Format the date for the input field when editing
    if (initialData?.date) {
      const dateObj = new Date(initialData.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    } else {
      // Set today's date as default for new transactions
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!category) newErrors.category = 'Category is required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        type,
        category,
        amount: Number(amount),
        date: new Date(date),
        description
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
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
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
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Transaction Type</label>
              <div className="flex space-x-4">
                <label className={clsx(
                  'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
                  type === 'income' ? 'border-[#16A34A] bg-[#16A34A]/10' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                    className="sr-only"
                  />
                  <span className={type === 'income' ? 'text-[#16A34A] font-medium' : ''}>Income</span>
                </label>
                <label className={clsx(
                  'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
                  type === 'expense' ? 'border-red-500 bg-red-500/10' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                )}>
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                    className="sr-only"
                  />
                  <span className={type === 'expense' ? 'text-red-500 font-medium' : ''}>Expense</span>
                </label>
              </div>
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
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {getCurrencySymbol()}
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={clsx(
                    'w-full rounded-md border shadow-sm py-2 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                    errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                  )}
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={clsx(
                  'w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
                  'border-gray-300 dark:border-gray-600',
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                )}
              />
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
                {isEditing ? 'Update' : 'Add'} Transaction
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
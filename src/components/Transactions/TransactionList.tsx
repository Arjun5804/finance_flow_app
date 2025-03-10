import React from 'react';
import { Calendar, DollarSign, Filter, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Transaction } from './TransactionForm';
import { formatCurrency } from '../../services/settingsService';

type TransactionListProps = {
  darkMode: boolean;
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  filterType: 'all' | 'income' | 'expense';
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
  sortOrder: 'newest' | 'oldest' | 'highest' | 'lowest';
  setSortOrder: (order: 'newest' | 'oldest' | 'highest' | 'lowest') => void;
  onAddNew: () => void;
};

const TransactionList: React.FC<TransactionListProps> = ({
  darkMode,
  transactions,
  onEdit,
  onDelete,
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  onAddNew
}) => {
  // Filter transactions based on type
  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  // Sort transactions based on selected order
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.amount - a.amount;
      case 'lowest':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Income</span>
          <p className="text-xl font-bold mt-1 text-[#16A34A]">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Expenses</span>
          <p className="text-xl font-bold mt-1 text-red-500">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Balance</span>
          <p className="text-xl font-bold mt-1 text-[#1E3A8A]">{formatCurrency(balance)}</p>
        </div>
      </div>
      
      {/* Filters and Controls */}
      <div className={clsx(
        'p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div>
          <label className="text-sm font-medium mr-2"><Filter className="h-4 w-4 inline mr-1" /> Filter:</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className={clsx(
              'rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A] text-sm',
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
            )}
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mr-2"><ArrowUpDown className="h-4 w-4 inline mr-1" /> Sort:</label>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest')}
            className={clsx(
              'rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A] text-sm',
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
            )}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
        
        <button 
          onClick={onAddNew}
          className={clsx(
            'ml-auto px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
            'flex items-center gap-2'
          )}
        >
          <span>Add Transaction</span>
          <span className="text-lg">+</span>
        </button>
      </div>
      
      {/* Transactions Table */}
      <div className={clsx(
        'rounded-lg shadow-md overflow-hidden',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={clsx(
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            )}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className={clsx(
                    'hover:bg-opacity-50',
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  )}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.category}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className={clsx(
                      'px-6 py-4 whitespace-nowrap font-medium',
                      transaction.type === 'income' ? 'text-[#16A34A]' : 'text-red-500'
                    )}>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount).replace(/[^0-9,.]/g, '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onEdit(transaction)}
                          className={clsx(
                            'p-1 rounded',
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          )}
                          aria-label="Edit transaction"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(transaction.id)}
                          className={clsx(
                            'p-1 rounded',
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          )}
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
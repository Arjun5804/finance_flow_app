import React from 'react';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Transaction } from '../Transactions/TransactionForm';
import { formatCurrency } from '../../services/settingsService';

type RecentTransactionsListProps = {
  darkMode: boolean;
  transactions: Transaction[];
  limit?: number;
};

const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  darkMode,
  transactions,
  limit = 5
}) => {
  // Sort transactions by date (newest first) and limit the number
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <div className={clsx(
      'p-6 rounded-lg shadow-md',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <a 
          href="/transactions" 
          className="text-sm text-[#1E3A8A] hover:underline flex items-center"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </a>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className={clsx(
                'p-3 rounded-md flex items-center justify-between',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={clsx(
                  'p-2 rounded-full',
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                )}>
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <p className={clsx(
                'font-medium',
                transaction.type === 'income' ? 'text-[#16A34A]' : 'text-red-500'
              )}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount).replace(/[^0-9,.]/g, '')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No recent transactions found.</p>
          <a 
            href="/transactions" 
            className="text-sm text-[#1E3A8A] hover:underline mt-2 inline-block"
          >
            Add a transaction
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsList;
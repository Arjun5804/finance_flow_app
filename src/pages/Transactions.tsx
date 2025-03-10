import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import { Transaction } from '../components/Transactions/TransactionForm';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction, searchTransactions } from '../services/transactionService';

type TransactionsProps = {
  darkMode: boolean;
};

const Transactions: React.FC<TransactionsProps> = ({ darkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
  }, []);

  // Handle adding a new transaction
  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction = addTransaction(transactionData);
    setTransactions(prev => [newTransaction, ...prev]);
    setShowForm(false);
  };

  // Handle updating an existing transaction
  const handleUpdateTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (currentTransaction) {
      const updated = updateTransaction(currentTransaction.id, transactionData);
      if (updated) {
        setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
      }
      setShowForm(false);
      setCurrentTransaction(undefined);
      setIsEditing(false);
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const success = deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  // Handle editing a transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // If search is cleared, load all transactions
      setTransactions(getTransactions());
    } else {
      // Otherwise, filter transactions by search query
      const results = searchTransactions(query);
      setTransactions(results);
    }
  };

  // Toggle transaction form
  const toggleForm = () => {
    if (showForm) {
      // Reset form state when closing
      setCurrentTransaction(undefined);
      setIsEditing(false);
    }
    setShowForm(!showForm);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      
      {/* Search Bar */}
      <div className={clsx(
        'p-4 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearch}
            className={clsx(
              'w-full rounded-md border shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]',
              'border-gray-300 dark:border-gray-600',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white'
            )}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Transaction List Component */}
      <TransactionList
        darkMode={darkMode}
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        filterType={filterType}
        setFilterType={setFilterType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onAddNew={toggleForm}
      />
      
      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          darkMode={darkMode}
          onSubmit={isEditing ? handleUpdateTransaction : handleAddTransaction}
          onCancel={toggleForm}
          initialData={currentTransaction}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Transactions;
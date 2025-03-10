import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { BudgetCategory } from '../components/Budgeting/BudgetCategoryForm';
import BudgetCategoryForm from '../components/Budgeting/BudgetCategoryForm';
import BudgetCategoryList from '../components/Budgeting/BudgetCategoryList';
import BudgetMonthSelector from '../components/Budgeting/BudgetMonthSelector';
import { addBudgetCategory, updateBudgetCategory, deleteBudgetCategory, calculateCategorySpending, getMonthDateRange } from '../services/budgetService';

type BudgetingProps = {
  darkMode: boolean;
};

const Budgeting: React.FC<BudgetingProps> = ({ darkMode }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<BudgetCategory | null>(null);

  // Load budget categories and calculate spending when the component mounts or the selected month changes
  useEffect(() => {
    const { startDate, endDate } = getMonthDateRange(selectedDate);
    const categoriesWithSpending = calculateCategorySpending(startDate, endDate);
    setBudgetCategories(categoriesWithSpending);
  }, [selectedDate]);

  // Handle month change
  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle adding a new category
  const handleAddCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    const newCategory = addBudgetCategory(category);
    
    // Refresh the categories list with updated spending
    const { startDate, endDate } = getMonthDateRange(selectedDate);
    const updatedCategories = calculateCategorySpending(startDate, endDate);
    setBudgetCategories(updatedCategories);
    
    setShowCategoryForm(false);
  };

  // Handle editing a category
  const handleEditCategory = (category: BudgetCategory) => {
    setCategoryToEdit(category);
    setShowCategoryForm(true);
  };

  // Handle updating a category
  const handleUpdateCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    if (categoryToEdit) {
      updateBudgetCategory(categoryToEdit.id, category);
      
      // Refresh the categories list with updated spending
      const { startDate, endDate } = getMonthDateRange(selectedDate);
      const updatedCategories = calculateCategorySpending(startDate, endDate);
      setBudgetCategories(updatedCategories);
      
      setCategoryToEdit(null);
      setShowCategoryForm(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      deleteBudgetCategory(categoryId);
      
      // Refresh the categories list
      const { startDate, endDate } = getMonthDateRange(selectedDate);
      const updatedCategories = calculateCategorySpending(startDate, endDate);
      setBudgetCategories(updatedCategories);
    }
  };

  // Handle canceling the form
  const handleCancelForm = () => {
    setCategoryToEdit(null);
    setShowCategoryForm(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Budgeting</h1>
      
      {/* Month Selector */}
      <BudgetMonthSelector 
        darkMode={darkMode}
        currentDate={selectedDate}
        onMonthChange={handleMonthChange}
      />
      
      {/* Budget Categories */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Budget Categories</h2>
          <button 
            onClick={() => setShowCategoryForm(true)}
            className={clsx(
              'px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
              'flex items-center gap-2'
            )}
          >
            <span>Add Category</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <BudgetCategoryList 
          darkMode={darkMode}
          categories={budgetCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <BudgetCategoryForm
          darkMode={darkMode}
          onSubmit={categoryToEdit ? handleUpdateCategory : handleAddCategory}
          onCancel={handleCancelForm}
          initialData={categoryToEdit || undefined}
          isEditing={!!categoryToEdit}
        />
      )}
    </div>
  );
};

export default Budgeting;
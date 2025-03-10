import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type BudgetMonthSelectorProps = {
  darkMode: boolean;
  currentDate: Date;
  onMonthChange: (date: Date) => void;
};

const BudgetMonthSelector: React.FC<BudgetMonthSelectorProps> = ({
  darkMode,
  currentDate,
  onMonthChange
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${months[currentMonth]} ${currentYear}`;

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className={clsx(
      'flex items-center justify-between p-4 rounded-lg shadow-md mb-6',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <button
        onClick={handlePreviousMonth}
        className={clsx(
          'p-2 rounded-full',
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <h2 className="text-lg font-semibold">{formattedDate}</h2>
      
      <button
        onClick={handleNextMonth}
        className={clsx(
          'p-2 rounded-full',
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        )}
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BudgetMonthSelector;
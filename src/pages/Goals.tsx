import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import GoalCard from '../components/Goals/GoalCard';
import GoalForm from '../components/Goals/GoalForm';
import { Goal } from '../components/Goals/GoalForm';
import { getGoals, addGoal, updateGoal, deleteGoal, updateAllGoalsProgress, getGoalsStatistics } from '../services/goalService';
import { formatCurrency } from '../services/settingsService';

type GoalsProps = {
  darkMode: boolean;
};

const Goals: React.FC<GoalsProps> = ({ darkMode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [stats, setStats] = useState({
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    totalGoals: 0,
    completedGoals: 0
  });

  // Load goals and update progress on component mount
  useEffect(() => {
    loadGoals();
  }, []);

  // Load goals from storage and update their progress
  const loadGoals = () => {
    // Update progress for all goals based on transactions
    updateAllGoalsProgress();
    
    // Get updated goals
    const updatedGoals = getGoals();
    setGoals(updatedGoals);
    
    // Update statistics
    const statistics = getGoalsStatistics();
    setStats(statistics);
  };

  // Handle adding a new goal
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'currentAmount'>) => {
    addGoal(goalData);
    setShowForm(false);
    loadGoals();
  };

  // Handle editing a goal
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  // Handle updating a goal
  const handleUpdateGoal = (goalData: Omit<Goal, 'id' | 'currentAmount'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, {
        ...goalData,
        currentAmount: editingGoal.currentAmount
      });
      setEditingGoal(null);
      setShowForm(false);
      loadGoals();
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      loadGoals();
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  // Calculate overall progress
  const { totalTargetAmount, totalCurrentAmount, overallProgress } = stats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Goals</h1>
      
      {/* Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Total Goal Amount</span>
          <p className="text-xl font-bold mt-1 text-[#1E3A8A]">{formatCurrency(totalTargetAmount)}</p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Current Savings</span>
          <p className="text-xl font-bold mt-1 text-[#16A34A]">{formatCurrency(totalCurrentAmount)}</p>
        </div>
        
        <div className={clsx(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <span className="text-sm font-medium">Overall Progress</span>
          <p className="text-xl font-bold mt-1 text-[#1E3A8A]">{Math.round(overallProgress)}%</p>
        </div>
      </div>
      
      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          darkMode={darkMode}
          onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
          onCancel={handleFormCancel}
          initialData={editingGoal || undefined}
          isEditing={!!editingGoal}
        />
      )}
      
      {/* Goals List */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Goals</h2>
          <button 
            onClick={() => setShowForm(true)}
            className={clsx(
              'px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
              'flex items-center gap-2'
            )}
          >
            <span>Add Goal</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {goals.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center p-8">
            <p className="text-gray-500">No goals yet. Click "Add Goal" to create your first financial goal.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                darkMode={darkMode}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Goal Tips */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <h2 className="text-xl font-bold mb-4">Tips for Achieving Your Goals</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Break large goals into smaller, manageable milestones</li>
          <li>Set up automatic transfers to your savings accounts</li>
          <li>Review and adjust your goals regularly</li>
          <li>Celebrate your progress along the way</li>
          <li>Consider increasing your income through side hustles or career advancement</li>
        </ul>
      </div>
    </div>
  );
};

export default Goals;
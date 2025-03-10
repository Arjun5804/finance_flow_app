import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type MonthlySpendingChartProps = {
  darkMode: boolean;
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
  }[];
};

const MonthlySpendingChart: React.FC<MonthlySpendingChartProps> = ({ darkMode, monthlyData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#fff' : '#333',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#fff',
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? '#fff' : '#333',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
        }
      },
      y: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const chartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(data => data.income),
        backgroundColor: '#16A34A',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expenses),
        backgroundColor: '#EF4444',
        borderRadius: 4,
      }
    ],
  };

  return (
    <div className={clsx(
      'p-6 rounded-lg shadow-md',
      darkMode ? 'bg-gray-800' : 'bg-white'
    )}>
      <h2 className="text-xl font-bold mb-4">Monthly Income & Expenses</h2>
      <div className="h-80">
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default MonthlySpendingChart;
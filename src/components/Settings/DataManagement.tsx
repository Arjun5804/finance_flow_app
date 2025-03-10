import React from 'react';
import clsx from 'clsx';
import { Download, Upload, Database } from 'lucide-react';

type DataManagementProps = {
  darkMode: boolean;
};

const DataManagement: React.FC<DataManagementProps> = ({ darkMode }) => {
  const handleExportData = () => {
    // In a real app, this would fetch user data and create a downloadable file
    const mockData = {
      transactions: [],
      budgets: [],
      goals: [],
      settings: {}
    };
    
    const dataStr = JSON.stringify(mockData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `finance_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would validate and process the imported file
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            const importedData = JSON.parse(event.target.result as string);
            console.log('Imported data:', importedData);
            // Here you would validate the data and update the application state
            alert('Data imported successfully!');
          }
        } catch (error) {
          console.error('Error parsing imported data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Data Management</h2>
      
      <div className="space-y-6">
        {/* Data Export */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </h3>
            <p className="text-sm text-gray-500">Download a backup of all your financial data</p>
          </div>
          
          <button
            onClick={handleExportData}
            className={clsx(
              'px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
              'flex items-center gap-2'
            )}
          >
            <Database className="h-4 w-4" />
            <span>Export All Data</span>
          </button>
        </div>
        
        {/* Data Import */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
            </h3>
            <p className="text-sm text-gray-500">Restore your data from a backup file</p>
          </div>
          
          <label className={clsx(
            'cursor-pointer px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2',
            'bg-gray-100 hover:bg-gray-200 text-gray-700',
            darkMode && 'bg-gray-700 hover:bg-gray-600 text-white'
          )}>
            <Database className="h-4 w-4" />
            <span>Select Backup File</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".json"
              onChange={handleImportData}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Note: Importing data will replace your current data. Make sure to export a backup first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
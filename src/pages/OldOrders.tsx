import React, { useState, useRef } from 'react';
import { BackgroundIcons } from '../components/BackgroundIcons';
import { orderApi } from '../services/api';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

export const OldOrders: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Basic validation for Excel files
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setStatus({
          type: 'error',
          message: 'Please select a valid Excel file (.xlsx or .xls)',
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setStatus({ type: null, message: '' });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await orderApi.importOrders(file);
      setStatus({
        type: 'success',
        message: 'Orders imported successfully!',
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to import orders. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundIcons />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Old Orders</h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-white/40 p-6 sm:p-8 max-w-2xl overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Import Orders from Excel</h2>
            <p className="text-gray-600">
              Upload an Excel file containing your previous orders to import them into the system.
            </p>
          </div>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center justify-center space-y-3"
              >
                {file ? (
                  <>
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white shadow-sm rounded-full border border-gray-200">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Excel files only (.xlsx, .xls)
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Status Messages */}
            {status.type && (
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm">{status.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleImport}
                disabled={!file || isLoading}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Orders
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

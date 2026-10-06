import React from 'react';
import { BackgroundIcons } from '../components/BackgroundIcons';

export const OldOrders: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <BackgroundIcons />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Old Orders</h1>
        </div>
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-white/40 p-6 overflow-hidden">
          <p className="text-gray-600">This page is for managing old orders.</p>
        </div>
      </div>
    </div>
  );
};

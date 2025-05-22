import React from 'react';
import { Scissors } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audio<span className="text-indigo-600 dark:text-indigo-400">Split</span>
          </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
          Split audio files into customizable sections
        </p>
      </div>
    </header>
  );
};

export default Header;
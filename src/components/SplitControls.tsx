import React from 'react';
import { useAudio } from '../context/AudioContext';

const SplitControls: React.FC = () => {
  const { sectionLength, setSectionLength, audioFile, status } = useAudio();
  
  const handleSectionLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSectionLength(value);
  };

  const isProcessing = status === 'processing';
  
  if (!audioFile) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
            Section Length
          </h3>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {sectionLength} seconds
          </span>
        </div>
        
        <div className="relative mt-2">
          <input
            type="range"
            min="1"
            max="60"
            value={sectionLength}
            onChange={handleSectionLengthChange}
            disabled={isProcessing}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundImage: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(sectionLength / 60) * 100}%, #e5e7eb ${(sectionLength / 60) * 100}%, #e5e7eb 100%)`,
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1s</span>
            <span>15s</span>
            <span>30s</span>
            <span>45s</span>
            <span>60s</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[10, 30, 60].map((seconds) => (
          <button
            key={seconds}
            onClick={() => setSectionLength(seconds)}
            disabled={isProcessing}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              sectionLength === seconds
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {seconds}s
          </button>
        ))}
      </div>
      
      {status === 'processing' && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            Processing audio...
          </span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-sm text-red-500 dark:text-red-400 py-2 text-center">
          Error processing audio. Please try again with a different file or settings.
        </div>
      )}
    </div>
  );
};

export default SplitControls;
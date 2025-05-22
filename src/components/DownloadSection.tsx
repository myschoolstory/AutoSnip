import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { createZipFile } from '../utils/zipCreator';

const DownloadSection: React.FC = () => {
  const { audioFile, sections, sectionLength } = useAudio();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!audioFile || sections.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      const fileName = audioFile.name.replace(/\.[^/.]+$/, '');
      await createZipFile(sections, fileName, sectionLength);
      setIsDownloaded(true);
      
      // Reset download status after 3 seconds
      setTimeout(() => {
        setIsDownloaded(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating zip file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-100 mb-1">
            Ready to download
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {sections.length} sections of {sectionLength} seconds each
          </p>
        </div>
        
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`mt-4 sm:mt-0 px-6 py-2 rounded-md text-white shadow-sm transition-all transform hover:scale-105 flex items-center gap-2 ${
            isDownloaded
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Zip...</span>
            </>
          ) : isDownloaded ? (
            <>
              <Check size={18} />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Download All</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DownloadSection;
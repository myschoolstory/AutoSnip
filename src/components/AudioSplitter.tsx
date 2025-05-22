import React, { useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import FileUploader from './FileUploader';
import AudioWaveform from './AudioWaveform';
import SplitControls from './SplitControls';
import DownloadSection from './DownloadSection';
import { splitAudio } from '../utils/audioProcessor';

const AudioSplitter: React.FC = () => {
  const { audioFile, sectionLength, setStatus, setSections, status } = useAudio();

  useEffect(() => {
    // Process audio when file and section length are set
    if (audioFile && sectionLength > 0) {
      setStatus('processing');
      
      const processAudio = async () => {
        try {
          const splitSections = await splitAudio(audioFile, sectionLength);
          setSections(splitSections);
          setStatus('ready');
        } catch (error) {
          console.error('Error processing audio:', error);
          setStatus('error');
        }
      };

      processAudio();
    }
  }, [audioFile, sectionLength, setStatus, setSections]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Audio Splitter
          </h2>
          
          {!audioFile ? (
            <FileUploader />
          ) : (
            <>
              <AudioWaveform />
              <SplitControls />
              {status === 'ready' && <DownloadSection />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioSplitter;
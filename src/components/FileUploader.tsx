import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { AudioFile } from '../types';

const FileUploader: React.FC = () => {
  const { setAudioFile } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback(
    (acceptedFiles: FileList | null) => {
      setError(null);
      
      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }
      
      const file = acceptedFiles[0];
      const supportedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'];
      
      if (!supportedTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload MP3, WAV, or M4A files.');
        return;
      }
      
      // Create an audio element to get duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        const audioFile: AudioFile = {
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          size: file.size,
          duration: audio.duration,
        };
        
        setAudioFile(audioFile);
      };
      
      audio.onerror = () => {
        setError('Invalid audio file. Please try another file.');
      };
    },
    [setAudioFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileDrop(e.dataTransfer.files);
    },
    [handleFileDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileDrop(e.target.files);
    },
    [handleFileDrop]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 text-center ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          {isDragging ? (
            <FileAudio className="h-16 w-16 text-indigo-500 animate-pulse" />
          ) : (
            <UploadCloud className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drag & drop your audio file
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Supports MP3, WAV, and M4A files
        </p>
        
        <label
          htmlFor="file-upload"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm cursor-pointer transition-colors"
        >
          Select File
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileInput}
        />
        
        {error && (
          <div className="mt-4 text-sm text-red-500 dark:text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, RotateCcw } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

const AudioWaveform: React.FC = () => {
  const { audioFile, sectionLength, resetAudio } = useAudio();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    if (audioFile && waveformRef.current) {
      // Create WaveSurfer instance
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9ca3af',
        progressColor: '#4f46e5',
        cursorColor: '#f59e0b',
        height: 80,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        responsive: true,
      });

      // Load audio file
      wavesurferRef.current.load(audioFile.url);

      // Add regions for section markers
      wavesurferRef.current.on('ready', () => {
        const duration = wavesurferRef.current?.getDuration() || 0;
        const numSections = Math.ceil(duration / sectionLength);
        
        for (let i = 0; i < numSections; i++) {
          const start = i * sectionLength;
          const end = Math.min((i + 1) * sectionLength, duration);
          
          wavesurferRef.current?.addRegion({
            start,
            end,
            color: `rgba(79, 70, 229, ${i % 2 ? 0.1 : 0.2})`,
            drag: false,
            resize: false,
          });
        }
      });

      // Time update event
      wavesurferRef.current.on('timeupdate', (time) => {
        setCurrentTime(time);
      });

      // Play/pause events
      wavesurferRef.current.on('play', () => setIsPlaying(true));
      wavesurferRef.current.on('pause', () => setIsPlaying(false));

      // Cleanup on unmount
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [audioFile, sectionLength]);

  // Update regions when section length changes
  useEffect(() => {
    if (wavesurferRef.current && audioFile) {
      // Remove existing regions
      wavesurferRef.current.clearRegions();
      
      // Add new regions based on updated section length
      const duration = wavesurferRef.current.getDuration();
      const numSections = Math.ceil(duration / sectionLength);
      
      for (let i = 0; i < numSections; i++) {
        const start = i * sectionLength;
        const end = Math.min((i + 1) * sectionLength, duration);
        
        wavesurferRef.current.addRegion({
          start,
          end,
          color: `rgba(79, 70, 229, ${i % 2 ? 0.1 : 0.2})`,
          drag: false,
          resize: false,
        });
      }
    }
  }, [sectionLength, audioFile]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!audioFile) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-400 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatTime(currentTime)} / {formatTime(audioFile.duration)}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={resetAudio}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {audioFile.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB · {formatTime(audioFile.duration)}
          </p>
        </div>
        
        <div ref={waveformRef} className="w-full" />
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Sections: {Math.ceil(audioFile.duration / sectionLength)}</span>
          <span className="mx-2">·</span>
          <span>Section length: {sectionLength} seconds</span>
        </div>
      </div>
    </div>
  );
};

export default AudioWaveform;
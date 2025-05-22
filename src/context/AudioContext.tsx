import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AudioFile, ProcessingStatus } from '../types';

interface AudioContextType {
  audioFile: AudioFile | null;
  sectionLength: number;
  status: ProcessingStatus;
  sections: Blob[];
  setAudioFile: (file: AudioFile | null) => void;
  setSectionLength: (length: number) => void;
  setStatus: (status: ProcessingStatus) => void;
  setSections: (sections: Blob[]) => void;
  resetAudio: () => void;
}

const defaultContext: AudioContextType = {
  audioFile: null,
  sectionLength: 10,
  status: 'idle',
  sections: [],
  setAudioFile: () => {},
  setSectionLength: () => {},
  setStatus: () => {},
  setSections: () => {},
  resetAudio: () => {},
};

const AudioContext = createContext<AudioContextType>(defaultContext);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [sectionLength, setSectionLength] = useState<number>(10);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [sections, setSections] = useState<Blob[]>([]);

  const resetAudio = useCallback(() => {
    setAudioFile(null);
    setSectionLength(10);
    setStatus('idle');
    setSections([]);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioFile,
        sectionLength,
        status,
        sections,
        setAudioFile,
        setSectionLength,
        setStatus,
        setSections,
        resetAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
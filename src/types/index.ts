export interface AudioFile {
  file: File;
  url: string;
  name: string;
  type: string;
  size: number;
  duration: number;
}

export type ProcessingStatus = 'idle' | 'processing' | 'ready' | 'error';
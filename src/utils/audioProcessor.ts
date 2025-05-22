import { AudioFile } from '../types';

/**
 * Splits an audio file into sections of a specified length
 * @param audioFile The audio file to split
 * @param sectionLength The length of each section in seconds
 * @returns An array of Blob objects representing the split sections
 */
export const splitAudio = async (
  audioFile: AudioFile,
  sectionLength: number
): Promise<Blob[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Fetch the audio file
      const response = await fetch(audioFile.url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Calculate the number of sections
      const duration = audioBuffer.duration;
      const numSections = Math.ceil(duration / sectionLength);
      const sections: Blob[] = [];
      
      // Create an offline audio context for each section
      for (let i = 0; i < numSections; i++) {
        const startTime = i * sectionLength;
        const endTime = Math.min((i + 1) * sectionLength, duration);
        const sectionDuration = endTime - startTime;
        
        // Create offline context for this section
        const offlineContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          sectionDuration * audioContext.sampleRate,
          audioContext.sampleRate
        );
        
        // Create buffer source
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Connect source to offline context
        source.connect(offlineContext.destination);
        
        // Start playback at the section start time
        source.start(0, startTime, sectionDuration);
        
        // Render the section
        const renderedBuffer = await offlineContext.startRendering();
        
        // Convert the rendered buffer to WAV format
        const wavBlob = await audioBufferToWav(renderedBuffer);
        sections.push(wavBlob);
      }
      
      resolve(sections);
    } catch (error) {
      console.error('Error splitting audio:', error);
      reject(error);
    }
  });
};

/**
 * Converts an AudioBuffer to a WAV file Blob
 * @param buffer The AudioBuffer to convert
 * @returns A Blob containing the WAV file data
 */
const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
  return new Promise((resolve) => {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    // Create interleaved data
    const interleaved = interleaveChannels(buffer);
    
    // Create the buffer
    const buffer1 = new ArrayBuffer(44 + interleaved.length * 2);
    const view = new DataView(buffer1);
    
    // Write the WAV container
    
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true); // audio format
    view.setUint16(22, numberOfChannels, true); // number of channels
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true); // byte rate
    view.setUint16(32, numberOfChannels * (bitDepth / 8), true); // block align
    view.setUint16(34, bitDepth, true); // bits per sample
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true); // data chunk size
    
    // Write the PCM samples
    const offset = 44;
    for (let i = 0; i < interleaved.length; i++) {
      view.setInt16(offset + i * 2, interleaved[i] * 32767, true);
    }
    
    // Create the Blob
    const blob = new Blob([view], { type: 'audio/wav' });
    resolve(blob);
  });
};

/**
 * Interleaves the channels of an AudioBuffer
 * @param buffer The AudioBuffer to interleave
 * @returns A Float32Array of interleaved samples
 */
const interleaveChannels = (buffer: AudioBuffer): Float32Array => {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length;
  const result = new Float32Array(length * numberOfChannels);
  
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      result[i * numberOfChannels + channel] = channelData[i];
    }
  }
  
  return result;
};

/**
 * Writes a string to a DataView at the specified offset
 * @param view The DataView to write to
 * @param offset The offset to write at
 * @param string The string to write
 */
const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
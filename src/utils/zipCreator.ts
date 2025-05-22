import JSZip from 'jszip';

/**
 * Creates a zip file containing audio sections and triggers a download
 * @param sections Array of audio section blobs
 * @param baseName Base name for the zip and audio files
 * @param sectionLength Length of each section in seconds
 */
export const createZipFile = async (
  sections: Blob[],
  baseName: string,
  sectionLength: number
): Promise<void> => {
  const zip = new JSZip();
  
  // Add each section to the zip file
  sections.forEach((section, index) => {
    const startTime = index * sectionLength;
    const endTime = (index + 1) * sectionLength;
    const fileName = `${baseName}_${formatTime(startTime)}-${formatTime(endTime)}.wav`;
    
    zip.file(fileName, section);
  });
  
  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Create a download link
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${baseName}_sections.zip`;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Formats a time in seconds to MM:SS format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}_${remainingSeconds.toString().padStart(2, '0')}`;
};
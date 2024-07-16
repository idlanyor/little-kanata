import { createFFmpeg } from '@ffmpeg/ffmpeg';

/**
 * Convert a video buffer to an audio buffer.
 * 
 * @param {Buffer} inputBuffer - The buffer of the input video.
 * @param {string} outputFormat - The format of the output audio (e.g., 'mp3').
 * @returns {Promise<Buffer>}
 */

export const convertVideoToAudioBuffer = async (inputBuffer, outputFormat = 'mp3') => {
  const ffmpeg = createFFmpeg({ log: true });

  try {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(inputBuffer));

    await ffmpeg.run('-i', 'input.mp4', `output.${outputFormat}`);

    const data = ffmpeg.FS('readFile', `output.${outputFormat}`);
    const outputBuffer = Buffer.from(data);

    return outputBuffer;
  } catch (error) {
    console.error('Error during conversion:', error);
    throw error;
  } finally {
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', `output.${outputFormat}`);
  }
};

// Example usage:
import fs from 'fs';
import path from 'path';

// Load a video file into a buffer
const inputFilePath = path.resolve('path/to/your/video.mp4');
const inputBuffer = fs.readFileSync(inputFilePath);

convertVideoToAudioBuffer(inputBuffer, 'mp3')
  .then((outputBuffer) => {
    // Use the output buffer as needed
    const outputFilePath = path.resolve('path/to/your/output/audio.mp3');
    fs.writeFileSync(outputFilePath, outputBuffer);
    console.log('Audio buffer created successfully.');
  })
  .catch((error) => {
    console.error('Error converting video to audio:', error);
  });

import { DEFAULT_SOUND } from '@/constants/sounds';

const audioCache = {};

export const playSound = (soundPath = DEFAULT_SOUND, volume = 1.0) => {
  try {
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath);
    }
    
    const audio = audioCache[soundPath];
    audio.volume = volume;
    audio.currentTime = 0;
    
    audio.play().catch((e) => {
      console.log(`Sound playback blocked:`, e);
    });
  } catch (error) {
    console.error(`Error playing sound:`, error);
  }
};
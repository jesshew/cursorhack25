import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReaderState {
  currentSpread: number;
  isPlaying: boolean;
  volume: number;
  playbackSpeed: number;
  autoPlay: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // Actions
  setCurrentSpread: (spread: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  reset: () => void;
}

const initialState = {
  currentSpread: 0,
  isPlaying: false,
  volume: 1,
  playbackSpeed: 1,
  autoPlay: false,
  animationSpeed: 'normal' as const,
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentSpread: (spread) => set({ currentSpread: spread }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
      setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
      reset: () => set(initialState),
    }),
    {
      name: 'storybook-reader-storage',
      partialize: (state) => ({
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
        autoPlay: state.autoPlay,
        animationSpeed: state.animationSpeed,
      }),
    }
  )
);

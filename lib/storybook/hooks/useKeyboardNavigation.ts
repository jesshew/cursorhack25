import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onNext: () => void;
  onPrev: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPlayPause?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  onNext,
  onPrev,
  onHome,
  onEnd,
  onPlayPause,
  onEscape,
  enabled = true,
}: KeyboardNavigationOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrev();
          break;
        case 'Home':
          event.preventDefault();
          onHome?.();
          break;
        case 'End':
          event.preventDefault();
          onEnd?.();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          onPlayPause?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onNext, onPrev, onHome, onEnd, onPlayPause, onEscape]);
};

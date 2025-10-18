import { useGesture } from '@use-gesture/react';
import { RefObject } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  enabled?: boolean;
}

export const useSwipeGesture = (
  target: RefObject<HTMLElement>,
  { onSwipeLeft, onSwipeRight, threshold = 50, enabled = true }: SwipeGestureOptions
) => {
  useGesture(
    {
      onDrag: ({ movement: [mx], direction: [dx], velocity: [vx], last }) => {
        if (!enabled) return;

        // Trigger on release with sufficient movement or velocity
        if (last) {
          const swipeDistance = Math.abs(mx);
          const swipeVelocity = Math.abs(vx);

          // Swipe left (next page)
          if (dx < 0 && (swipeDistance > threshold || swipeVelocity > 0.5)) {
            onSwipeLeft();
          }
          // Swipe right (previous page)
          else if (dx > 0 && (swipeDistance > threshold || swipeVelocity > 0.5)) {
            onSwipeRight();
          }
        }
      },
    },
    {
      target,
      drag: {
        axis: 'x',
        filterTaps: true,
        preventScroll: true,
      },
    }
  );
};

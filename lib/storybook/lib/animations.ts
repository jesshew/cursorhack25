export const ANIMATION_CONFIG = {
  pageFlip: {
    duration: 0.7,
    ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
  },
  modal: {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
  },
  microInteraction: {
    duration: 0.2,
    ease: [0.4, 0.0, 0.6, 1] as [number, number, number, number],
  },
};

export const PAGE_VARIANTS = {
  left: {
    enter: {
      initial: { opacity: 0, rotateY: -15, z: -100 },
      animate: { opacity: 1, rotateY: 0, z: 0 },
      exit: { opacity: 0, rotateY: 15, z: -100 },
    },
    flip: {
      initial: { opacity: 0, rotateY: -90, transformOrigin: 'right center' },
      animate: { opacity: 1, rotateY: 0, transformOrigin: 'right center' },
      exit: { opacity: 0, rotateY: 90, transformOrigin: 'right center' },
    },
  },
  right: {
    enter: {
      initial: { opacity: 0, rotateY: 15, z: -100 },
      animate: { opacity: 1, rotateY: 0, z: 0 },
      exit: { opacity: 0, rotateY: -15, z: -100 },
    },
    flip: {
      initial: { opacity: 0, rotateY: 90, transformOrigin: 'left center' },
      animate: { opacity: 1, rotateY: 0, transformOrigin: 'left center' },
      exit: { opacity: 0, rotateY: -90, transformOrigin: 'left center' },
    },
  },
};

export const MODAL_VARIANTS = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },
};

import { motion } from "framer-motion";
import Image from "next/image";
import { ANIMATION_CONFIG, PAGE_VARIANTS } from "@/lib/storybook/lib/animations";
import { useState } from "react";

interface PhotoPageProps {
  imageSrc?: string;
  imageAlt?: string;
  pageNumber?: number;
  direction?: 'enter' | 'exit';
  isFlipping?: boolean;
  onCornerClick?: () => void;
  side?: 'left' | 'right';
}

export const PhotoPage = ({ 
  imageSrc, 
  imageAlt = "Story illustration", 
  pageNumber,
  direction = 'enter',
  isFlipping = false,
  onCornerClick,
  side = 'left'
}: PhotoPageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const variants = {
    initial: { 
      rotateY: side === 'left' ? 0 : 0, 
      opacity: 1,
      scale: 1,
      z: 0,
      x: 0
    },
    animate: { 
      rotateY: 0, 
      opacity: 1,
      scale: 1,
      z: 0,
      x: 0
    },
    exit: { 
      rotateY: side === 'left' ? -180 : 180, 
      opacity: 0.6,
      scale: 0.95,
      z: 300,
      x: side === 'left' ? -50 : 50
    }
  };

  const transition = {
    duration: 3.0,
    ease: [0.16, 0.02, 0.22, 1] as const
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      style={{ 
        transformOrigin: side === 'left' ? 'right center' : 'left center',
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        boxShadow: isFlipping 
          ? "inset 20px 0 50px rgba(0,0,0,0.3), -5px 0 20px rgba(0,0,0,0.2)"
          : "inset 5px 0 20px rgba(0,0,0,0.1), -2px 0 10px rgba(0,0,0,0.05)"
      }}
      className="relative h-full w-full bg-card rounded-l-2xl overflow-hidden"
    >
      {/* Page crease effect */}
      <div className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-8 bg-gradient-to-${side === 'left' ? 'r' : 'l'} from-transparent via-black/5 to-black/10 pointer-events-none z-10`} />
      
      {/* Clickable corner zones for page flip - invisible until hover */}
      {onCornerClick && imageSrc && (
        <>
          {side === 'left' ? (
            <>
              {/* Bottom-left corner */}
              <button
                onClick={onCornerClick}
                className="absolute bottom-0 left-0 w-40 h-40 cursor-pointer z-30 group"
                style={{ 
                  clipPath: 'polygon(0 100%, 0 60%, 40% 100%)',
                  background: 'transparent'
                }}
                aria-label="Previous page"
              >
                <motion.div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: 'polygon(0 100%, 0 60%, 40% 100%)' }}
                  initial={{ opacity: 0, translateX: 0, translateY: 0, rotateZ: 0 }}
                  whileHover={{
                    opacity: 1,
                    translateX: 8,
                    translateY: -8,
                    rotateZ: -5,
                    translateZ: 20,
                    boxShadow: '-4px 4px 20px rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                </motion.div>
              </button>
              {/* Top-left corner */}
              <button
                onClick={onCornerClick}
                className="absolute top-0 left-0 w-40 h-40 cursor-pointer z-30 group"
                style={{ 
                  clipPath: 'polygon(0 0, 0 40%, 40% 0)',
                  background: 'transparent'
                }}
                aria-label="Previous page"
              >
                <motion.div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: 'polygon(0 0, 0 40%, 40% 0)' }}
                  initial={{ opacity: 0, translateX: 0, translateY: 0, rotateZ: 0 }}
                  whileHover={{
                    opacity: 1,
                    translateX: 8,
                    translateY: 8,
                    rotateZ: 5,
                    translateZ: 20,
                    boxShadow: '-4px -4px 20px rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                </motion.div>
              </button>
            </>
          ) : (
            <>
              {/* Bottom-right corner */}
              <button
                onClick={onCornerClick}
                className="absolute bottom-0 right-0 w-40 h-40 cursor-pointer z-30 group"
                style={{ 
                  clipPath: 'polygon(100% 100%, 100% 60%, 60% 100%)',
                  background: 'transparent'
                }}
                aria-label="Next page"
              >
                <motion.div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: 'polygon(100% 100%, 100% 60%, 60% 100%)' }}
                  initial={{ opacity: 0, translateX: 0, translateY: 0, rotateZ: 0 }}
                  whileHover={{
                    opacity: 1,
                    translateX: -8,
                    translateY: -8,
                    rotateZ: 5,
                    translateZ: 20,
                    boxShadow: '4px 4px 20px rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                </motion.div>
              </button>
              {/* Top-right corner */}
              <button
                onClick={onCornerClick}
                className="absolute top-0 right-0 w-40 h-40 cursor-pointer z-30 group"
                style={{ 
                  clipPath: 'polygon(100% 0, 100% 40%, 60% 0)',
                  background: 'transparent'
                }}
                aria-label="Next page"
              >
                <motion.div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: 'polygon(100% 0, 100% 40%, 60% 0)' }}
                  initial={{ opacity: 0, translateX: 0, translateY: 0, rotateZ: 0 }}
                  whileHover={{
                    opacity: 1,
                    translateX: -8,
                    translateY: 8,
                    rotateZ: -5,
                    translateZ: 20,
                    boxShadow: '4px -4px 20px rgba(0,0,0,0.4)',
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                </motion.div>
              </button>
            </>
          )}
        </>
      )}
      
      {/* Page content */}
      <div className="relative w-full h-full">
        {imageSrc ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              src={imageSrc}
              alt={imageAlt}
              layout="fill"
              objectFit="cover"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
            <div className="text-center space-y-4 p-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-serif">Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Page number */}
      {pageNumber !== undefined && (
        <div className="absolute bottom-6 left-6 text-xs font-serif text-muted-foreground/70">
          {pageNumber}
        </div>
      )}

      {/* Simulated page thickness on edge */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-border/30 via-border/50 to-border/30"
        style={{
          boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.1)'
        }}
      />
    </motion.div>
  );
};

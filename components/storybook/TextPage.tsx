import { motion } from "framer-motion";
import { ANIMATION_CONFIG, PAGE_VARIANTS } from "@/lib/storybook/lib/animations";

interface TextPageProps {
  text?: string;
  pageNumber?: number;
  direction?: 'enter' | 'exit';
  isFlipping?: boolean;
  onCornerClick?: () => void;
  side?: 'left' | 'right';
}

export const TextPage = ({ 
  text, 
  pageNumber,
  direction = 'enter',
  isFlipping = false,
  onCornerClick,
  side = 'right'
}: TextPageProps) => {
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
          ? "inset -20px 0 50px rgba(0,0,0,0.3), 5px 0 20px rgba(0,0,0,0.2)"
          : "inset -5px 0 20px rgba(0,0,0,0.1), 2px 0 10px rgba(0,0,0,0.05)"
      }}
      className="relative h-full w-full bg-card rounded-r-2xl overflow-hidden"
    >
      {/* Page crease effect */}
      <div className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-8 bg-gradient-to-${side === 'left' ? 'r' : 'l'} from-transparent via-black/5 to-black/10 pointer-events-none z-10`} />
      
      {/* Clickable corner zones for page flip - invisible until hover */}
      {onCornerClick && text && (
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
                  className="absolute inset-0 overflow-hidden bg-card"
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
                  <div className="absolute inset-0 p-8 font-serif text-lg text-foreground/80 overflow-hidden">
                    {text.slice(-100)}
                  </div>
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
                  className="absolute inset-0 overflow-hidden bg-card"
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
                  <div className="absolute inset-0 p-8 font-serif text-lg text-foreground/80 overflow-hidden">
                    {text.slice(0, 100)}
                  </div>
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
                  className="absolute inset-0 overflow-hidden bg-card"
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
                  <div className="absolute inset-0 p-8 font-serif text-lg text-foreground/80 overflow-hidden">
                    {text.slice(-100)}
                  </div>
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
                  className="absolute inset-0 overflow-hidden bg-card"
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
                  <div className="absolute inset-0 p-8 font-serif text-lg text-foreground/80 overflow-hidden">
                    {text.slice(0, 100)}
                  </div>
                  <div className="absolute inset-0 bg-primary/20" />
                </motion.div>
              </button>
            </>
          )}
        </>
      )}
      
      {/* Page content */}
      <div className="relative w-full h-full p-8 md:p-12 flex flex-col">
        {text ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-serif text-lg md:text-2xl leading-relaxed text-foreground/90 max-w-prose">
              {text}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-32 h-32 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-serif italic">
                Story text appears here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Page number */}
      {pageNumber !== undefined && (
        <div className="absolute bottom-6 right-6 text-xs font-serif text-muted-foreground/70">
          {pageNumber}
        </div>
      )}

      {/* Simulated page thickness on edge */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-border/30 via-border/50 to-border/30"
        style={{
          boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.1)'
        }}
      />
    </motion.div>
  );
};

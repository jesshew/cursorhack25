import { motion } from "framer-motion";

interface BookSpineProps {
  totalPages: number;
  currentSpread: number;
}

export const BookSpine = ({ totalPages, currentSpread }: BookSpineProps) => {
  // Calculate thickness of flipped pages
  const leftStackThickness = Math.max(0, currentSpread * 2);
  const rightStackThickness = Math.max(0, totalPages - (currentSpread * 2 + 2));

  return (
    <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-20 pointer-events-none">
      {/* Central spine */}
      <div className="absolute inset-0 bg-gradient-to-r from-border/60 via-border/80 to-border/60">
        {/* Spine shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/20 to-black/10" />
        
        {/* Spine highlight */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* Left page stack (pages that have been flipped) */}
      <motion.div
        className="absolute right-full top-4 bottom-4 bg-card"
        initial={{ width: 0 }}
        animate={{ width: leftStackThickness }}
        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{
          borderRadius: '4px 0 0 4px',
          boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.15), -1px 0 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(to right, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)'
        }}
      >
        {/* Page edges visualization */}
        {leftStackThickness > 0 && (
          <div className="absolute right-0 inset-y-0 w-full flex flex-col justify-evenly">
            {[...Array(Math.min(currentSpread, 8))].map((_, i) => (
              <div 
                key={i}
                className="h-px bg-border/30"
                style={{
                  marginRight: `${(i % 3) * 2}px`
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Right page stack (pages that haven't been read) */}
      <motion.div
        className="absolute left-full top-4 bottom-4 bg-card"
        initial={{ width: rightStackThickness }}
        animate={{ width: rightStackThickness }}
        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{
          borderRadius: '0 4px 4px 0',
          boxShadow: 'inset 3px 0 8px rgba(0,0,0,0.15), 1px 0 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(to left, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)'
        }}
      >
        {/* Page edges visualization */}
        {rightStackThickness > 0 && (
          <div className="absolute left-0 inset-y-0 w-full flex flex-col justify-evenly">
            {[...Array(Math.min(Math.ceil((totalPages - currentSpread * 2) / 2), 8))].map((_, i) => (
              <div 
                key={i}
                className="h-px bg-border/30"
                style={{
                  marginLeft: `${(i % 3) * 2}px`
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Spine depth shadow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="absolute right-0 inset-y-0 w-4 bg-gradient-to-l from-black/10 to-transparent" />
      </div>
    </div>
  );
};

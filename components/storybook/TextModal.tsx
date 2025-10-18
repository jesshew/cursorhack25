import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  pageNumber: number;
}

export const TextModal = ({ isOpen, onClose, text, pageNumber }: TextModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Integrate with ElevenLabs API
    console.log("Audio playback:", isPlaying ? "paused" : "playing");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 h-full md:h-auto overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-serif text-muted-foreground">
                  Page {pageNumber}
                </span>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="prose prose-lg max-w-none mb-8">
                <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground">
                  {text}
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">Narration</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Play Narration
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-primary h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "0%" }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Audio narration powered by ElevenLabs (Coming soon)
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

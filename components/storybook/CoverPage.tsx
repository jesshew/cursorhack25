import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import coverImage from "@/assets/cover.jpg";

interface CoverPageProps {
  onStart: () => void;
}

export const CoverPage = ({ onStart }: CoverPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-accent/20 p-4 md:p-8"
    >
      <div className="relative max-w-2xl w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ boxShadow: "var(--book-shadow)", maxHeight: "680px" }}
        >
          <img
            src={coverImage}
            alt="The Gardener of the Garden City book cover"
            className="w-full h-full object-cover"
            style={{ maxHeight: "680px" }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg"
            >
              The Gardener of the Garden City
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-serif text-xl md:text-2xl mb-8 text-white/90 drop-shadow"
            >
              By Siddhant Shrivastava
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button
                onClick={onStart}
                size="lg"
                className="bg-white hover:bg-white/90 text-primary font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Reading
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-8 text-muted-foreground font-serif italic"
        >
          A story about transformation and growth
        </motion.p>
      </div>
    </motion.div>
  );
};

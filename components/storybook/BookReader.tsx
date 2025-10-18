import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Settings, Menu, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoPage } from "./PhotoPage";
import { TextPage } from "./TextPage";
import { BookSpine } from "./BookSpine";
import { storybook } from "@/lib/storybook/data/storybook";
import { useReaderStore } from "@/lib/storybook/store/readerStore";
import { useKeyboardNavigation } from "@/lib/storybook/hooks/useKeyboardNavigation";
import { useSwipeGesture } from "@/lib/storybook/hooks/useSwipeGesture";

const imageMap: Record<string, string> = {
  "/page-1": "/storybook/page-1.png",
  "/page-2": "/storybook/page-2.png",
  "/page-3": "/storybook/page-3.png",
  "/page-4": "/storybook/page-4.png",
  "/page-5": "/storybook/page-5.png",
};

interface BookReaderProps {
  onBackToCover?: () => void;
}

export const BookReader = ({ onBackToCover }: BookReaderProps = {}) => {
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [flippingPage, setFlippingPage] = useState<'left' | 'right' | null>(null);

  const currentSpread = useReaderStore((state) => state.currentSpread);
  const setCurrentSpread = useReaderStore((state) => state.setCurrentSpread);
  const isPlaying = useReaderStore((state) => state.isPlaying);
  const setIsPlaying = useReaderStore((state) => state.setIsPlaying);

  const spreads = storybook.spreads;
  const totalSpreads = spreads.length;

  const handleNext = () => {
    if (currentSpread < totalSpreads - 1) {
      setFlippingPage('right');
      setTimeout(() => {
        setCurrentSpread(currentSpread + 1);
        setFlippingPage(null);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (currentSpread === 0 && onBackToCover) {
      // If at first spread and callback is provided, go back to cover
      onBackToCover();
    } else if (currentSpread > 0) {
      setFlippingPage('left');
      setTimeout(() => {
        setCurrentSpread(currentSpread - 1);
        setFlippingPage(null);
      }, 100);
    }
  };

  const handleHome = () => setCurrentSpread(0);
  const handleEnd = () => setCurrentSpread(totalSpreads - 1);
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Integrate with ElevenLabs API
    console.log("Audio playback:", isPlaying ? "paused" : "playing");
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleNext,
    onPrev: handlePrev,
    onHome: handleHome,
    onEnd: handleEnd,
    onPlayPause: handlePlayPause,
  });

  // Swipe gestures
  useSwipeGesture(bookContainerRef, {
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  });

  // Preload adjacent spread images
  useEffect(() => {
    const adjacentSpreads = [
      spreads[currentSpread - 1],
      spreads[currentSpread + 1],
    ].filter(Boolean);

    adjacentSpreads.forEach((spread) => {
      if (spread.leftPage.imageSrc) {
        const img = new Image();
        img.src = imageMap[spread.leftPage.imageSrc];
      }
      if (spread.rightPage.imageSrc) {
        const img = new Image();
        img.src = imageMap[spread.rightPage.imageSrc];
      }
    });
  }, [currentSpread]);

  const currentSpreadData = spreads[currentSpread];
  if (!currentSpreadData) return null;

  const { leftPage, rightPage } = currentSpreadData;
  const totalPages = spreads.length * 2;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary/10 via-background to-accent/10 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="font-serif text-lg md:text-xl font-semibold truncate max-w-xs md:max-w-md">
            {storybook.title}
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Book Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div 
          ref={bookContainerRef} 
          className="relative w-full max-w-7xl"
          style={{ perspective: '2500px' }}
        >
          {/* Desktop: Dual Page Spread with Spine */}
          <div className="hidden lg:block relative h-[600px]">
            <div className="absolute inset-0 grid grid-cols-2 gap-0">
              {/* Left Page */}
              <div className="relative pr-2">
                <AnimatePresence mode={flippingPage === 'left' ? 'wait' : 'sync'}>
                  {leftPage.type === 'photo' ? (
                    <PhotoPage
                      key={flippingPage === 'left' ? `left-${currentSpreadData.id}` : 'left-static'}
                      imageSrc={leftPage.imageSrc ? imageMap[leftPage.imageSrc] : undefined}
                      imageAlt={leftPage.imageAlt}
                      pageNumber={leftPage.pageNumber}
                      onCornerClick={handlePrev}
                      side="left"
                    />
                  ) : leftPage.type === 'text' ? (
                    <TextPage
                      key={flippingPage === 'left' ? `left-${currentSpreadData.id}` : 'left-static'}
                      text={leftPage.text}
                      pageNumber={leftPage.pageNumber}
                      onCornerClick={handlePrev}
                      side="left"
                    />
                  ) : null}
                </AnimatePresence>
              </div>
              
              {/* Right Page */}
              <div className="relative pl-2">
                <AnimatePresence mode={flippingPage === 'right' ? 'wait' : 'sync'}>
                  {rightPage.type === 'photo' ? (
                    <PhotoPage
                      key={flippingPage === 'right' ? `right-${currentSpreadData.id}` : 'right-static'}
                      imageSrc={rightPage.imageSrc ? imageMap[rightPage.imageSrc] : undefined}
                      imageAlt={rightPage.imageAlt}
                      pageNumber={rightPage.pageNumber}
                      onCornerClick={handleNext}
                      side="right"
                    />
                  ) : rightPage.type === 'text' ? (
                    <TextPage
                      key={flippingPage === 'right' ? `right-${currentSpreadData.id}` : 'right-static'}
                      text={rightPage.text}
                      pageNumber={rightPage.pageNumber}
                      onCornerClick={handleNext}
                      side="right"
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Book Spine */}
            <BookSpine totalPages={totalPages} currentSpread={currentSpread} />
          </div>

          {/* Mobile/Tablet: Single Page with text */}
          <div className="lg:hidden h-[500px] md:h-[600px] space-y-6">
            <AnimatePresence mode="wait">
              {leftPage.type === 'photo' ? (
                <div className="h-full">
                  <PhotoPage
                    key={`mobile-${currentSpreadData.id}`}
                    imageSrc={leftPage.imageSrc ? imageMap[leftPage.imageSrc] : undefined}
                    imageAlt={leftPage.imageAlt}
                    pageNumber={leftPage.pageNumber}
                  />
                </div>
              ) : leftPage.type === 'text' ? (
                <div className="h-full">
                  <TextPage
                    key={`mobile-${currentSpreadData.id}`}
                    text={leftPage.text}
                    pageNumber={leftPage.pageNumber}
                  />
                </div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={handlePrev}
            disabled={currentSpread === 0 && !onBackToCover}
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-full lg:left-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 w-12 h-12 md:w-14 md:h-14"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentSpread === totalSpreads - 1}
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-full lg:right-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 w-12 h-12 md:w-14 md:h-14"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        </div>
      </main>

      {/* Progress Indicator */}
      <footer className="sticky bottom-0 bg-card/80 backdrop-blur-md border-t border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-serif text-muted-foreground">
              {currentSpread + 1} / {totalSpreads}
            </span>
            <div className="flex-1 max-w-md bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

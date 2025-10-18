"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/elements/prompt-input";
import { ArrowUpIcon } from "@/components/icons";

// Array of rotating sample prompts
const SAMPLE_PROMPTS = [
  "Tell me a story from Lee Kuan Yew's memoirs…",
  "Show me a recipe from his childhood…",
  "Make a phone call to LKY",
  "Share the recipe for pork satay by Lee Kuan Yew's mother",
];

export default function LandingPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState(SAMPLE_PROMPTS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate placeholder text with animation (pause when user is typing)
  useEffect(() => {
    // Don't rotate placeholder if user has typed something
    if (input.trim()) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [input]);

  useEffect(() => {
    setPlaceholder(SAMPLE_PROMPTS[currentIndex]);
  }, [currentIndex]);

  // Handle form submission - redirect to chat with the input
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim()) {
      // Navigate to the root chat page with the query parameter
      router.push(`/?query=${encodeURIComponent(input)}`);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-start overflow-hidden bg-background">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/static/landing_page.png)",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-start gap-10 px-6 py-16 sm:px-12 md:gap-12 lg:px-20 lg:py-24">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex max-w-2xl flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mini Pill Badge */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge
              className="w-fit border-primary/20 bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm shadow-sm"
              variant="outline"
            >
              ✨ an interactive archive
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            KUAN-versations
          </motion.h1>

          {/* Subheading */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-light text-xl text-muted-foreground sm:text-2xl md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Stories, recipes, and real talk
          </motion.p>
        </motion.div>

        {/* Chat Input Component */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <PromptInput
            className="rounded-xl border border-border bg-background/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-xl hover:border-muted-foreground/50"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-row items-start gap-1 sm:gap-2">
              <div className="flex-1">
                <PromptInputTextarea
                  autoFocus
                  className="grow resize-none border-0! border-none! bg-transparent p-2 text-sm outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
                  disableAutoResize={true}
                  maxHeight={200}
                  minHeight={44}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  rows={1}
                  value={input}
                />
              </div>
            </div>
            <PromptInputToolbar className="!border-top-0 border-t-0! p-0 shadow-none dark:border-0 dark:border-transparent!">
              <div className="flex-1" />
              <PromptInputSubmit
                className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
                disabled={!input.trim()}
              >
                <ArrowUpIcon size={14} />
              </PromptInputSubmit>
            </PromptInputToolbar>
          </PromptInput>

          {/* Helper text */}
          <motion.p
            animate={{ opacity: 1 }}
            className="mt-3 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Press Enter to start your conversation with Lee Kuan Yew
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}


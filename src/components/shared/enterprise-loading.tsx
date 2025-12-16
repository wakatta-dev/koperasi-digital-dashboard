/** @format */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface EnterpriseLoadingProps {
  onComplete?: () => void;
  duration?: number;
  title?: string;
  subtitle?: string;
}

export default function EnterpriseLoading({
  duration = 3000,
  title = "Loading Application",
  subtitle = "Preparing your enterprise experience",
}: EnterpriseLoadingProps) {
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    "Initializing system...",
    "Loading components...",
    "Establishing connections...",
    "Finalizing setup...",
  ];

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % loadingStages.length);
    }, duration / 4);

    return () => {
      clearInterval(stageInterval);
    };
  }, [duration, loadingStages.length]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -25, 0],
          y: [0, 15, 0],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-primary/3 to-accent/3 blur-lg"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Loading Content */}
      <div className="text-center z-10 max-w-md mx-auto px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="relative mx-auto w-24 h-24 mb-8">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Middle rotating ring */}
            <motion.div
              className="absolute inset-2 rounded-full border border-accent/30"
              animate={{ rotate: -360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Inner pulsing core */}
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                  "0 0 40px rgba(16, 185, 129, 0.6)",
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <motion.svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Title and Subtitle */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <motion.h1
            className="text-3xl font-semibold text-foreground mb-3 font-sans"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {title}
          </motion.h1>
          <p className="text-muted-foreground text-lg font-sans">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          {/* Sophisticated spinner */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            {/* Outer arc */}
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-primary/60 border-r-primary/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Inner arc */}
            <motion.div
              className="absolute inset-3 border-2 border-transparent border-b-accent/60 border-l-accent/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Center dot */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Loading Stage Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground font-sans"
        >
          <motion.span
            key={loadingStage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-base"
          >
            {loadingStages[loadingStage]}
          </motion.span>
        </motion.div>

        <div className="absolute -z-10 inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-600/30 rounded-full"
              style={{
                left: `${10 + ((i * 7) % 80)}%`,
                top: `${20 + ((i * 11) % 60)}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                opacity: [0.1, 0.8, 0.1],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

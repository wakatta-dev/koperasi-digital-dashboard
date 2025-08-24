/** @format */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface EnterpriseLoadingProps {
  onComplete?: () => void;
  duration?: number;
  showProgress?: boolean;
  title?: string;
  subtitle?: string;
}

export default function EnterpriseLoading({
  onComplete,
  duration = 3000,
  showProgress = true,
  title = "Loading Application",
  subtitle = "Preparing your enterprise experience",
}: EnterpriseLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    "Initializing system...",
    "Loading components...",
    "Establishing connections...",
    "Finalizing setup...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % loadingStages.length);
    }, duration / 4);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, [duration, loadingStages.length, onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent/10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Loading Content */}
      <div className="text-center z-10 max-w-md mx-auto px-6">
        {/* Logo/Icon Area */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-20 h-20 mb-6">
            {/* Animated Logo Placeholder */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-lg bg-background flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Title and Subtitle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2 font-sans">
            {title}
          </h1>
          <p className="text-muted-foreground font-sans">{subtitle}</p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          {/* Spinning Loader */}
          <div className="relative mx-auto w-16 h-16 mb-6">
            <motion.div className="absolute inset-0 border-4 border-muted rounded-full" />
            <motion.div
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-2 border-2 border-accent border-b-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="w-full max-w-xs mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading Stage Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground font-sans"
        >
          <motion.span
            key={loadingStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingStages[loadingStage]}
          </motion.span>
        </motion.div>

        {/* Floating Dots Animation */}
        <div className="absolute -z-10 inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

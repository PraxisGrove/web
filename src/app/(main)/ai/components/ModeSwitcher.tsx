'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIMode = 'learner' | 'creator';

interface ModeSwitcherProps {
  mode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

export const ModeSwitcher = ({ mode, onModeChange }: ModeSwitcherProps) => {
  return (
    <div className="relative flex items-center gap-0.5 rounded-full bg-white/5 p-0.5 backdrop-blur-xl ring-1 ring-white/10">
      {/* Sliding Indicator */}
      <motion.div
        className="absolute inset-y-0.5 w-[calc(50%-1px)] rounded-full bg-white/10"
        initial={false}
        animate={{
          left: mode === 'learner' ? '2px' : 'calc(50% - 1px)',
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      />

      {/* Learn Button */}
      <button
        onClick={() => onModeChange('learner')}
        className={cn(
          "relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          mode === 'learner'
            ? "text-white"
            : "text-white/40 hover:text-white/60"
        )}
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span>Learn</span>
      </button>

      {/* Create Button */}
      <button
        onClick={() => onModeChange('creator')}
        className={cn(
          "relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          mode === 'creator'
            ? "text-white"
            : "text-white/40 hover:text-white/60"
        )}
      >
        <PenTool className="h-3.5 w-3.5" />
        <span>Create</span>
      </button>
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Aurora } from '@/components/reactbit';
import { BackgroundBeams } from '@/components/aceternity/background-beams';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { globalNavItems } from '@/lib/navigation';
import { ModeSwitcher, AIMode } from './ModeSwitcher';

interface AILayoutProps {
  children: (mode: AIMode) => React.ReactNode;
}

export const AILayout = ({ children }: AILayoutProps) => {
  const [mode, setMode] = useState<AIMode>('learner');

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background transition-colors duration-500">
      {/* Floating Navigation */}
      <FloatingNav navItems={globalNavItems} showLoginButton={true} />

      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {mode === 'learner' ? (
            <motion.div
              key="learner-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Aurora
                colorStops={['#00d2ff', '#3a7bd5', '#00d2ff']}
                blend={0.6}
                amplitude={1.2}
                speed={0.4}
              />
            </motion.div>
          ) : (
            <motion.div
              key="creator-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-slate-950"
            >
              <BackgroundBeams className="opacity-60" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <main className="relative z-10 flex min-h-screen flex-col pt-20">
        <div className="container mx-auto flex h-full flex-1 flex-col px-4 pb-4">
          {/* Minimal Header with Mode Switcher */}
          <div className="mb-4 flex items-center justify-end">
            <ModeSwitcher mode={mode} onModeChange={setMode} />
          </div>

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {children(mode)}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
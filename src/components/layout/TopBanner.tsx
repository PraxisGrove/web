'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TopBanner() {
  const pathname = usePathname();
  // Initialize with false to avoid hydration mismatch, update in useEffect
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/';
  const isRoadmapPage = pathname === '/roadmap';

  // Handle hydration and initial state
  useEffect(() => {
    setIsMounted(true);
    if (isHomePage) {
      setIsExpanded(true);
    }
  }, [isHomePage]);

  // Update expanded state when route changes (optional, usually users prefer persistence or context-aware)
  // Requirement: "expanded by default on the homepage, collapsible on other pages"
  // This implies if I navigate to homepage, it expands. If I navigate away, it collapses?
  // Let's implement: On route change, if new route is /, expand. Else, collapse.
  // But allow manual override? The requirement says "manually expandable".
  // Let's stick to the route-based reset for simplicity and matching requirements strictly.
  useEffect(() => {
    if (isMounted) {
      setIsExpanded(isHomePage);
    }
  }, [pathname, isHomePage, isMounted]);

  // Measure height dynamically
  useEffect(() => {
    if (!bannerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use borderBoxSize if available, fallback to contentRect
        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          setBannerHeight(entry.borderBoxSize[0].blockSize);
        } else {
          setBannerHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(bannerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isExpanded, isMounted]); // Re-measure when expansion changes

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        ref={bannerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] border-b shadow-sm transition-colors duration-300",
          "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-gray-200 dark:border-gray-800"
        )}
        initial={false}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            {/* Header / Summary Row */}
            <div className="flex items-center justify-between py-3">
              <div
                className="flex flex-1 items-center gap-3 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-md">
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    New Features Available!
                  </span>
                  {!isExpanded && (
                    <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400">
                      Discover our AI-powered 3D Knowledge Universe.
                    </span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label={isExpanded ? "Collapse banner" : "Expand banner"}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 pt-1 pl-[44px]"> {/* Align with text start */}
                    <p className="text-gray-600 dark:text-gray-300 mb-3 max-w-3xl leading-relaxed">
                      We have updated PraxisGrove with an immersive 3D learning experience.
                      Navigate through knowledge nodes, visualize connections, and track your personalized learning path powered by advanced AI.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
                        Explore 3D World
                      </button>
                      <button className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        Read Release Notes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Placeholder */}
      {!isRoadmapPage && (
        <div
          style={{ height: bannerHeight }}
          className="w-full shrink-0"
          aria-hidden="true"
        />
      )}
    </>
  );
}

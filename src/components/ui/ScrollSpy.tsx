'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollSpyProps {
  sections: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  offset?: number;
}

export function ScrollSpy({
  sections,
  className,
  offset = 100,
}: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // 检查是否应该显示导航
      setIsVisible(window.scrollY > 300);

      // 找到当前活跃的区域
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, offset]);

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - offset + 50;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className={cn(
            'fixed left-6 top-1/2 z-40 -translate-y-1/2',
            'hidden lg:block',
            className
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-full border border-gray-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-slate-800/90">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'relative h-3 w-3 rounded-full transition-all duration-300',
                      'hover:scale-125',
                      activeSection === section.id
                        ? 'scale-125 bg-gradient-to-r from-purple-500 to-blue-500'
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                    )}
                    title={section.label}
                  >
                    {/* 活跃指示器 */}
                    {activeSection === section.id && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        layoutId="activeIndicator"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* 悬停时显示标签 */}
                    <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 hover:opacity-100">
                      <div className="whitespace-nowrap rounded bg-black/80 px-2 py-1 text-sm text-white">
                        {section.label}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

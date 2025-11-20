'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export const FloatingNav = ({
  navItems,
  className,
  showLoginButton = true,
  loginText = '登录',
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  showLoginButton?: boolean;
  loginText?: string;
}) => {
  const [visible, setVisible] = useState(true);

  // 滚动检测
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 当滚动到顶部时总是显示
      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        // 向上滚动时显示，向下滚动时隐藏
        setVisible(currentScrollY < lastScrollY);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'aceternity-floating-nav',
          'fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-2 rounded-full px-4 py-2',
          'border border-white/20 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/10',
          className
        )}
      >
        {/* Logo 区域 */}
        <div
          className="flex cursor-pointer items-center rounded-full px-3 py-2 transition-all duration-200 hover:bg-black/5 hover:shadow-sm dark:hover:bg-white/5 dark:hover:shadow-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname;

              // 如果当前在首页，滚动到顶部
              if (currentPath === '/') {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              } else {
                // 如果不在首页，跳转到首页
                window.location.href = '/';
              }
            }
          }}
        >
          <Image
            src="/logo/favicon-32x32.png"
            alt="PraxisGrove"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>

        {/* 分隔线 */}
        <div className="h-6 w-px bg-white/20 dark:bg-white/10" />

        {/* 导航项 */}
        {navItems.map((navItem, idx) => (
          <button
            key={`nav-${idx}`}
            onClick={(e) => {
              e.preventDefault();

              // 使用原生导航
              if (typeof window !== 'undefined') {
                window.location.href = navItem.link;
              }
            }}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              'text-foreground/80 hover:text-foreground',
              'backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/5',
              'hover:shadow-sm dark:hover:shadow-none',
              'inline-flex items-center justify-center border-0 bg-transparent',
              'cursor-pointer'
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </button>
        ))}

        {/* 登录按钮 */}
        {showLoginButton && (
          <button
            onClick={(e) => {
              e.preventDefault();

              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            }}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              'text-foreground/80 hover:text-foreground',
              'backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/5',
              'hover:shadow-sm dark:hover:shadow-none',
              'inline-flex items-center justify-center border-0 bg-transparent',
              'cursor-pointer'
            )}
          >
            {loginText}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

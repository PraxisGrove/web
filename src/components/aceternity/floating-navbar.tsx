'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

export const FloatingNav = ({
  navItems,
  className,
  showLoginButton = true,
  loginText = 'Connect Wallet',
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
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const isMouseInTopZone = useRef(false);
  const isHoveringNav = useRef(false);
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const prevConnected = useRef(isConnected);

  useEffect(() => {
    if (!prevConnected.current && isConnected) {
      router.push('/profile');
    }
    prevConnected.current = isConnected;
  }, [isConnected, router]);

  const clearAutoHide = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  }, []);

  const startAutoHide = useCallback(
    (delay: number) => {
      clearAutoHide();
      autoHideTimer.current = setTimeout(() => {
        if (!isHoveringNav.current) {
          setVisible(false);
        }
      }, delay);
    },
    [clearAutoHide]
  );

  // 滚动和鼠标检测
  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      // 触发区域：顶部 120px (覆盖导航栏位置: top-10 + 高度)
      const threshold = 120;
      const inZone = e.clientY <= threshold;

      if (inZone) {
        if (!isMouseInTopZone.current) {
          setVisible(true);
        }
        isMouseInTopZone.current = true;
        // 在顶部区域移动时，重置自动隐藏计时器（保持显示）
        startAutoHide(4000);
      } else {
        if (isMouseInTopZone.current) {
          // 离开顶部区域
          isMouseInTopZone.current = false;
          // 离开区域后，如果没有悬停在导航栏上，短暂延迟后隐藏
          if (!isHoveringNav.current) {
            startAutoHide(1000);
          }
        }
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;

      if (isScrollingUp) {
        setVisible(true);
        // 向上滚动显示时，启动自动隐藏计时器
        startAutoHide(4000);
      } else {
        // 向下滚动
        if (!isMouseInTopZone.current && !isHoveringNav.current) {
          setVisible(false);
          clearAutoHide();
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearAutoHide();
    };
  }, [startAutoHide, clearAutoHide]);

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
        onMouseEnter={() => {
          isHoveringNav.current = true;
          clearAutoHide();
          setVisible(true);
        }}
        onMouseLeave={() => {
          isHoveringNav.current = false;
          startAutoHide(4000);
        }}
        className={cn(
          'aceternity-floating-nav',
          'fixed top-10 z-[5000] flex items-center justify-between rounded-full px-8 py-3',
          'left-1/2 -translate-x-1/2 w-[61.8%]', // Golden Ratio width and centering
          'border border-white/20 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/10',
          className
        )}
      >
        {/* Left Section: Logo & Divider */}
        <div className="flex items-center gap-4">
          <div
            className="flex cursor-pointer items-center rounded-full p-1 transition-all duration-200 hover:bg-black/5 hover:shadow-sm dark:hover:bg-white/5 dark:hover:shadow-none"
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
              width={28}
              height={28}
              className="object-contain"
            />
          </div>

        </div>

        {/* Center Section: Nav Items */}
        <div className="flex items-center gap-6">
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
                'relative rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
                'text-foreground/80 hover:text-foreground',
                'hover:bg-black/5 dark:hover:bg-white/5',
                'inline-flex items-center justify-center border-0 bg-transparent',
                'cursor-pointer'
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">
                {navItem.name === 'AI Assistant'
                  ? 'AI'
                  : navItem.name === 'Knowledge Universe'
                    ? 'Roadmap'
                    : navItem.name}
              </span>
            </button>
          ))}
        </div>

        {/* Right Section: Login Button */}
        <div className="flex items-center justify-end">
          {showLoginButton && (
            <button
              onClick={() => {
                if (isConnected) {
                  router.push('/profile');
                } else {
                  open();
                }
              }}
              className={cn(
                'relative flex items-center justify-center rounded-full transition-all duration-200',
                isConnected ? 'p-1' : 'px-4 py-2',
                'text-foreground/80 hover:text-foreground',
                'bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                'border border-black/5 dark:border-white/5',
                'focus:outline-none focus:ring-2 focus:ring-foreground/20',
                'active:scale-95'
              )}
            >
              {isConnected ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeWjwnyDPeuEl7vZXtMrOplVF3nXzmJ24JarYLEos-ei-ot-x8o_8drs9n6hsqu0fSk3VsYtpKZBggg6DbrmQbyj8nvXOxbDKZ-CLtOw9iW1fABtFTKA-YXxE2m8lhH3WhzAxwurudW1JQwIIa-PR2ZbpKR9E0ramhNV1tcjqOP9W6Dw81A8TvS6bv68U_Stu2zC8IHYqPGRcy9ppPgzudo4CrFNjUCWNOfT1khzGgAPuqAj3d39iJEDFRgN0C5mLzus5CMEbaerLF"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-sm font-medium">{loginText}</span>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

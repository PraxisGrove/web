'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
  onClick?: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'login',
    label: 'Quick Login',
    icon: User,
    color: 'from-green-500 to-emerald-500',
    href: '/login',
  },
  {
    id: '3d-universe',
    label: 'Roadmap',
    icon: Globe,
    color: 'from-orange-500 to-red-500',
    href: '/roadmap',
  },
];

export function QuickActions({ className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mouseLeaveTimer, setMouseLeaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const toggleOpen = () => setIsOpen(!isOpen);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };
  }, [mouseLeaveTimer]);

  const fabVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 45,
      scale: 1.1,
    },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      scale: 0,
      y: 20,
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const handleMouseLeave = () => {
    // 添加延迟，避免鼠标快速移动时意外触发
    const timer = setTimeout(() => {
      if (isOpen) {
        setIsOpen(false);
      }
    }, 300); // 300ms 延迟
    setMouseLeaveTimer(timer);
  };

  const handleMouseEnter = () => {
    // 鼠标重新进入时，清除延迟定时器
    if (mouseLeaveTimer) {
      clearTimeout(mouseLeaveTimer);
      setMouseLeaveTimer(null);
    }
  };

  return (
    <div
      className={cn('fixed bottom-6 right-6 z-50', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 快速操作菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col-reverse gap-3"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                variants={itemVariants}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主 FAB 按钮 */}
      <motion.div
        className={cn(
          'relative h-14 w-14 cursor-pointer rounded-full shadow-lg',
          'bg-white/20 backdrop-blur-md dark:bg-black/20',
          'border border-white/30 dark:border-white/10',
          'hover:bg-white/30 dark:hover:bg-black/30',
          'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]',
          'flex items-center justify-center',
          'transition-all duration-300'
        )}
        variants={fabVariants}
        animate={isOpen ? 'open' : 'closed'}
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="text-foreground h-6 w-6" />
        ) : (
          <Plus className="text-foreground h-6 w-6" />
        )}

        {/* 脉冲动画 */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm dark:bg-white/5"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 悬停发光效果 */}
        <motion.div
          className="dark:bg-white/3 absolute inset-0 rounded-full bg-white/5"
          initial={{ opacity: 0, scale: 1 }}
          whileHover={{
            opacity: 1,
            scale: 1.2,
            transition: { duration: 0.3 },
          }}
        />
      </motion.div>
    </div>
  );
}

interface QuickActionButtonProps {
  action: QuickAction;
  variants: any;
  onClose: () => void;
}

function QuickActionButton({
  action,
  variants,
  onClose,
}: QuickActionButtonProps) {
  const Icon = action.icon;

  const handleClick = () => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
    onClose();
  };

  return (
    <motion.div className="flex items-center justify-end" variants={variants}>
      {/* 按钮 */}
      <motion.button
        className={cn(
          'relative h-12 w-12 rounded-full shadow-lg',
          'bg-white/20 backdrop-blur-md dark:bg-black/20',
          'border border-white/30 dark:border-white/10',
          'hover:bg-white/30 dark:hover:bg-black/30',
          'hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]',
          'flex items-center justify-center',
          'overflow-hidden transition-all duration-300'
        )}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon className="text-foreground relative z-10 h-5 w-5" />

        {/* 悬停发光效果 */}
        <motion.div
          className="dark:bg-white/3 absolute inset-0 rounded-full bg-white/5"
          initial={{ opacity: 0, scale: 1 }}
          whileHover={{
            opacity: 1,
            scale: 1.2,
            transition: { duration: 0.3 },
          }}
        />
      </motion.button>
    </motion.div>
  );
}

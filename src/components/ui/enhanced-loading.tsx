'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { Loader2 } from 'lucide-react';

// 加载器类型
export type LoaderType =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'bars'
  | 'ring'
  | 'wave';

// 加载器尺寸
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

// 加载器属性
export interface LoaderProps {
  type?: LoaderType;
  size?: LoaderSize;
  color?: string;
  className?: string;
  text?: string;
}

// 尺寸映射
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

/**
 * 旋转加载器
 */
export function SpinnerLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  return (
    <motion.div
      className={cn('animate-spin', sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="h-full w-full" style={{ color }} />
    </motion.div>
  );
}

/**
 * 点状加载器
 */
export function DotsLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-3 h-3',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', dotSize[size])}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 脉冲加载器
 */
export function PulseLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  return (
    <motion.div
      className={cn('rounded-full', sizeClasses[size], className)}
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * 条状加载器
 */
export function BarsLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  const barHeight = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
  };

  const barWidth = {
    sm: 'w-0.5',
    md: 'w-1',
    lg: 'w-1.5',
    xl: 'w-2',
  };

  return (
    <div className={cn('flex items-end space-x-1', className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={cn('rounded-sm', barWidth[size], barHeight[size])}
          style={{ backgroundColor: color }}
          animate={{
            scaleY: [1, 0.3, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 环形加载器
 */
export function RingLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/**
 * 波浪加载器
 */
export function WaveLoader({
  size = 'md',
  className,
  color = 'currentColor',
}: Omit<LoaderProps, 'type'>) {
  const waveHeight = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={cn('w-1 rounded-full', waveHeight[size])}
          style={{ backgroundColor: color }}
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 通用加载器组件
 */
export function Loader({
  type = 'spinner',
  size = 'md',
  color,
  className,
  text,
}: LoaderProps) {
  const renderLoader = () => {
    const props = { size, className: '', color };

    switch (type) {
      case 'spinner':
        return <SpinnerLoader {...props} />;
      case 'dots':
        return <DotsLoader {...props} />;
      case 'pulse':
        return <PulseLoader {...props} />;
      case 'bars':
        return <BarsLoader {...props} />;
      case 'ring':
        return <RingLoader {...props} />;
      case 'wave':
        return <WaveLoader {...props} />;
      default:
        return <SpinnerLoader {...props} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {renderLoader()}
      {text && (
        <motion.p
          className={cn('text-muted-foreground', textSizeClasses[size])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// 进度条属性
export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * 进度条组件
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'bg-muted w-full overflow-hidden rounded-full',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
      {showValue && (
        <div className="text-muted-foreground mt-1 text-right text-sm">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// 骨架屏预设
export interface SkeletonPresetProps {
  className?: string;
}

/**
 * 文本骨架屏
 */
export function TextSkeleton({ className }: SkeletonPresetProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton({ className }: SkeletonPresetProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

/**
 * 列表骨架屏
 */
export function ListSkeleton({
  items = 3,
  className,
}: SkeletonPresetProps & { items?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: SkeletonPresetProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* 表头 */}
      <div className="flex space-x-3">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* 表格行 */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-3">
          {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// 加载覆盖层属性
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

/**
 * 加载覆盖层组件
 */
export function LoadingOverlay({
  loading,
  children,
  loader,
  className,
  overlayClassName,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            className={cn(
              'bg-background/80 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm',
              overlayClassName
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loader || <Loader type="spinner" size="lg" text="加载中..." />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

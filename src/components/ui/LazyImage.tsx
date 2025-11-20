'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { usePerformance } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  skeleton?: boolean;
  animation?: 'fade' | 'scale' | 'slide' | 'none';
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'blur',
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  objectFit = 'cover',
  onLoad,
  onError,
  fallback,
  skeleton = true,
  animation = 'fade',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { shouldOptimizeImages } = usePerformance();

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 生成默认的模糊占位符
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL =
    blurDataURL ||
    (width && height ? generateBlurDataURL(width, height) : undefined);

  // 动画变体
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: animation === 'scale' ? 0.8 : 1,
      y: animation === 'slide' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  // 错误状态
  if (hasError) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ width, height }}
      >
        {fallback || (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto mb-2 h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">图片加载失败</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', className)}
    >
      {/* 骨架屏 */}
      <AnimatePresence>
        {skeleton && !isLoaded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* 图片 */}
      {(inView || priority) && (
        <motion.div
          variants={animation !== 'none' ? imageVariants : undefined}
          initial={animation !== 'none' ? 'hidden' : undefined}
          animate={isLoaded ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={fill ? undefined : { objectFit }}
            placeholder={placeholder as any}
            blurDataURL={defaultBlurDataURL}
            priority={priority}
            quality={shouldOptimizeImages ? 60 : quality}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
          />
        </motion.div>
      )}
    </div>
  );
}

// 响应式图片组件
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className,
  ...props
}: Omit<LazyImageProps, 'width' | 'height' | 'fill'> & {
  aspectRatio?: string;
}) {
  return (
    <div className={cn('relative w-full', className)} style={{ aspectRatio }}>
      <LazyImage src={src} alt={alt} fill {...props} />
    </div>
  );
}

// 图片画廊组件
export function ImageGallery({
  images,
  className,
  itemClassName,
  columns = { sm: 1, md: 2, lg: 3 },
}: {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  itemClassName?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}) {
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid gap-4',
        `${gridCols[(columns.sm || 1) as keyof typeof gridCols]} md:${gridCols[(columns.md || 2) as keyof typeof gridCols]} lg:${gridCols[(columns.lg || 3) as keyof typeof gridCols]}`,
        className
      )}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={cn('group', itemClassName)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <ResponsiveImage
            src={image.src}
            alt={image.alt}
            className="overflow-hidden rounded-lg"
            animation="scale"
          />
          {image.caption && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {image.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

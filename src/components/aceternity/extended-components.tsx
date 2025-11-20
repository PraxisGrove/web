'use client';

import React from 'react';
import Image from 'next/image';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BackgroundBeams,
  PulseGlow,
  GradientShift,
  AnimatedContainer,
} from './index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 增强的英雄区域组件
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  backgroundVariant?: 'beams' | 'gradient' | 'particles';
  className?: string;
}

/**
 * 增强的英雄区域组件
 * 集成背景效果、动画和交互元素
 */
export function HeroSection({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundVariant = 'beams',
  className,
}: HeroSectionProps) {
  const renderBackground = () => {
    switch (backgroundVariant) {
      case 'beams':
        return <BackgroundBeams className="opacity-30" />;
      case 'gradient':
        return (
          <GradientShift
            colors={[
              'hsl(var(--primary))',
              'hsl(var(--secondary))',
              'hsl(var(--accent))',
            ]}
            direction="diagonal"
            speed="slow"
          />
        );
      case 'particles':
        return (
          <div className="from-background via-muted to-background absolute inset-0 bg-gradient-to-br" />
        );
      default:
        return null;
    }
  };

  return (
    <section
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden',
        className
      )}
    >
      {renderBackground()}

      <div className="container relative z-10 mx-auto px-4 text-center">
        <AnimatedContainer animation="slideUp" className="space-y-8">
          {subtitle && (
            <motion.p
              className="text-primary text-sm font-medium uppercase tracking-wide md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            className="text-foreground text-4xl font-bold md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}

          {(primaryAction || secondaryAction) && (
            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {primaryAction && (
                <PulseGlow intensity="medium" speed="normal">
                  <Button
                    size="lg"
                    onClick={primaryAction.onClick}
                    className="px-8 py-3 text-lg"
                  >
                    {primaryAction.text}
                  </Button>
                </PulseGlow>
              )}

              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="px-8 py-3 text-lg"
                >
                  {secondaryAction.text}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatedContainer>
      </div>
    </section>
  );
}

// 特性展示组件
interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  className?: string;
}

/**
 * 特性卡片组件
 */
export function FeatureCard({
  icon,
  title,
  description,
  highlight = false,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        'relative rounded-lg border p-6 transition-all duration-300',
        highlight
          ? 'aceternity-glow-border bg-card/50'
          : 'bg-card hover:border-primary/50 border-[hsl(var(--border))]',
        className
      )}
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {highlight && (
        <div className="from-primary/5 to-accent/5 absolute inset-0 rounded-lg bg-gradient-to-br" />
      )}

      <div className="relative z-10 space-y-4">
        {icon && (
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
            {icon}
          </div>
        )}

        <h3 className="text-foreground text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

// 特性网格组件
interface FeatureGridProps {
  features: Array<{
    icon?: React.ReactNode;
    title: string;
    description: string;
    highlight?: boolean;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * 特性网格组件
 */
export function FeatureGrid({
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <FeatureCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
}

// 统计数据组件
interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * 统计数据计数器组件
 */
export function StatsCounter({
  value,
  label,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: StatsCounterProps) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isVisible) return;

    const increment = value / (duration * 60); // 60fps
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= value) {
          clearInterval(timer);
          return value;
        }
        return next;
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return (
    <motion.div
      className={cn('text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
    >
      <div className="text-primary text-3xl font-bold md:text-4xl">
        {prefix}
        {Math.floor(count).toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground mt-2 text-sm md:text-base">
        {label}
      </div>
    </motion.div>
  );
}

// 统计数据网格组件
interface StatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
  }>;
  className?: string;
}

/**
 * 统计数据网格组件
 */
export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-8 md:grid-cols-4', className)}>
      {stats.map((stat, index) => (
        <StatsCounter key={index} {...stat} duration={2 + index * 0.2} />
      ))}
    </div>
  );
}

// 时间线组件
interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * 时间线组件
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* 时间线主线 */}
      <div className="bg-border absolute bottom-0 left-4 top-0 w-px md:left-1/2 md:-translate-x-1/2 md:transform" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={cn(
              'relative flex items-start',
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            )}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
          >
            {/* 时间线节点 */}
            <div className="border-primary bg-background absolute left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 md:left-1/2 md:-translate-x-1/2 md:transform">
              {item.icon || (
                <div
                  className={cn(
                    'h-3 w-3 rounded-full',
                    item.highlight ? 'bg-primary' : 'bg-muted-foreground'
                  )}
                />
              )}
            </div>

            {/* 内容卡片 */}
            <div
              className={cn(
                'ml-16 md:ml-0 md:w-5/12',
                index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
              )}
            >
              <Card
                className={cn(
                  'p-6',
                  item.highlight && 'aceternity-glow-border'
                )}
              >
                <div className="space-y-2">
                  {item.date && (
                    <div className="text-primary text-sm font-medium">
                      {item.date}
                    </div>
                  )}
                  <h3 className="text-foreground text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 交互式卡片组件
interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  variant?: 'default' | 'hover-lift' | 'tilt' | 'glow';
  className?: string;
}

/**
 * 交互式卡片组件
 */
export function InteractiveCard({
  title,
  description,
  image,
  badge,
  action,
  variant = 'default',
  className,
  ...props
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const variants = {
    'hover-lift': {
      hover: { y: -10, scale: 1.02 },
      tap: { scale: 0.98 },
    },
    tilt: {
      hover: { rotateY: 5, rotateX: 5 },
      tap: { scale: 0.95 },
    },
    glow: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
    default: {
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    },
  };

  return (
    <motion.div
      className={cn(
        'bg-card relative cursor-pointer overflow-hidden rounded-lg border',
        variant === 'glow' && 'aceternity-glow-border',
        className
      )}
      whileHover={variants[variant].hover}
      whileTap={variants[variant].tap}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {/* 背景渐变效果 */}
      <AnimatePresence>
        {isHovered && variant === 'glow' && (
          <motion.div
            className="from-primary/10 to-accent/10 absolute inset-0 bg-gradient-to-br"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* 图片区域 */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          {badge && (
            <div className="bg-primary text-primary-foreground absolute left-4 top-4 rounded-full px-2 py-1 text-xs font-medium">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div className="relative z-10 space-y-4 p-6">
        <h3 className="text-foreground text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>

        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="w-full"
          >
            {action.text}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// 进度指示器组件
interface ProgressIndicatorProps {
  steps: Array<{
    title: string;
    description?: string;
    completed?: boolean;
  }>;
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * 进度指示器组件
 */
export function ProgressIndicator({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: ProgressIndicatorProps) {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              'flex items-center',
              orientation === 'vertical' ? 'flex-col text-center' : 'flex-row'
            )}
          >
            {/* 步骤圆圈 */}
            <motion.div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300',
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted text-muted-foreground'
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index < currentStep ? '✓' : index + 1}
            </motion.div>

            {/* 步骤信息 */}
            <div
              className={cn('ml-3', orientation === 'vertical' && 'ml-0 mt-2')}
            >
              <div
                className={cn(
                  'font-medium',
                  index <= currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-muted-foreground text-sm">
                  {step.description}
                </div>
              )}
            </div>
          </div>

          {/* 连接线 */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'bg-border',
                orientation === 'horizontal'
                  ? 'mx-4 h-px flex-1'
                  : 'mx-auto my-2 h-8 w-px',
                index < currentStep && 'bg-primary'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// 通知横幅组件
interface NotificationBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * 通知横幅组件
 */
export function NotificationBanner({
  type = 'info',
  title,
  message,
  action,
  dismissible = true,
  onDismiss,
  className,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn('rounded-lg border p-4', typeStyles[type], className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
        </div>

        <div className="ml-4 flex items-center gap-2">
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="text-xs"
            >
              {action.text}
            </Button>
          )}

          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-xs"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

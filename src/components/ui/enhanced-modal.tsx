'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';
import { X } from 'lucide-react';

// 模态框尺寸类型
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// 动画变体类型
export type AnimationVariant =
  | 'fade'
  | 'scale'
  | 'slide-up'
  | 'slide-down'
  | 'bounce';

// 模态框属性接口
export interface EnhancedModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  animation?: AnimationVariant;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
}

// 尺寸映射
const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

// 动画变体
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: { opacity: 0, scale: 0.3 },
  },
};

/**
 * 增强模态框组件
 * 基于 Radix UI Dialog，集成 Framer Motion 动画和自定义样式
 */
export function EnhancedModal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  animation = 'scale',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  children,
  trigger,
  footer,
}: EnhancedModalProps) {
  const variants = animationVariants[animation];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={closeOnOverlayClick}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <AnimatePresence>
        {open && (
          <DialogContent
            className={cn(
              'overflow-hidden border-0 bg-transparent p-0 shadow-none',
              sizeClasses[size]
            )}
            showCloseButton={false}
            onEscapeKeyDown={
              closeOnEscape ? undefined : (e) => e.preventDefault()
            }
            onPointerDownOutside={
              closeOnOverlayClick ? undefined : (e) => e.preventDefault()
            }
          >
            <motion.div
              className={cn(
                'bg-background rounded-lg border shadow-lg',
                'aceternity-glass-effect',
                className
              )}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* 头部 */}
              {(title || description || showCloseButton) && (
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {title && (
                        <DialogTitle className="text-foreground text-xl font-semibold">
                          {title}
                        </DialogTitle>
                      )}
                      {description && (
                        <DialogDescription className="text-muted-foreground mt-2">
                          {description}
                        </DialogDescription>
                      )}
                    </div>

                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => onOpenChange?.(false)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">关闭</span>
                      </Button>
                    )}
                  </div>
                </DialogHeader>
              )}

              {/* 内容 */}
              <div
                className={cn(
                  'px-6',
                  !title && !description && 'pt-6',
                  !footer && 'pb-6'
                )}
              >
                {children}
              </div>

              {/* 底部 */}
              {footer && (
                <DialogFooter className="p-6 pt-4">{footer}</DialogFooter>
              )}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

// 抽屉组件属性接口
export interface EnhancedDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
}

// 抽屉尺寸映射
const drawerSizeClasses = {
  sm: {
    right: 'w-80',
    left: 'w-80',
    top: 'h-1/3',
    bottom: 'h-1/3',
  },
  md: {
    right: 'w-96',
    left: 'w-96',
    top: 'h-1/2',
    bottom: 'h-1/2',
  },
  lg: {
    right: 'w-[32rem]',
    left: 'w-[32rem]',
    top: 'h-2/3',
    bottom: 'h-2/3',
  },
  full: {
    right: 'w-full',
    left: 'w-full',
    top: 'h-full',
    bottom: 'h-full',
  },
};

/**
 * 增强抽屉组件
 * 基于 Radix UI Dialog (Sheet)，提供侧边滑出效果
 */
export function EnhancedDrawer({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  size = 'md',
  className,
  children,
  trigger,
  footer,
}: EnhancedDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent
        side={side}
        className={cn(
          'aceternity-glass-effect border-border/20',
          drawerSizeClasses[size][side],
          className
        )}
      >
        {/* 头部 */}
        {(title || description) && (
          <SheetHeader>
            {title && (
              <SheetTitle className="text-foreground text-xl font-semibold">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        )}

        {/* 内容 */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* 底部 */}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}

// 确认对话框组件
export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  trigger?: React.ReactNode;
}

/**
 * 确认对话框组件
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title = '确认操作',
  description = '您确定要执行此操作吗？',
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  variant = 'default',
  trigger,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <EnhancedModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      animation="bounce"
      trigger={trigger}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      {/* 确认对话框不需要额外内容 */}
      <div />
    </EnhancedModal>
  );
}

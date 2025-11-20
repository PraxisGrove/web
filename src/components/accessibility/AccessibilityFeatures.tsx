'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Accessibility,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  soundEnabled: boolean;
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusVisible: true,
    soundEnabled: true,
  });

  const panelRef = useRef<HTMLDivElement>(null);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;

      // Alt + A 打开可访问性面板
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }

      // Escape 关闭面板
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, settings.keyboardNavigation]);

  const toggleSetting = (key: keyof AccessibilityState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
      soundEnabled: true,
    });
  };

  return (
    <>
      {/* 可访问性按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed right-4 top-4 z-50 p-2',
          'bg-white/90 backdrop-blur-sm dark:bg-slate-800/90',
          'border-2 border-purple-500',
          'hover:bg-purple-50 dark:hover:bg-purple-900/20',
          'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
        )}
        aria-label="打开可访问性设置"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="h-5 w-5" />
      </Button>

      {/* 可访问性面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* 面板内容 */}
            <motion.div
              ref={panelRef}
              id="accessibility-panel"
              className={cn(
                'fixed right-4 top-16 z-50 max-h-[80vh] w-80 overflow-y-auto',
                'rounded-lg border bg-white shadow-xl dark:bg-slate-800',
                'p-6'
              )}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-describedby="accessibility-description"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 id="accessibility-title" className="text-lg font-semibold">
                  可访问性设置
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="关闭可访问性设置"
                >
                  ×
                </Button>
              </div>

              <p
                id="accessibility-description"
                className="mb-6 text-sm text-gray-600 dark:text-gray-300"
              >
                调整这些设置以改善您的浏览体验。使用 Alt + A 快速打开此面板。
              </p>

              <div className="space-y-4">
                {/* 视觉设置 */}
                <div>
                  <h3 className="mb-3 flex items-center font-medium">
                    <Eye className="mr-2 h-4 w-4" />
                    视觉设置
                  </h3>
                  <div className="space-y-3">
                    <AccessibilityToggle
                      label="高对比度模式"
                      description="增强文本和背景的对比度"
                      checked={settings.highContrast}
                      onChange={() => toggleSetting('highContrast')}
                      icon={<Contrast className="h-4 w-4" />}
                    />
                    <AccessibilityToggle
                      label="大字体模式"
                      description="增大文字大小以提高可读性"
                      checked={settings.largeText}
                      onChange={() => toggleSetting('largeText')}
                      icon={<Type className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* 动画设置 */}
                <div>
                  <h3 className="mb-3 flex items-center font-medium">
                    <MousePointer className="mr-2 h-4 w-4" />
                    动画设置
                  </h3>
                  <div className="space-y-3">
                    <AccessibilityToggle
                      label="减少动画"
                      description="减少或禁用页面动画效果"
                      checked={settings.reducedMotion}
                      onChange={() => toggleSetting('reducedMotion')}
                      icon={<EyeOff className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* 导航设置 */}
                <div>
                  <h3 className="mb-3 flex items-center font-medium">
                    <Keyboard className="mr-2 h-4 w-4" />
                    导航设置
                  </h3>
                  <div className="space-y-3">
                    <AccessibilityToggle
                      label="键盘导航"
                      description="启用键盘快捷键和导航"
                      checked={settings.keyboardNavigation}
                      onChange={() => toggleSetting('keyboardNavigation')}
                      icon={<Keyboard className="h-4 w-4" />}
                    />
                    <AccessibilityToggle
                      label="焦点指示器"
                      description="显示键盘焦点的可视指示器"
                      checked={settings.focusVisible}
                      onChange={() => toggleSetting('focusVisible')}
                      icon={<MousePointer className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* 音频设置 */}
                <div>
                  <h3 className="mb-3 flex items-center font-medium">
                    <Volume2 className="mr-2 h-4 w-4" />
                    音频设置
                  </h3>
                  <div className="space-y-3">
                    <AccessibilityToggle
                      label="音效提示"
                      description="启用界面交互的音效反馈"
                      checked={settings.soundEnabled}
                      onChange={() => toggleSetting('soundEnabled')}
                      icon={
                        settings.soundEnabled ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4" />
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 重置按钮 */}
              <div className="mt-6 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="w-full"
                >
                  重置所有设置
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// 可访问性切换组件
interface AccessibilityToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
}

function AccessibilityToggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: AccessibilityToggleProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 flex-shrink-0 text-gray-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <label className="flex cursor-pointer items-center">
          <div className="flex-1">
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {description}
            </div>
          </div>
          <div className="ml-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className={cn(
                'h-4 w-4 rounded border-2 border-gray-300',
                'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                'checked:border-purple-500 checked:bg-purple-500',
                'transition-colors duration-200'
              )}
              aria-describedby={`${label.replace(/\s+/g, '-').toLowerCase()}-description`}
            />
          </div>
        </label>
      </div>
    </div>
  );
}

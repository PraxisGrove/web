'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/unified';

interface NavigationControlsProps {
  onResetView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleFullscreen?: () => void;
  onToggleLabels?: () => void;
  onToggleConnections?: () => void;
  onViewPreset?: (preset: 'top' | 'front' | 'side' | 'isometric') => void;
  showLabels?: boolean;
  showConnections?: boolean;
  isFullscreen?: boolean;
  className?: string;
}

const viewPresets = [
  { name: 'top', label: '俯视图', icon: '⬇️', position: [0, 10, 0] },
  { name: 'front', label: '正视图', icon: '👁️', position: [0, 0, 10] },
  { name: 'side', label: '侧视图', icon: '👀', position: [10, 0, 0] },
  { name: 'isometric', label: '等轴图', icon: '🎯', position: [7, 7, 7] },
] as const;

export function NavigationControls({
  onResetView,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onToggleLabels,
  onToggleConnections,
  onViewPreset,
  showLabels = true,
  showConnections = true,
  isFullscreen = false,
  className = '',
}: NavigationControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showViewPresets, setShowViewPresets] = useState(false);

  const handleViewPreset = useCallback((preset: typeof viewPresets[number]) => {
    onViewPreset?.(preset.name);
    setShowViewPresets(false);
  }, [onViewPreset]);

  return (
    <div className={`absolute right-4 top-4 z-10 ${className}`}>
      {/* 主控制面板 */}
      <motion.div
        className="rounded-lg border border-white/10 bg-black/30 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 展开/收起按钮 */}
        <motion.button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all hover:bg-white/20"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </motion.svg>
        </motion.button>

        {/* 扩展控制面板 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="mt-2 space-y-2 p-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 缩放控制 */}
              <div className="flex space-x-1">
                <motion.button
                  className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-white transition-all hover:bg-white/30"
                  onClick={onZoomIn}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="放大"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-white transition-all hover:bg-white/30"
                  onClick={onZoomOut}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="缩小"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </motion.button>
              </div>

              {/* 视图控制 */}
              <div className="relative">
                <motion.button
                  className="flex h-8 w-full items-center justify-center rounded bg-blue-500/30 text-white transition-all hover:bg-blue-500/50"
                  onClick={() => setShowViewPresets(!showViewPresets)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xs">视角</span>
                </motion.button>

                <AnimatePresence>
                  {showViewPresets && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-white/10 bg-black/80 p-1 backdrop-blur-md"
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {viewPresets.map((preset) => (
                        <motion.button
                          key={preset.name}
                          className="flex w-full items-center space-x-2 rounded px-2 py-1 text-xs text-white transition-all hover:bg-white/20"
                          onClick={() => handleViewPreset(preset)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{preset.icon}</span>
                          <span>{preset.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 重置视图 */}
              <motion.button
                className="flex h-8 w-full items-center justify-center rounded bg-green-500/30 text-white transition-all hover:bg-green-500/50"
                onClick={onResetView}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="重置视角"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>

              {/* 显示选项 */}
              <div className="space-y-1">
                <motion.button
                  className={`flex h-8 w-full items-center justify-center rounded text-xs transition-all ${
                    showLabels 
                      ? 'bg-blue-500/50 text-white' 
                      : 'bg-white/20 text-gray-300'
                  }`}
                  onClick={onToggleLabels}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  标签
                </motion.button>

                <motion.button
                  className={`flex h-8 w-full items-center justify-center rounded text-xs transition-all ${
                    showConnections 
                      ? 'bg-purple-500/50 text-white' 
                      : 'bg-white/20 text-gray-300'
                  }`}
                  onClick={onToggleConnections}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  连接
                </motion.button>
              </div>

              {/* 全屏切换 */}
              <motion.button
                className="flex h-8 w-full items-center justify-center rounded bg-orange-500/30 text-white transition-all hover:bg-orange-500/50"
                onClick={onToggleFullscreen}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={isFullscreen ? '退出全屏' : '全屏模式'}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 快捷操作提示 */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            className="mt-2 rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-white/70 backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
          >
            <div>鼠标拖拽: 旋转</div>
            <div>滚轮: 缩放</div>
            <div>右键拖拽: 平移</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

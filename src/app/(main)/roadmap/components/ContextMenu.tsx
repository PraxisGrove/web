'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Edit3,
  Copy,
  CheckCircle2,
  Circle,
  Play,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useRoadmapStore } from '../store';
import type { NodeStatus } from '../types';

interface ContextMenuProps {
  nodeId: string | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

/**
 * Status options for the submenu
 */
const statusOptions: { value: NodeStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'pending', label: 'Pending', icon: Circle, color: 'text-slate-500' },
  { value: 'in-progress', label: 'In Progress', icon: Play, color: 'text-blue-500' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'locked', label: 'Locked', icon: Lock, color: 'text-gray-400' },
];

/**
 * Context Menu Component
 */
export function ContextMenu({ nodeId, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  
  const deleteNode = useRoadmapStore((s) => s.deleteNode);
  const addChildNode = useRoadmapStore((s) => s.addChildNode);
  const setNodeStatus = useRoadmapStore((s) => s.setNodeStatus);
  const nodes = useRoadmapStore((s) => s.nodes);

  const currentNode = nodes.find((n) => n.id === nodeId);

  /**
   * Handle click outside to close
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!nodeId || !position) return null;

  /**
   * Handle delete node
   */
  const handleDelete = () => {
    deleteNode(nodeId);
    onClose();
  };

  /**
   * Handle add child node
   */
  const handleAddChild = () => {
    addChildNode(nodeId, 'New Node');
    onClose();
  };

  /**
   * Handle status change
   */
  const handleStatusChange = (status: NodeStatus) => {
    setNodeStatus(nodeId, status);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Node label */}
        <div className="mb-1 border-b border-slate-100 px-3 py-2 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {currentNode?.data?.label || 'Node Actions'}
          </span>
        </div>

        {/* Menu items */}
        <div className="space-y-0.5">
          {/* Add child */}
          <button
            onClick={handleAddChild}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Plus className="h-4 w-4 text-blue-500" />
            Add Child Node
          </button>

          {/* Change status - with submenu */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <div className="flex items-center gap-3">
                <Edit3 className="h-4 w-4 text-purple-500" />
                Change Status
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            {/* Status submenu */}
            <AnimatePresence>
              {showStatusMenu && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full top-0 ml-1 min-w-[140px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = currentNode?.data?.status === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          isActive
                            ? 'bg-slate-100 font-medium dark:bg-slate-700'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        {option.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Duplicate */}
          <button
            onClick={() => {
              // Simple duplicate - just adds a child with same name
              if (currentNode) {
                addChildNode(
                  currentNode.data.parentId || 'root',
                  `${currentNode.data.label} (Copy)`
                );
              }
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Copy className="h-4 w-4 text-cyan-500" />
            Duplicate Node
          </button>

          {/* Divider */}
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-700" />

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4" />
            Delete Node
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
'use client';

import React, { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Code,
} from 'lucide-react';
import type { RoadmapNodeData, NodeStatus, NodeCategory } from '../types';
import { useRoadmapStore } from '../store';

/**
 * Type for ConceptNode props
 */
type ConceptNodeProps = NodeProps<Node<RoadmapNodeData, 'concept'>>;

/**
 * Status icon mapping
 */
const StatusIcon = {
  pending: Circle,
  'in-progress': Play,
  completed: CheckCircle2,
  locked: Lock,
} as const;

/**
 * Status color mapping (Tailwind classes)
 */
const statusColors = {
  pending: {
    bg: 'bg-slate-500/20 dark:bg-slate-400/20',
    border: 'border-slate-500/50 dark:border-slate-400/50',
    text: 'text-slate-600 dark:text-slate-300',
    icon: 'text-slate-500 dark:text-slate-400',
  },
  'in-progress': {
    bg: 'bg-blue-500/20 dark:bg-blue-400/20',
    border: 'border-blue-500/50 dark:border-blue-400/50',
    text: 'text-blue-600 dark:text-blue-300',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  completed: {
    bg: 'bg-green-500/20 dark:bg-green-400/20',
    border: 'border-green-500/50 dark:border-green-400/50',
    text: 'text-green-600 dark:text-green-300',
    icon: 'text-green-500 dark:text-green-400',
  },
  locked: {
    bg: 'bg-gray-500/20 dark:bg-gray-400/20',
    border: 'border-gray-500/50 dark:border-gray-400/50',
    text: 'text-gray-500 dark:text-gray-400',
    icon: 'text-gray-400 dark:text-gray-500',
  },
} as const;

/**
 * Category color mapping
 */
const categoryColors = {
  foundation: 'from-amber-500/20 to-orange-500/20 dark:from-amber-500/30 dark:to-orange-500/30',
  core: 'from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30',
  advanced: 'from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30',
  practice: 'from-green-500/20 to-teal-500/20 dark:from-green-500/30 dark:to-teal-500/30',
  project: 'from-rose-500/20 to-red-500/20 dark:from-rose-500/30 dark:to-red-500/30',
} as const;

/**
 * Resource type icon mapping
 */
const resourceIcons = {
  video: Video,
  article: FileText,
  documentation: BookOpen,
  exercise: Code,
} as const;

/**
 * Simple Markdown-like renderer
 */
const renderMarkdown = (content: string): React.ReactNode => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';

  lines.forEach((line, index) => {
    // Code block start/end
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-2 overflow-x-auto rounded-md bg-slate-900/50 p-3 text-xs dark:bg-slate-800/50"
          >
            <code className="text-green-400">{codeContent.trim()}</code>
          </pre>
        );
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        // Language hint is available via line.slice(3).trim() if needed
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      return;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          {line.slice(2)}
        </h1>
      );
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="mb-2 mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">
          {line.slice(3)}
        </h2>
      );
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="mb-1 mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {line.slice(4)}
        </h3>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={index}
          className="my-2 border-l-2 border-blue-500 pl-3 text-sm italic text-slate-600 dark:text-slate-400"
        >
          {line.slice(2)}
        </blockquote>
      );
      return;
    }

    // List items
    if (line.match(/^[-*] /)) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-sm text-slate-700 dark:text-slate-300">
          {renderInlineMarkdown(line.slice(2))}
        </li>
      );
      return;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="ml-4 list-decimal text-sm text-slate-700 dark:text-slate-300">
          {renderInlineMarkdown(line.replace(/^\d+\. /, ''))}
        </li>
      );
      return;
    }

    // Table handling (simple)
    if (line.startsWith('|')) {
      if (line.includes('---')) return; // Skip separator line
      const cells = line.split('|').filter(Boolean).map((cell) => cell.trim());
      elements.push(
        <div key={index} className="flex gap-2 text-xs">
          {cells.map((cell, i) => (
            <span
              key={i}
              className="flex-1 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800"
            >
              {cell}
            </span>
          ))}
        </div>
      );
      return;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={index} className="text-sm text-slate-700 dark:text-slate-300">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  return elements;
};

/**
 * Render inline markdown (bold, italic, code, links)
 */
const renderInlineMarkdown = (text: string): React.ReactNode => {
  // Replace inline code
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded-sm bg-slate-200 px-1 py-0.5 font-mono text-xs dark:bg-slate-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold">
            {bp.slice(2, -2)}
          </strong>
        );
      }
      return bp;
    });
  });
};

/**
 * ConceptNode Component
 */
function ConceptNodeComponent({ id, data, selected }: ConceptNodeProps) {
  const toggleNodeExpanded = useRoadmapStore((s) => s.toggleNodeExpanded);
  const toggleNodeCollapse = useRoadmapStore((s) => s.toggleNodeCollapse);

  const nodeData = data as RoadmapNodeData;
  const {
    label,
    description,
    status,
    category,
    duration,
    tags,
    isExpanded,
    isCollapsed,
    childIds,
    resources,
  } = nodeData;

  const colors = statusColors[status as NodeStatus];
  const categoryGradient = categoryColors[category as NodeCategory];
  const StatusIconComponent = StatusIcon[status as NodeStatus];
  const hasChildren = childIds && childIds.length > 0;

  /**
   * Handle expand/collapse details
   */
  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleNodeExpanded(id);
    },
    [id, toggleNodeExpanded]
  );

  /**
   * Handle collapse/expand children
   */
  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleNodeCollapse(id);
    },
    [id, toggleNodeCollapse]
  );

  return (
    <motion.div
      className={`
        relative min-w-[260px] max-w-[320px] overflow-hidden rounded-xl
        border-2 bg-white/90 shadow-lg backdrop-blur-sm
        transition-all duration-200
        dark:bg-slate-900/90
        ${colors.border}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${categoryGradient}`} />

      {/* Header */}
      <div
        className={`flex items-center gap-3 p-3 ${colors.bg} cursor-pointer`}
        onClick={handleToggleExpand}
      >
        {/* Status icon */}
        <div className={`rounded-full p-1.5 ${colors.bg}`}>
          <StatusIconComponent className={`h-4 w-4 ${colors.icon}`} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold truncate ${status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-slate-900 dark:text-white'}`}
          >
            {label}
          </h3>
          {duration && (
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{duration} min</span>
            </div>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pb-2">
          {tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto border-t border-slate-200 p-3 dark:border-slate-700">
              {/* Description */}
              <div className="prose prose-sm dark:prose-invert">
                {renderMarkdown(description)}
              </div>

              {/* Resources */}
              {resources && resources.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Resources
                  </h4>
                  <div className="space-y-1.5">
                    {resources.map((resource: { title: string; url: string; type: 'video' | 'article' | 'documentation' | 'exercise' }, index: number) => {
                      const IconComp = resourceIcons[resource.type];
                      return (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-md p-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                          <IconComp className="h-4 w-4" />
                          <span className="flex-1 truncate">{resource.title}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse children button */}
      {hasChildren && (
        <button
          onClick={handleToggleCollapse}
          className={`
            absolute -bottom-3 left-1/2 z-10 -translate-x-1/2
            flex items-center gap-1 rounded-full border-2
            bg-white px-2 py-0.5 text-xs font-medium shadow-md
            transition-all hover:scale-105
            dark:bg-slate-800
            ${isCollapsed ? 'border-orange-400 text-orange-600 dark:text-orange-400' : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400'}
          `}
        >
          <ChevronRight
            className={`h-3 w-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
          />
          {isCollapsed ? `Expand ${childIds.length}` : 'Collapse'}
        </button>
      )}

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-slate-400 dark:!bg-slate-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
        style={{ bottom: hasChildren ? 12 : -6 }}
      />
    </motion.div>
  );
}

export const ConceptNode = memo(ConceptNodeComponent);
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  LayoutList,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Expand,
  RotateCcw,
  Sun,
  Moon,
  HelpCircle,
  ChevronLeft,
  X,
  MessageSquare,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { ConceptNode, ContextMenu, AIChatPanel } from './components';
import { useRoadmapStore, useVisibleNodes, useVisibleEdges } from './store';
import { useUIStore, uiSelectors } from '@/store/ui';
import { applyDagreLayout } from './hooks';
import type { RoadmapNode, LayoutDirection } from './types';

/**
 * Context menu state interface
 */
interface ContextMenuState {
  nodeId: string | null;
  position: { x: number; y: number } | null;
}

/**
 * Node types configuration for React Flow
 */
const nodeTypes: NodeTypes = {
  concept: ConceptNode,
};

/**
 * Edge styles based on relationship type
 */
const getEdgeStyle = (relationship: string) => {
  switch (relationship) {
    case 'prerequisite':
      return {
        stroke: '#3b82f6',
        strokeWidth: 2,
        animated: false,
      };
    case 'related':
      return {
        stroke: '#8b5cf6',
        strokeWidth: 1.5,
        strokeDasharray: '5,5',
        animated: false,
      };
    case 'optional':
      return {
        stroke: '#6b7280',
        strokeWidth: 1,
        strokeDasharray: '3,3',
        animated: false,
      };
    default:
      return {
        stroke: '#94a3b8',
        strokeWidth: 1.5,
      };
  }
};

/**
 * Floating Toolbar Component
 */
function FloatingToolbar() {
  const { theme, setTheme } = useTheme();
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const layoutDirection = useRoadmapStore((s) => s.layoutDirection);
  const setLayoutDirection = useRoadmapStore((s) => s.setLayoutDirection);
  const setNodes = useRoadmapStore((s) => s.setNodes);
  const nodes = useRoadmapStore((s) => s.nodes);
  const edges = useRoadmapStore((s) => s.edges);
  const resetToMockData = useRoadmapStore((s) => s.resetToMockData);
  
  const aiChatConfig = useUIStore(uiSelectors.aiChatConfig);
  const toggleAIChatVisibility = useUIStore((state) => state.toggleAIChatVisibility);

  const [showHelp, setShowHelp] = useState(false);

  /**
   * Apply auto layout
   */
  const handleAutoLayout = useCallback(
    (direction: LayoutDirection) => {
      const layoutedNodes = applyDagreLayout(nodes, edges, { direction });
      setNodes(layoutedNodes);
      setLayoutDirection(direction);
      setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 50);
    },
    [nodes, edges, setNodes, setLayoutDirection, fitView]
  );

  /**
   * Reset view
   */
  const handleResetView = useCallback(() => {
    fitView({ padding: 0.2, duration: 500 });
  }, [fitView]);

  /**
   * Toggle fullscreen
   */
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <>
      <Panel position="top-left" className="!m-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur-sm dark:bg-slate-800/90"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <h1 className="px-2 text-lg font-bold text-slate-900 dark:text-white">
            Learning Roadmap
          </h1>
        </motion.div>
      </Panel>

      <Panel position="top-right" className="!m-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 rounded-xl bg-white/90 p-1.5 shadow-lg backdrop-blur-sm dark:bg-slate-800/90"
        >
          {/* Layout Direction */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
            <button
              onClick={() => handleAutoLayout('TB')}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                layoutDirection === 'TB'
                  ? 'bg-white text-blue-600 shadow dark:bg-slate-600 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-600/50'
              }`}
              title="Vertical Layout"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAutoLayout('LR')}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                layoutDirection === 'LR'
                  ? 'bg-white text-blue-600 shadow dark:bg-slate-600 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-600/50'
              }`}
              title="Horizontal Layout"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Zoom Controls */}
          <button
            onClick={() => zoomIn({ duration: 300 })}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => zoomOut({ duration: 300 })}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetView}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Fit View"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Fullscreen"
          >
            <Expand className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Reset Data */}
          <button
            onClick={resetToMockData}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Reset Data"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* AI Chat Toggle */}
          {aiChatConfig.enabled && (
            <button
              onClick={toggleAIChatVisibility}
              className={`rounded-lg p-2 transition-colors ${
                aiChatConfig.visible
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
              title="Toggle AI Assistant"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}

          {/* Help */}
          <button
            onClick={() => setShowHelp(true)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </motion.div>
      </Panel>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Help Guide
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <strong className="text-slate-900 dark:text-white">🖱️ Canvas Controls</strong>
                  <p>• Pan: Hold left mouse button and drag</p>
                  <p>• Zoom: Mouse wheel or toolbar buttons</p>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">📦 Node Actions</strong>
                  <p>• Click node: Expand/collapse details</p>
                  <p>• Drag node: Move node position</p>
                  <p>• Click expand button: Show/hide children</p>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">🔗 Connections</strong>
                  <p>• Blue solid line: Prerequisite relationship</p>
                  <p>• Purple dashed: Related knowledge</p>
                  <p>• Gray dashed: Optional learning path</p>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">📊 Status Legend</strong>
                  <p>• ⭕ Pending | ▶️ In Progress | ✅ Completed | 🔒 Locked</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Stats Panel Component
 */
function StatsPanel() {
  const nodes = useRoadmapStore((s) => s.nodes);

  const stats = useMemo(() => {
    const total = nodes.length;
    const completed = nodes.filter((n) => n.data.status === 'completed').length;
    const inProgress = nodes.filter((n) => n.data.status === 'in-progress').length;
    const locked = nodes.filter((n) => n.data.status === 'locked').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, locked, progress };
  }, [nodes]);

  return (
    <Panel position="bottom-left" className="!m-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-slate-800/90"
      >
        <div className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
          Progress
        </div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {stats.progress}%
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{stats.total}</div>
            <div className="text-slate-500">Total</div>
          </div>
          <div>
            <div className="font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-slate-500">Done</div>
          </div>
          <div>
            <div className="font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <div className="text-slate-500">Active</div>
          </div>
          <div>
            <div className="font-bold text-slate-400">{stats.locked}</div>
            <div className="text-slate-500">Locked</div>
          </div>
        </div>
      </motion.div>
    </Panel>
  );
}

/**
 * Main Flow Component
 */
function RoadmapFlow() {
  const { fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nodes = useVisibleNodes();
  const edges = useVisibleEdges();
  const onNodesChange = useRoadmapStore((s) => s.onNodesChange);
  const onEdgesChange = useRoadmapStore((s) => s.onEdgesChange);
  const onConnect = useRoadmapStore((s) => s.onConnect);
  const setNodes = useRoadmapStore((s) => s.setNodes);
  const layoutDirection = useRoadmapStore((s) => s.layoutDirection);
  const allNodes = useRoadmapStore((s) => s.nodes);
  const allEdges = useRoadmapStore((s) => s.edges);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    nodeId: null,
    position: null,
  });

  /**
   * Handle node right-click
   */
  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: RoadmapNode) => {
      event.preventDefault();
      setContextMenu({
        nodeId: node.id,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  /**
   * Close context menu
   */
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ nodeId: null, position: null });
  }, []);

  /**
   * Handle pane click to close context menu
   */
  const handlePaneClick = useCallback(() => {
    handleCloseContextMenu();
  }, [handleCloseContextMenu]);

  // Apply edges with styles
  const styledEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      style: getEdgeStyle(edge.data?.relationship || 'prerequisite'),
      type: 'smoothstep',
    }));
  }, [edges]);

  // Initial layout on mount
  useEffect(() => {
    const layoutedNodes = applyDagreLayout(allNodes, allEdges, {
      direction: layoutDirection,
    });
    setNodes(layoutedNodes);
    
    // Fit view after layout
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - dependencies intentionally omitted to prevent infinite loops

  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50 dark:bg-slate-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="currentColor"
          className="text-slate-200 dark:text-slate-800"
        />
        <Controls
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="!bg-transparent !shadow-none"
        />
        <MiniMap
          nodeColor={(node) => {
            const status = (node.data as any)?.status;
            switch (status) {
              case 'completed':
                return '#22c55e';
              case 'in-progress':
                return '#3b82f6';
              case 'locked':
                return '#9ca3af';
              default:
                return '#64748b';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-white/80 dark:!bg-slate-800/80 !rounded-xl !border !border-slate-200 dark:!border-slate-700"
        />
        <FloatingToolbar />
        <StatsPanel />
      </ReactFlow>

      {/* AI Chat Panel */}
      <AIChatPanel />

      {/* Context Menu */}
      <ContextMenu
        nodeId={contextMenu.nodeId}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
}

/**
 * Main Roadmap Page Component
 */
export default function RoadmapPage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <ReactFlowProvider>
        <RoadmapFlow />
      </ReactFlowProvider>
    </div>
  );
}

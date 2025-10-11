'use client';

import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/unified';
import { KnowledgeNode, KnowledgeConnection } from '@/types/api';

// 动态导入 3D 组件以避免 SSR 问题
const KnowledgeGraph3D = dynamic(
  () => import('./knowledge-graph-simple').then(mod => ({ default: mod.KnowledgeGraph3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-white">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-500/20"></div>
          <p>初始化 3D 渲染...</p>
        </div>
      </div>
    )
  }
);

const NavigationControls = dynamic(
  () => import('./navigation-controls').then(mod => ({ default: mod.NavigationControls })),
  { ssr: false }
);

const InfoPanel = dynamic(
  () => import('./info-panel').then(mod => ({ default: mod.InfoPanel })),
  { ssr: false }
);

const NodeEditor = dynamic(
  () => import('./node-editor').then(mod => ({ default: mod.NodeEditor })),
  { ssr: false }
);

const ProgressDisplay = dynamic(
  () => import('./progress-display').then(mod => ({ default: mod.ProgressDisplay })),
  { ssr: false }
);

interface KnowledgeUniverseProps {
  initialNodes?: KnowledgeNode[];
  initialConnections?: KnowledgeConnection[];
  onNodeUpdate?: (nodes: KnowledgeNode[]) => void;
  onConnectionUpdate?: (connections: KnowledgeConnection[]) => void;
  className?: string;
}

export function KnowledgeUniverse({
  initialNodes = [],
  initialConnections = [],
  onNodeUpdate,
  onConnectionUpdate,
  className = '',
}: KnowledgeUniverseProps) {
  const [nodes, setNodes] = useState<KnowledgeNode[]>(initialNodes);
  const [connections, setConnections] = useState<KnowledgeConnection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    node?: KnowledgeNode | null;
  }>({
    isOpen: false,
    mode: 'create',
    node: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<any>(null);

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  // 节点操作
  const handleNodeClick = useCallback((node: KnowledgeNode) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleNodeHover = useCallback((node: KnowledgeNode | null) => {
    setHoveredNode(node);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleSearchNode = useCallback((nodeId: string) => {
    // 这里可以添加相机移动到节点的逻辑
    setSelectedNodeId(nodeId);
  }, []);

  const handleHighlightPath = useCallback((nodeIds: string[]) => {
    // TODO: 实现路径高亮逻辑
  }, []);

  // 编辑器操作
  const handleCreateNode = useCallback(() => {
    setEditorState({
      isOpen: true,
      mode: 'create',
      node: null,
    });
  }, []);

  const handleEditNode = useCallback((node: KnowledgeNode) => {
    setEditorState({
      isOpen: true,
      mode: 'edit',
      node,
    });
  }, []);

  const handleSaveNode = useCallback((nodeData: Partial<KnowledgeNode>) => {
    if (editorState.mode === 'create') {
      const newNode: KnowledgeNode = {
        id: `node_${Date.now()}`,
        title: nodeData.title || '',
        description: nodeData.description || '',
        type: nodeData.type || 'concept',
        category: nodeData.category || '',
        level: nodeData.level || 'beginner',
        position: nodeData.position || { x: 0, y: 0, z: 0 },
        connections: [],
        metadata: nodeData.metadata || {
          difficulty: 0.5,
          importance: 0.5,
          prerequisites: [],
          learningTime: 60,
        },
        resources: { courses: [], articles: [], videos: [] },
        userProgress: { isLearned: false, masteryLevel: 0 },
      };
      
      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      onNodeUpdate?.(updatedNodes);
    } else if (editorState.mode === 'edit' && editorState.node) {
      const updatedNodes = nodes.map(node =>
        node.id === editorState.node!.id
          ? { ...node, ...nodeData }
          : node
      );
      setNodes(updatedNodes);
      onNodeUpdate?.(updatedNodes);
    }
  }, [editorState, nodes, onNodeUpdate]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    const updatedConnections = connections.filter(
      conn => conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    );
    
    setNodes(updatedNodes);
    setConnections(updatedConnections);
    onNodeUpdate?.(updatedNodes);
    onConnectionUpdate?.(updatedConnections);
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(undefined);
    }
  }, [nodes, connections, selectedNodeId, onNodeUpdate, onConnectionUpdate]);

  // 导航控制
  const handleResetView = useCallback(() => {
    // TODO: 实现重置相机位置的逻辑
  }, []);

  const handleZoomIn = useCallback(() => {
    // TODO: 实现放大逻辑
  }, []);

  const handleZoomOut = useCallback(() => {
    // TODO: 实现缩小逻辑
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleViewPreset = useCallback((preset: 'top' | 'front' | 'side' | 'isometric') => {
    // TODO: 实现预设视角逻辑
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative h-full w-full ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
    >
      {/* 主要的 3D 渲染区域 */}
      <KnowledgeGraph3D
        nodes={nodes as any}
        connections={connections}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        selectedNodeId={selectedNodeId}
        showLabels={showLabels}
        showConnections={showConnections}
        enableInteraction={true}
      />

      {/* 信息面板 */}
      <InfoPanel
        nodes={nodes}
        connections={connections}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
        onSearchNode={handleSearchNode}
        onHighlightPath={handleHighlightPath}
      />

      {/* 导航控制 */}
      <NavigationControls
        onResetView={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onToggleConnections={() => setShowConnections(!showConnections)}
        onViewPreset={handleViewPreset}
        showLabels={showLabels}
        showConnections={showConnections}
        isFullscreen={isFullscreen}
      />

      {/* 底部操作栏 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNode}
            className="text-white hover:bg-white/20"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加节点
          </Button>

          {selectedNode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditNode(selectedNode)}
              className="text-white hover:bg-white/20"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑节点
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProgressPanel(!showProgressPanel)}
            className="text-white hover:bg-white/20"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            进度统计
          </Button>
        </motion.div>
      </div>

      {/* 进度面板 */}
      <AnimatePresence>
        {showProgressPanel && (
          <motion.div
            className="absolute right-4 bottom-20 z-10 w-80"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ProgressDisplay nodes={nodes} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 节点编辑器 */}
      <NodeEditor
        node={editorState.node}
        isOpen={editorState.isOpen}
        onClose={() => setEditorState({ ...editorState, isOpen: false })}
        onSave={handleSaveNode}
        onDelete={handleDeleteNode}
        mode={editorState.mode}
      />
    </div>
  );
}

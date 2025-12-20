'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Hand,
} from 'lucide-react';

import { ConceptNode, ContextMenu, AIChatPanel } from './components';
import { useRoadmapStore, useVisibleNodes, useVisibleEdges } from './store';
import { applyDagreLayout } from './hooks';
import type { RoadmapNode } from './types';

interface ContextMenuState {
  nodeId: string | null;
  position: { x: number; y: number } | null;
}

const nodeTypes: NodeTypes = {
  concept: ConceptNode,
};

const getEdgeStyle = (relationship: string) => {
  switch (relationship) {
    case 'prerequisite':
      return {
        stroke: 'url(#gradientLine)', // Use gradient definition
        strokeWidth: 3,
        animated: true,
      };
    case 'related':
      return {
        stroke: '#2a3241',
        strokeWidth: 3,
        strokeDasharray: '8 4',
        animated: false,
      };
    default:
      return {
        stroke: '#2a3241',
        strokeWidth: 3,
      };
  }
};

function BottomToolbar() {
  const { fitView, zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoomLabel, setZoomLabel] = useState('100%');

  // Update zoom label periodically or on change
  useEffect(() => {
    const interval = setInterval(() => {
      setZoomLabel(`${Math.round(getZoom() * 100)}%`);
    }, 100);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-panel rounded-full px-2 py-1.5 gap-1 flex items-center shadow-2xl bg-[#13161c]/70 backdrop-blur-xl border border-white/10">
        <button className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors" title="Select">
          <MousePointer2 size={20} />
        </button>
        <button className="size-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors" title="Hand Tool">
          <Hand size={20} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1"></div>
        <button onClick={() => zoomOut()} className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors" title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <span className="text-xs font-mono text-white/60 min-w-[3ch] text-center">{zoomLabel}</span>
        <button onClick={() => zoomIn()} className="size-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1"></div>
        <button 
          onClick={() => fitView({ duration: 500 })}
          className="h-8 px-4 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors"
        >
          Fit View
        </button>
      </div>
    </div>
  );
}

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

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    nodeId: null,
    position: null,
  });

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

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ nodeId: null, position: null });
  }, []);

  const handlePaneClick = useCallback(() => {
    handleCloseContextMenu();
  }, [handleCloseContextMenu]);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      style: getEdgeStyle(edge.data?.relationship || 'prerequisite'),
      type: 'smoothstep', // Or 'bezier' for curves
      animated: edge.data?.relationship === 'prerequisite',
    }));
  }, [edges]);

  useEffect(() => {
    const layoutedNodes = applyDagreLayout(allNodes, allEdges, {
      direction: layoutDirection,
    });
    setNodes(layoutedNodes);
    
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full bg-[#0b0c10] relative group/canvas">
      {/* Custom Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#2a3241_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      
      {/* SVG Definitions for Gradients */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        <defs>
          <linearGradient id="gradientLine" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#2a3241" stopOpacity="1" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#2a3241" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

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
        className="bg-transparent"
      >
        <MiniMap
          nodeColor={(node) => {
            const status = (node.data as any)?.status;
            switch (status) {
              case 'completed': return '#22c55e';
              case 'in-progress': return '#3b82f6';
              case 'locked': return '#4b5563';
              default: return '#64748b';
            }
          }}
          maskColor="rgba(11, 12, 16, 0.8)"
          className="!bottom-8 !right-8 !m-0 !h-32 !w-48 !rounded-lg !border !border-[#2a3241] !bg-[#1c2127] !shadow-xl"
        />
        
        <BottomToolbar />
      </ReactFlow>

      <ContextMenu
        nodeId={contextMenu.nodeId}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0c10] text-slate-200">
      <ReactFlowProvider>
        <main className="relative flex-1 overflow-hidden">
          <RoadmapFlow />
        </main>
        <aside className="w-[380px] xl:w-[450px] shrink-0 border-l border-white/5 bg-[#0f1115] flex flex-col relative z-30 shadow-2xl">
          <AIChatPanel />
        </aside>
      </ReactFlowProvider>
    </div>
  );
}

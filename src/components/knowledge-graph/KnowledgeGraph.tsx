'use client';

import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { KnowledgeNode, KnowledgeConnection } from '@/types/api';
import { transformNodes, transformEdges } from './utils/transform';
import { getLayoutedElements } from './utils/layout';
import { Button } from '@/components/unified';

interface KnowledgeGraphProps {
  initialNodes: KnowledgeNode[];
  initialConnections: KnowledgeConnection[];
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
}

export function KnowledgeGraph({
  initialNodes,
  initialConnections,
  onNodeClick,
}: KnowledgeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 初始化并应用布局
  useEffect(() => {
    const flowNodes = transformNodes(initialNodes);
    const flowEdges = transformEdges(initialConnections);
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowNodes,
      flowEdges,
      'TB' // 默认从上到下布局
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [initialNodes, initialConnections, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        
        <Panel position="top-right" className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onLayout('TB')}
            className="bg-white/80 backdrop-blur-sm dark:bg-black/50"
          >
            垂直布局
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onLayout('LR')}
            className="bg-white/80 backdrop-blur-sm dark:bg-black/50"
          >
            水平布局
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
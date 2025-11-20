import { Node, Edge } from '@xyflow/react';
import { KnowledgeNode, KnowledgeConnection } from '@/types/api';

/**
 * 将 KnowledgeNode 转换为 React Flow Node
 */
export const transformNodes = (nodes: KnowledgeNode[]): Node[] => {
  return nodes.map((node) => ({
    id: node.id,
    type: 'default', // 可以根据 node.type 自定义节点类型
    data: { 
      label: node.title,
      description: node.description,
      original: node 
    },
    position: { x: node.position.x * 100, y: node.position.y * 100 }, // 简单的坐标转换，后续会由 dagre 覆盖
    className: getNodeClassName(node),
  }));
};

/**
 * 将 KnowledgeConnection 转换为 React Flow Edge
 */
export const transformEdges = (connections: KnowledgeConnection[]): Edge[] => {
  return connections.map((conn) => ({
    id: conn.id,
    source: conn.fromNodeId,
    target: conn.toNodeId,
    type: 'default', // 可以根据 conn.type 自定义边类型
    animated: true,
    label: conn.type,
    style: { stroke: getEdgeColor(conn.type) },
    data: { original: conn },
  }));
};

/**
 * 根据节点类型获取样式类名
 */
const getNodeClassName = (node: KnowledgeNode): string => {
  const baseClass = 'rounded-lg border-2 p-4 shadow-md min-w-[150px] text-center';
  
  switch (node.type) {
    case 'concept':
      return `${baseClass} bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700`;
    case 'skill':
      return `${baseClass} bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700`;
    case 'topic':
      return `${baseClass} bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700`;
    case 'course':
      return `${baseClass} bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700`;
    default:
      return `${baseClass} bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700`;
  }
};

/**
 * 根据连接类型获取边颜色
 */
const getEdgeColor = (type: string): string => {
  switch (type) {
    case 'prerequisite':
      return '#ef4444'; // red-500
    case 'related':
      return '#3b82f6'; // blue-500
    case 'builds_on':
      return '#22c55e'; // green-500
    case 'similar':
      return '#a855f7'; // purple-500
    default:
      return '#9ca3af'; // gray-400
  }
};
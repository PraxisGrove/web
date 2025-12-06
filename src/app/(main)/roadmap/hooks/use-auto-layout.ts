import { useCallback, useMemo } from 'react';
import dagre from 'dagre';
import type { RoadmapNode, RoadmapEdge, LayoutDirection } from '../types';

/**
 * Node dimensions for layout calculation
 */
const NODE_WIDTH = 280;
const NODE_HEIGHT_COLLAPSED = 80;
const NODE_HEIGHT_EXPANDED = 200;

/**
 * Layout configuration
 */
interface LayoutConfig {
  direction: LayoutDirection;
  nodeSpacing: number;
  rankSpacing: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  direction: 'TB',
  nodeSpacing: 50,
  rankSpacing: 100,
};

/**
 * Get node height based on expansion state
 */
const getNodeHeight = (node: RoadmapNode): number => {
  return node.data.isExpanded ? NODE_HEIGHT_EXPANDED : NODE_HEIGHT_COLLAPSED;
};

/**
 * Apply dagre layout algorithm to nodes and edges
 */
export function applyDagreLayout(
  nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  config: Partial<LayoutConfig> = {}
): RoadmapNode[] {
  const { direction, nodeSpacing, rankSpacing } = { ...DEFAULT_CONFIG, ...config };

  // Create a new dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set graph configuration
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: getNodeHeight(node),
    });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply positions to nodes
  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    
    if (!dagreNode) {
      return node;
    }

    // Center the node (dagre returns center position)
    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - getNodeHeight(node) / 2,
      },
    };
  });
}

/**
 * Hook for automatic layout functionality
 */
export function useAutoLayout(
  nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  direction: LayoutDirection = 'TB'
) {
  /**
   * Calculate laid-out nodes
   */
  const layoutedNodes = useMemo(() => {
    if (nodes.length === 0) return [];
    return applyDagreLayout(nodes, edges, { direction });
  }, [nodes, edges, direction]);

  /**
   * Get layout function for manual triggering
   */
  const getLayoutedElements = useCallback(
    (
      inputNodes: RoadmapNode[] = nodes,
      inputEdges: RoadmapEdge[] = edges,
      layoutDirection: LayoutDirection = direction
    ) => {
      return {
        nodes: applyDagreLayout(inputNodes, inputEdges, { direction: layoutDirection }),
        edges: inputEdges,
      };
    },
    [nodes, edges, direction]
  );

  /**
   * Force re-layout with current settings
   */
  const forceLayout = useCallback(() => {
    return applyDagreLayout(nodes, edges, { direction });
  }, [nodes, edges, direction]);

  return {
    layoutedNodes,
    getLayoutedElements,
    forceLayout,
  };
}

/**
 * Get optimal viewport to fit all nodes
 */
export function getViewportForNodes(
  nodes: RoadmapNode[],
  containerWidth: number,
  containerHeight: number,
  padding: number = 50
): { x: number; y: number; zoom: number } {
  if (nodes.length === 0) {
    return { x: 0, y: 0, zoom: 1 };
  }

  // Calculate bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + getNodeHeight(node));
  });

  // Calculate dimensions
  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;

  // Calculate zoom to fit
  const zoomX = (containerWidth - padding * 2) / graphWidth;
  const zoomY = (containerHeight - padding * 2) / graphHeight;
  const zoom = Math.min(zoomX, zoomY, 1); // Don't zoom in more than 100%

  // Calculate center position
  const x = (containerWidth - graphWidth * zoom) / 2 - minX * zoom;
  const y = (containerHeight - graphHeight * zoom) / 2 - minY * zoom;

  return { x, y, zoom };
}

/**
 * Animated layout transition helper
 */
export function interpolatePositions(
  startNodes: RoadmapNode[],
  endNodes: RoadmapNode[],
  progress: number // 0 to 1
): RoadmapNode[] {
  const endPositions = new Map(endNodes.map((n) => [n.id, n.position]));

  return startNodes.map((node) => {
    const endPos = endPositions.get(node.id);
    if (!endPos) return node;

    return {
      ...node,
      position: {
        x: node.position.x + (endPos.x - node.position.x) * progress,
        y: node.position.y + (endPos.y - node.position.y) * progress,
      },
    };
  });
}

export { NODE_WIDTH, NODE_HEIGHT_COLLAPSED, NODE_HEIGHT_EXPANDED };
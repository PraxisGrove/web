import type { Node, Edge } from '@xyflow/react';

/**
 * Node status for learning progress tracking
 */
export type NodeStatus = 'pending' | 'in-progress' | 'completed' | 'locked';

/**
 * Node category for visual grouping
 */
export type NodeCategory =
  | 'foundation'
  | 'core'
  | 'advanced'
  | 'practice'
  | 'project';

/**
 * Custom data structure for roadmap nodes
 */
export interface RoadmapNodeData extends Record<string, unknown> {
  /** Display label/title */
  label: string;
  /** Markdown-formatted description */
  description: string;
  /** Current learning status */
  status: NodeStatus;
  /** Node category for styling */
  category: NodeCategory;
  /** Estimated learning duration in minutes */
  duration?: number;
  /** Tags for filtering/searching */
  tags?: string[];
  /** Learning objectives for this node */
  objectives?: string[];
  /** Whether the detail panel is expanded */
  isExpanded: boolean;
  /** Whether child nodes are collapsed (hidden) */
  isCollapsed: boolean;
  /** Parent node ID for tree traversal */
  parentId?: string;
  /** Child node IDs for collapse functionality */
  childIds: string[];
  /** Priority order within siblings */
  order?: number;
  /** External resource links */
  resources?: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'documentation' | 'exercise';
  }[];
}

/**
 * Typed roadmap node extending React Flow's Node type
 */
export type RoadmapNode = Node<RoadmapNodeData, 'concept'>;

/**
 * Custom edge data
 */
export interface RoadmapEdgeData extends Record<string, unknown> {
  /** Relationship type */
  relationship: 'prerequisite' | 'related' | 'optional';
  /** Whether this edge is animated */
  animated?: boolean;
}

/**
 * Typed roadmap edge extending React Flow's Edge type
 */
export type RoadmapEdge = Edge<RoadmapEdgeData>;

/**
 * Layout direction options
 */
export type LayoutDirection = 'TB' | 'LR';

/**
 * Store state interface
 */
export interface RoadmapState {
  /** All nodes in the graph */
  nodes: RoadmapNode[];
  /** All edges in the graph */
  edges: RoadmapEdge[];
  /** Current layout direction */
  layoutDirection: LayoutDirection;
  /** Selected node ID */
  selectedNodeId: string | null;
  /** Whether the editor is in edit mode */
  isEditMode: boolean;
  /** Zoom level */
  zoom: number;
  /** Viewport position */
  viewport: { x: number; y: number };
}

/**
 * AI-generated roadmap response structure
 */
export interface AIRoadmapResponse {
  title: string;
  description: string;
  nodes: Omit<RoadmapNodeData, 'isExpanded' | 'isCollapsed' | 'childIds'>[];
  edges: { source: string; target: string; relationship: RoadmapEdgeData['relationship'] }[];
}
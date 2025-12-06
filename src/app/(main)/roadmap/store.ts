import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type {
  RoadmapNode,
  RoadmapEdge,
  RoadmapNodeData,
  LayoutDirection,
} from './types';
import { mockRoadmapNodes, mockRoadmapEdges, getAllDescendantIds } from './mock-roadmap';

/**
 * Store state interface
 */
interface RoadmapState {
  // Data
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  
  // View state
  layoutDirection: LayoutDirection;
  selectedNodeId: string | null;
  isEditMode: boolean;
  
  // Hidden nodes (for collapse functionality)
  hiddenNodeIds: Set<string>;
  
  // Actions - Core React Flow
  setNodes: (nodes: RoadmapNode[]) => void;
  setEdges: (edges: RoadmapEdge[]) => void;
  onNodesChange: (changes: NodeChange<RoadmapNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<RoadmapEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Actions - Node Operations
  updateNodeData: (nodeId: string, data: Partial<RoadmapNodeData>) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  toggleNodeCollapse: (nodeId: string) => void;
  setNodeStatus: (nodeId: string, status: RoadmapNodeData['status']) => void;
  
  // Actions - CRUD
  addNode: (node: RoadmapNode) => void;
  deleteNode: (nodeId: string) => void;
  addChildNode: (parentId: string, label: string) => void;
  
  // Actions - View
  setLayoutDirection: (direction: LayoutDirection) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setEditMode: (isEditMode: boolean) => void;
  
  // Actions - Utility
  resetToMockData: () => void;
  getVisibleNodes: () => RoadmapNode[];
  getVisibleEdges: () => RoadmapEdge[];
}

/**
 * Generate unique ID
 */
const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create the Zustand store
 */
export const useRoadmapStore = create<RoadmapState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        nodes: mockRoadmapNodes,
        edges: mockRoadmapEdges,
        layoutDirection: 'TB',
        selectedNodeId: null,
        isEditMode: false,
        hiddenNodeIds: new Set(),

        // Core React Flow actions
        setNodes: (nodes) => set({ nodes }, false, 'setNodes'),
        
        setEdges: (edges) => set({ edges }, false, 'setEdges'),
        
        onNodesChange: (changes) =>
          set(
            (state) => ({
              nodes: applyNodeChanges(changes, state.nodes),
            }),
            false,
            'onNodesChange'
          ),
        
        onEdgesChange: (changes) =>
          set(
            (state) => ({
              edges: applyEdgeChanges(changes, state.edges),
            }),
            false,
            'onEdgesChange'
          ),
        
        onConnect: (connection) =>
          set(
            (state) => ({
              edges: addEdge(
                {
                  ...connection,
                  id: `e-${connection.source}-${connection.target}`,
                  data: { relationship: 'related' as const },
                },
                state.edges
              ),
            }),
            false,
            'onConnect'
          ),

        // Node data operations
        updateNodeData: (nodeId, data) =>
          set(
            (state) => ({
              nodes: state.nodes.map((node) =>
                node.id === nodeId
                  ? { ...node, data: { ...node.data, ...data } }
                  : node
              ),
            }),
            false,
            'updateNodeData'
          ),
        
        toggleNodeExpanded: (nodeId) =>
          set(
            (state) => ({
              nodes: state.nodes.map((node) =>
                node.id === nodeId
                  ? { ...node, data: { ...node.data, isExpanded: !node.data.isExpanded } }
                  : node
              ),
            }),
            false,
            'toggleNodeExpanded'
          ),
        
        toggleNodeCollapse: (nodeId) => {
          const state = get();
          const node = state.nodes.find((n) => n.id === nodeId);
          if (!node) return;

          const isCurrentlyCollapsed = node.data.isCollapsed;
          const descendantIds = getAllDescendantIds(nodeId, state.edges);
          
          set(
            (state) => {
              const newHiddenIds = new Set(state.hiddenNodeIds);
              
              if (isCurrentlyCollapsed) {
                // Expand: remove descendants from hidden (unless their parent is also collapsed)
                descendantIds.forEach((id) => newHiddenIds.delete(id));
              } else {
                // Collapse: add descendants to hidden
                descendantIds.forEach((id) => newHiddenIds.add(id));
              }

              return {
                nodes: state.nodes.map((n) =>
                  n.id === nodeId
                    ? { ...n, data: { ...n.data, isCollapsed: !isCurrentlyCollapsed } }
                    : n
                ),
                hiddenNodeIds: newHiddenIds,
              };
            },
            false,
            'toggleNodeCollapse'
          );
        },
        
        setNodeStatus: (nodeId, status) =>
          set(
            (state) => ({
              nodes: state.nodes.map((node) =>
                node.id === nodeId
                  ? { ...node, data: { ...node.data, status } }
                  : node
              ),
            }),
            false,
            'setNodeStatus'
          ),

        // CRUD operations
        addNode: (node) =>
          set(
            (state) => ({
              nodes: [...state.nodes, node],
            }),
            false,
            'addNode'
          ),
        
        deleteNode: (nodeId) =>
          set(
            (state) => ({
              nodes: state.nodes.filter((node) => node.id !== nodeId),
              edges: state.edges.filter(
                (edge) => edge.source !== nodeId && edge.target !== nodeId
              ),
              selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
            }),
            false,
            'deleteNode'
          ),
        
        addChildNode: (parentId, label) => {
          const newNodeId = generateId();
          const parentNode = get().nodes.find((n) => n.id === parentId);
          
          if (!parentNode) return;

          const newNode: RoadmapNode = {
            id: newNodeId,
            type: 'concept',
            position: {
              x: parentNode.position.x + 200,
              y: parentNode.position.y + 100,
            },
            data: {
              label,
              description: '# 新节点\n\n请编辑此节点的内容...',
              status: 'pending',
              category: 'core',
              isExpanded: false,
              isCollapsed: false,
              parentId,
              childIds: [],
            },
          };

          const newEdge: RoadmapEdge = {
            id: `e-${parentId}-${newNodeId}`,
            source: parentId,
            target: newNodeId,
            data: { relationship: 'prerequisite' },
          };

          set(
            (state) => ({
              nodes: [
                ...state.nodes.map((n) =>
                  n.id === parentId
                    ? { ...n, data: { ...n.data, childIds: [...n.data.childIds, newNodeId] } }
                    : n
                ),
                newNode,
              ],
              edges: [...state.edges, newEdge],
            }),
            false,
            'addChildNode'
          );
        },

        // View operations
        setLayoutDirection: (direction) =>
          set({ layoutDirection: direction }, false, 'setLayoutDirection'),
        
        setSelectedNodeId: (nodeId) =>
          set({ selectedNodeId: nodeId }, false, 'setSelectedNodeId'),
        
        setEditMode: (isEditMode) =>
          set({ isEditMode }, false, 'setEditMode'),

        // Utility operations
        resetToMockData: () =>
          set(
            {
              nodes: mockRoadmapNodes,
              edges: mockRoadmapEdges,
              hiddenNodeIds: new Set(),
              selectedNodeId: null,
            },
            false,
            'resetToMockData'
          ),
        
        getVisibleNodes: () => {
          const state = get();
          return state.nodes.filter((node) => !state.hiddenNodeIds.has(node.id));
        },
        
        getVisibleEdges: () => {
          const state = get();
          return state.edges.filter(
            (edge) =>
              !state.hiddenNodeIds.has(edge.source) &&
              !state.hiddenNodeIds.has(edge.target)
          );
        },
      }),
      {
        name: 'roadmap-storage',
        // Custom serialization for Set
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const data = JSON.parse(str);
            return {
              ...data,
              state: {
                ...data.state,
                hiddenNodeIds: new Set(data.state.hiddenNodeIds || []),
              },
            };
          },
          setItem: (name, value) => {
            // Only persist data fields, not actions
            const stateToSave = {
              nodes: value.state.nodes,
              edges: value.state.edges,
              layoutDirection: value.state.layoutDirection,
              hiddenNodeIds: Array.from(value.state.hiddenNodeIds || []),
            };
            localStorage.setItem(name, JSON.stringify({ state: stateToSave, version: value.version }));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      }
    ),
    { name: 'RoadmapStore' }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useNodes = () => useRoadmapStore((state) => state.nodes);
export const useEdges = () => useRoadmapStore((state) => state.edges);
export const useLayoutDirection = () => useRoadmapStore((state) => state.layoutDirection);
export const useSelectedNodeId = () => useRoadmapStore((state) => state.selectedNodeId);
export const useIsEditMode = () => useRoadmapStore((state) => state.isEditMode);

/**
 * Get a specific node by ID
 */
export const useNode = (nodeId: string) =>
  useRoadmapStore((state) => state.nodes.find((n) => n.id === nodeId));

/**
 * Get visible nodes (filtered by collapse state)
 */
export const useVisibleNodes = () => {
  const nodes = useRoadmapStore((state) => state.nodes);
  const hiddenNodeIds = useRoadmapStore((state) => state.hiddenNodeIds);
  return nodes.filter((node) => !hiddenNodeIds.has(node.id));
};

/**
 * Get visible edges (filtered by collapse state)
 */
export const useVisibleEdges = () => {
  const edges = useRoadmapStore((state) => state.edges);
  const hiddenNodeIds = useRoadmapStore((state) => state.hiddenNodeIds);
  return edges.filter(
    (edge) => !hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target)
  );
};
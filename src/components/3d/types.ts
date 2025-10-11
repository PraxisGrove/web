/**
 * 3D 组件的类型定义
 * 这个文件包含所有 3D 组件的 TypeScript 类型定义
 */

import { KnowledgeNode, KnowledgeConnection } from '@/types/api';

// 增强的节点类型
export interface EnhancedNode extends KnowledgeNode {
  color: string;
  isSelected?: boolean;
  isHovered?: boolean;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
}

// 知识图谱组件属性
export interface KnowledgeGraphProps {
  nodes?: EnhancedNode[];
  connections?: KnowledgeConnection[];
  onNodeClick?: (node: EnhancedNode) => void;
  onNodeHover?: (node: EnhancedNode | null) => void;
  selectedNodeId?: string;
  showLabels?: boolean;
  showConnections?: boolean;
  enableInteraction?: boolean;
  cameraPosition?: [number, number, number];
}

// 导航控制组件属性
export interface NavigationControlsProps {
  onResetView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleFullscreen?: () => void;
  onToggleLabels?: () => void;
  onToggleConnections?: () => void;
  onViewPreset?: (preset: 'top' | 'front' | 'side' | 'isometric') => void;
  showLabels?: boolean;
  showConnections?: boolean;
  isFullscreen?: boolean;
  className?: string;
}

// 信息面板组件属性
export interface InfoPanelProps {
  nodes: KnowledgeNode[];
  connections: KnowledgeConnection[];
  selectedNode?: KnowledgeNode | null;
  onNodeSelect?: (nodeId: string) => void;
  onSearchNode?: (nodeId: string) => void;
  onHighlightPath?: (nodeIds: string[]) => void;
  className?: string;
}

// 节点编辑器组件属性
export interface NodeEditorProps {
  node?: KnowledgeNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: Partial<KnowledgeNode>) => void;
  onDelete?: (nodeId: string) => void;
  mode: 'create' | 'edit';
}

// 进度显示组件属性
export interface ProgressDisplayProps {
  nodes: KnowledgeNode[];
  className?: string;
}

// 知识宇宙组件属性
export interface KnowledgeUniverseProps {
  initialNodes?: KnowledgeNode[];
  initialConnections?: KnowledgeConnection[];
  onNodeUpdate?: (nodes: KnowledgeNode[]) => void;
  onConnectionUpdate?: (connections: KnowledgeConnection[]) => void;
  className?: string;
}

// 搜索结果类型
export interface SearchResult {
  node: KnowledgeNode;
  score: number;
  matchType: 'title' | 'description' | 'category';
}

// 进度统计类型
export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
  totalLearningTime: number;
  completedLearningTime: number;
  categoryStats: Record<string, {
    total: number;
    completed: number;
    completionRate: number;
  }>;
  levelStats: Record<string, {
    total: number;
    completed: number;
    completionRate: number;
  }>;
}

// 节点表单数据类型
export interface NodeFormData {
  title: string;
  description: string;
  type: 'concept' | 'skill' | 'topic' | 'course';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: number;
  importance: number;
  learningTime: number;
  position: { x: number; y: number; z: number };
  color: string;
}

// 视角预设类型
export type ViewPreset = 'top' | 'front' | 'side' | 'isometric';

// 连接线属性
export interface ConnectionLinesProps {
  nodes: EnhancedNode[];
  connections: KnowledgeConnection[];
  selectedNodeId?: string;
  highlightedPath?: string[];
}

// 知识节点组件属性
export interface KnowledgeNodeProps {
  node: EnhancedNode;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (node: EnhancedNode) => void;
  onHover?: (node: EnhancedNode | null) => void;
  showLabel?: boolean;
}

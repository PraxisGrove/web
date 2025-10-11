/**
 * 3D 组件的动态导入
 * 这个文件提供了所有 3D 组件的动态导入版本，避免 SSR 问题
 */

import dynamic from 'next/dynamic';

// 动态导入所有 3D 组件，禁用 SSR
export const DynamicKnowledgeGraph3D = dynamic(
  () => import('./knowledge-graph-simple').then(mod => ({ default: mod.KnowledgeGraph3D })),
  { ssr: false }
);

export const DynamicScene3D = dynamic(
  () => import('./scene').then(mod => ({ default: mod.Scene3D })),
  { ssr: false }
);

export const DynamicKnowledgeUniverse = dynamic(
  () => import('./knowledge-universe').then(mod => ({ default: mod.KnowledgeUniverse })),
  { ssr: false }
);

// 非 3D 组件可以正常导入（它们不依赖 React Three Fiber）
export const DynamicNavigationControls = dynamic(
  () => import('./navigation-controls').then(mod => ({ default: mod.NavigationControls })),
  { ssr: false }
);

export const DynamicInfoPanel = dynamic(
  () => import('./info-panel').then(mod => ({ default: mod.InfoPanel })),
  { ssr: false }
);

export const DynamicNodeEditor = dynamic(
  () => import('./node-editor').then(mod => ({ default: mod.NodeEditor })),
  { ssr: false }
);

export const DynamicProgressDisplay = dynamic(
  () => import('./progress-display').then(mod => ({ default: mod.ProgressDisplay })),
  { ssr: false }
);

// 类型导出（类型在编译时处理，不会导致 SSR 问题）
export type {
  KnowledgeGraphProps,
  NavigationControlsProps,
  InfoPanelProps,
  NodeEditorProps,
  ProgressDisplayProps,
  KnowledgeUniverseProps
} from './types';

// 便捷的组合导出
export const Dynamic3DComponents = {
  KnowledgeGraph3D: DynamicKnowledgeGraph3D,
  Scene3D: DynamicScene3D,
  KnowledgeUniverse: DynamicKnowledgeUniverse,
  NavigationControls: DynamicNavigationControls,
  InfoPanel: DynamicInfoPanel,
  NodeEditor: DynamicNodeEditor,
  ProgressDisplay: DynamicProgressDisplay,
};

// 默认导出主要的知识宇宙组件
export default DynamicKnowledgeUniverse;

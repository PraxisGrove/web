# 3D 组件使用指南

## 概述

本目录包含所有 3D 相关组件，基于 React Three Fiber 构建。为了避免服务端渲染 (SSR) 问题，我们提供了两种导入方式。

## SSR 问题说明

React Three Fiber 组件依赖浏览器 API，在服务端渲染时会出错。因此：

- ❌ **不要** 在统一组件导出中包含 3D 组件
- ❌ **不要** 在服务端渲染的页面中直接导入 3D 组件
- ✅ **推荐** 使用动态导入避免 SSR 问题

## 使用方式

### 方式 1: 动态导入 (推荐)

```typescript
import { DynamicKnowledgeUniverse } from '@/components/3d/dynamic';

// 或者
import { Dynamic3DComponents } from '@/components/3d/dynamic';
const { KnowledgeUniverse } = Dynamic3DComponents;

function MyPage() {
  return (
    <div>
      <DynamicKnowledgeUniverse 
        initialNodes={nodes}
        initialConnections={connections}
      />
    </div>
  );
}
```

### 方式 2: Next.js 动态导入

```typescript
import dynamic from 'next/dynamic';

const KnowledgeUniverse = dynamic(
  () => import('@/components/3d').then(mod => ({ default: mod.KnowledgeUniverse })),
  { 
    ssr: false,
    loading: () => <div>Loading 3D...</div>
  }
);
```

### 方式 3: 直接导入 (仅客户端)

```typescript
// 仅在确保客户端渲染时使用
import { KnowledgeUniverse } from '@/components/3d';
```

## 可用组件

### 主要组件

- **DynamicKnowledgeUniverse**: 完整的 3D 知识宇宙
- **DynamicKnowledgeGraph3D**: 3D 知识图谱
- **DynamicScene3D**: 基础 3D 场景

### 辅助组件

- **DynamicNavigationControls**: 导航控制面板
- **DynamicInfoPanel**: 信息展示面板
- **DynamicNodeEditor**: 节点编辑器
- **DynamicProgressDisplay**: 进度显示组件

## 类型定义

所有类型定义在 `types.ts` 中：

```typescript
import type { 
  KnowledgeGraphProps,
  KnowledgeUniverseProps,
  EnhancedNode 
} from '@/components/3d/types';
```

## 最佳实践

1. **总是使用动态导入**: 避免 SSR 问题
2. **提供加载状态**: 3D 组件加载需要时间
3. **错误边界**: 包装 3D 组件以处理潜在错误
4. **性能考虑**: 3D 组件资源消耗较大，按需加载

## 示例

### 完整的页面实现

```typescript
'use client';

import { useState } from 'react';
import { DynamicKnowledgeUniverse } from '@/components/3d/dynamic';
import type { KnowledgeNode, KnowledgeConnection } from '@/types/api';

export default function KnowledgeUniversePage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [connections, setConnections] = useState<KnowledgeConnection[]>([]);

  return (
    <div className="h-screen">
      <DynamicKnowledgeUniverse
        initialNodes={nodes}
        initialConnections={connections}
        onNodeUpdate={setNodes}
        onConnectionUpdate={setConnections}
      />
    </div>
  );
}
```

### 错误边界包装

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { DynamicKnowledgeUniverse } from '@/components/3d/dynamic';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2>3D 组件加载失败</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );
}

function MyComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DynamicKnowledgeUniverse />
    </ErrorBoundary>
  );
}
```

## 故障排除

### 常见问题

1. **SSR 错误**: 确保使用动态导入
2. **加载缓慢**: 正常现象，3D 组件需要加载时间
3. **类型错误**: 确保导入了正确的类型定义

### 调试技巧

1. 检查浏览器控制台的 WebGL 错误
2. 确认设备支持 WebGL
3. 检查网络连接（3D 资源较大）

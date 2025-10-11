'use client';

import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KnowledgeNode as KnowledgeNodeType, KnowledgeConnection } from '@/types/api';

// 类型定义
interface EnhancedNode extends KnowledgeNodeType {
  color: string;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
}

interface KnowledgeGraphProps {
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

// 默认数据
const defaultNodes: EnhancedNode[] = [
  {
    id: '1', title: 'AI基础', description: '人工智能基础', type: 'concept', category: 'AI', level: 'beginner',
    position: { x: 0, y: 0, z: 0 }, connections: [], 
    metadata: { difficulty: 0.3, importance: 0.9, prerequisites: [], learningTime: 120 },
    resources: { courses: [], articles: [], videos: [] }, color: '#ff6b6b', completionStatus: 'completed',
  },
  {
    id: '2', title: '机器学习', description: '机器学习算法', type: 'skill', category: 'AI', level: 'intermediate',
    position: { x: 2, y: 1, z: 0 }, connections: [],
    metadata: { difficulty: 0.6, importance: 0.8, prerequisites: ['1'], learningTime: 240 },
    resources: { courses: [], articles: [], videos: [] }, color: '#4ecdc4', completionStatus: 'in_progress',
  },
];

const defaultConnections: KnowledgeConnection[] = [
  { id: 'c1', fromNodeId: '1', toNodeId: '2', type: 'prerequisite', strength: 0.9 },
];

// 简单的 3D 知识图谱组件
export function KnowledgeGraph3D({
  nodes = defaultNodes,
  connections = defaultConnections,
  onNodeClick,
  onNodeHover,
  selectedNodeId,
  showLabels = true,
  showConnections = true,
  enableInteraction = true,
  cameraPosition = [5, 5, 5],
}: KnowledgeGraphProps) {
  const [isClient, setIsClient] = useState(false);
  const [threeFiberLoaded, setThreeFiberLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ThreeComponents, setThreeComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let mounted = true;

    async function loadThreeJS() {
      try {
        // 检查 WebGL 支持
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error('WebGL not supported');
        }

        // 动态加载 React Three Fiber
        const [fiberModule, dreiModule] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei')
        ]);

        if (mounted) {
          setThreeComponents({
            Canvas: fiberModule.Canvas,
            useFrame: fiberModule.useFrame,
            OrbitControls: dreiModule.OrbitControls,
            Sphere: dreiModule.Sphere,
            Text: dreiModule.Text,
          });
          setThreeFiberLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load Three.js:', err);
        if (mounted) {
          setError('3D 渲染不可用');
        }
      }
    }

    loadThreeJS();

    return () => {
      mounted = false;
    };
  }, [isClient]);

  // 服务端渲染或客户端初始化
  if (!isClient) {
    return <LoadingDisplay message="初始化中..." />;
  }

  // 加载错误
  if (error) {
    return <FallbackDisplay nodes={nodes} onNodeClick={onNodeClick} />;
  }

  // 加载中
  if (!threeFiberLoaded || !ThreeComponents) {
    return <LoadingDisplay message="加载 3D 引擎..." />;
  }

  // 渲染 3D 场景
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <ThreeComponents.Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {nodes.map((node) => (
          <SimpleNode3D
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={enableInteraction ? onNodeClick : undefined}
            showLabel={showLabels}
            components={ThreeComponents}
          />
        ))}

        <ThreeComponents.OrbitControls
          enabled={enableInteraction}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
      </ThreeComponents.Canvas>
    </div>
  );
}

// 简单的 3D 节点组件
function SimpleNode3D({ node, isSelected, onClick, showLabel, components }: any) {
  const meshRef = useRef<any>(null);
  const { useFrame, Sphere, Text } = components;

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      const scale = isSelected ? 1.3 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    onClick?.(node);
  }, [node, onClick]);

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <Sphere ref={meshRef} args={[0.3]} onClick={handleClick}>
        <meshStandardMaterial color={node.color} />
      </Sphere>
      {showLabel && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.title}
        </Text>
      )}
    </group>
  );
}

// 加载显示组件
function LoadingDisplay({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-white">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </motion.div>
        <h3 className="mb-2 text-xl font-semibold">{message}</h3>
        <p className="text-white/70">请稍候...</p>
      </motion.div>
    </div>
  );
}

// 回退显示组件
function FallbackDisplay({ nodes, onNodeClick }: any) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="flex h-full items-center justify-center">
        <div className="grid grid-cols-2 gap-4 p-8">
          {nodes.map((node: any) => (
            <motion.div
              key={node.id}
              className="cursor-pointer rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              onClick={() => onNodeClick?.(node)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: node.color }}
                />
                <h3 className="font-semibold">{node.title}</h3>
              </div>
              <p className="text-sm text-gray-300">{node.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/30 p-3 text-white backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
          <span className="text-sm">2D 模式</span>
        </div>
        <p className="text-xs text-gray-300">3D 渲染不可用</p>
      </div>
    </div>
  );
}

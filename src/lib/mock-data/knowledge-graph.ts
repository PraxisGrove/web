/**
 * 知识图谱 Mock 数据
 */

import { KnowledgeNode, KnowledgeConnection } from '@/types/api';

export const mockKnowledgeNodes: KnowledgeNode[] = [
  {
    id: '1',
    title: 'JavaScript 基础',
    description: 'JavaScript 编程语言基础知识',
    type: 'concept',
    category: 'frontend',
    level: 'beginner',
    position: { x: 0, y: 0, z: 0 },
    connections: [],
    metadata: {
      difficulty: 3,
      importance: 9,
      prerequisites: [],
      learningTime: 40,
    },
    resources: {
      articles: [],
      videos: [],
    },
  },
  {
    id: '2',
    title: 'React 框架',
    description: 'React 前端框架核心概念',
    type: 'skill',
    category: 'frontend',
    level: 'intermediate',
    position: { x: 2, y: 1, z: 0 },
    connections: [],
    metadata: {
      difficulty: 6,
      importance: 8,
      prerequisites: ['1'],
      learningTime: 60,
    },
    resources: {
      articles: [],
      videos: [],
    },
  },
  {
    id: '3',
    title: 'TypeScript',
    description: 'TypeScript 类型系统',
    type: 'skill',
    category: 'frontend',
    level: 'intermediate',
    position: { x: -2, y: 1, z: 0 },
    connections: [],
    metadata: {
      difficulty: 5,
      importance: 7,
      prerequisites: ['1'],
      learningTime: 30,
    },
    resources: {
      articles: [],
      videos: [],
    },
  },
  {
    id: '4',
    title: 'Node.js',
    description: 'Node.js 后端开发',
    type: 'skill',
    category: 'backend',
    level: 'intermediate',
    position: { x: 0, y: -2, z: 1 },
    connections: [],
    metadata: {
      difficulty: 6,
      importance: 8,
      prerequisites: ['1'],
      learningTime: 50,
    },
    resources: {
      articles: [],
      videos: [],
    },
  },
  {
    id: '5',
    title: 'Next.js',
    description: 'Next.js 全栈框架',
    type: 'skill',
    category: 'fullstack',
    level: 'advanced',
    position: { x: 1, y: 2, z: 1 },
    connections: [],
    metadata: {
      difficulty: 7,
      importance: 9,
      prerequisites: ['2', '3', '4'],
      learningTime: 40,
    },
    resources: {
      articles: [],
      videos: [],
    },
  },
];

export const mockKnowledgeConnections: KnowledgeConnection[] = [
  {
    id: 'c1',
    fromNodeId: '1',
    toNodeId: '2',
    type: 'prerequisite',
    strength: 0.9,
  },
  {
    id: 'c2',
    fromNodeId: '1',
    toNodeId: '3',
    type: 'related',
    strength: 0.8,
  },
  {
    id: 'c3',
    fromNodeId: '2',
    toNodeId: '5',
    type: 'prerequisite',
    strength: 0.95,
  },
  {
    id: 'c4',
    fromNodeId: '3',
    toNodeId: '5',
    type: 'related',
    strength: 0.85,
  },
  {
    id: 'c5',
    fromNodeId: '4',
    toNodeId: '5',
    type: 'prerequisite',
    strength: 0.9,
  },
];

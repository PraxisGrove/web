import type { RoadmapNode, RoadmapEdge, RoadmapNodeData } from './types';

/**
 * Helper to create node data with defaults
 */
const createNodeData = (
  partial: Partial<RoadmapNodeData> & Pick<RoadmapNodeData, 'label' | 'description' | 'status' | 'category'>
): RoadmapNodeData => ({
  isExpanded: false,
  isCollapsed: false,
  childIds: [],
  ...partial,
});

/**
 * Mock roadmap data simulating an AI-generated "Full-Stack Web Development" learning path
 */
export const mockRoadmapNodes: RoadmapNode[] = [
  // Root node
  {
    id: 'root',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'Full-Stack Web Development',
      description: `# 全栈 Web 开发学习路线

这是一条完整的全栈开发学习路线，涵盖从基础到高级的所有核心技能。

## 学习目标
- 掌握前端三大件：HTML、CSS、JavaScript
- 精通现代前端框架 React/Vue
- 掌握后端开发 Node.js/Python
- 理解数据库设计与优化
- 部署与运维基础

## 预计时长
**6-12 个月**（根据个人基础和学习时间而定）

> 💡 建议按照路线图顺序学习，每个模块完成后进行项目实践。`,
      status: 'in-progress',
      category: 'foundation',
      duration: 720,
      tags: ['全栈', 'Web开发', '学习路线'],
      childIds: ['frontend', 'backend', 'devops'],
    }),
  },

  // === Frontend Branch ===
  {
    id: 'frontend',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: '前端开发',
      description: `# 前端开发

前端开发是用户直接交互的部分，负责网页的**视觉呈现**和**交互逻辑**。

## 核心技能
1. HTML/CSS/JavaScript 基础
2. 现代框架（React/Vue/Angular）
3. 状态管理
4. 构建工具
5. 性能优化

## 就业方向
- 前端工程师
- UI 开发工程师
- 全栈工程师`,
      status: 'in-progress',
      category: 'core',
      duration: 240,
      tags: ['前端', 'UI', '交互'],
      parentId: 'root',
      childIds: ['html-css', 'javascript', 'react', 'state-management'],
    }),
  },
  {
    id: 'html-css',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'HTML & CSS',
      description: `# HTML & CSS 基础

网页开发的基石，HTML 定义结构，CSS 定义样式。

## HTML 要点
- 语义化标签
- 表单与验证
- 无障碍访问 (a11y)

## CSS 要点
- 盒模型
- Flexbox & Grid
- 响应式设计
- CSS 变量

\`\`\`css
/* 示例：现代 CSS 变量使用 */
:root {
  --primary: #3b82f6;
  --spacing: 1rem;
}

.card {
  padding: var(--spacing);
  background: var(--primary);
}
\`\`\``,
      status: 'completed',
      category: 'foundation',
      duration: 40,
      tags: ['HTML', 'CSS', '布局'],
      parentId: 'frontend',
      childIds: [],
      resources: [
        { title: 'MDN HTML 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/HTML', type: 'documentation' },
        { title: 'CSS Tricks', url: 'https://css-tricks.com', type: 'article' },
      ],
    }),
  },
  {
    id: 'javascript',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'JavaScript',
      description: `# JavaScript 核心

前端开发的灵魂语言，也是全栈开发的基础。

## 核心概念
- 变量与作用域
- 闭包与原型链
- 异步编程 (Promise/async-await)
- ES6+ 新特性
- DOM 操作

## 进阶主题
- 模块化 (ESM/CommonJS)
- 函数式编程
- 面向对象编程

\`\`\`javascript
// 示例：async/await 用法
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户数据失败:', error);
  }
}
\`\`\``,
      status: 'completed',
      category: 'foundation',
      duration: 60,
      tags: ['JavaScript', 'ES6', '编程语言'],
      parentId: 'frontend',
      childIds: ['typescript'],
      resources: [
        { title: 'JavaScript.info', url: 'https://javascript.info', type: 'documentation' },
        { title: 'You Don\'t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'article' },
      ],
    }),
  },
  {
    id: 'typescript',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'TypeScript',
      description: `# TypeScript

JavaScript 的超集，添加了静态类型检查。

## 为什么学 TypeScript？
- 🔍 更好的开发体验（智能提示）
- 🐛 编译时错误检查
- 📖 代码即文档
- 🔧 更好的重构支持

## 核心特性
- 类型注解
- 接口 (Interface)
- 泛型 (Generics)
- 类型推断
- 枚举与联合类型

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\``,
      status: 'in-progress',
      category: 'core',
      duration: 30,
      tags: ['TypeScript', '类型系统', '静态类型'],
      parentId: 'javascript',
      childIds: [],
    }),
  },
  {
    id: 'react',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'React',
      description: `# React 框架

由 Meta 开发的声明式 UI 库，是目前最流行的前端框架之一。

## 核心概念
- 组件化思想
- JSX 语法
- Props & State
- Hooks (useState, useEffect, useMemo...)
- 生命周期

## 生态系统
- React Router (路由)
- Redux/Zustand (状态管理)
- React Query (数据获取)
- Next.js (全栈框架)

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      点击次数: {count}
    </button>
  );
}
\`\`\``,
      status: 'in-progress',
      category: 'core',
      duration: 80,
      tags: ['React', '框架', '组件化'],
      parentId: 'frontend',
      childIds: ['react-hooks', 'react-patterns'],
      resources: [
        { title: 'React 官方文档', url: 'https://react.dev', type: 'documentation' },
        { title: 'React 入门视频', url: 'https://www.youtube.com/watch?v=example', type: 'video' },
      ],
    }),
  },
  {
    id: 'react-hooks',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'React Hooks',
      description: `# React Hooks 深入

Hooks 让函数组件拥有状态和副作用处理能力。

## 常用 Hooks
| Hook | 用途 |
|------|------|
| useState | 状态管理 |
| useEffect | 副作用处理 |
| useContext | 上下文消费 |
| useRef | DOM 引用/持久值 |
| useMemo | 计算缓存 |
| useCallback | 函数缓存 |

## 自定义 Hook
\`\`\`tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
\`\`\``,
      status: 'pending',
      category: 'advanced',
      duration: 20,
      tags: ['React', 'Hooks', '函数组件'],
      parentId: 'react',
      childIds: [],
    }),
  },
  {
    id: 'react-patterns',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'React 设计模式',
      description: `# React 设计模式

编写可维护、可复用 React 代码的最佳实践。

## 常见模式
1. **容器/展示组件** - 分离逻辑与 UI
2. **Compound Components** - 组件组合
3. **Render Props** - 渲染逻辑复用
4. **HOC (高阶组件)** - 组件增强
5. **自定义 Hooks** - 逻辑复用

## 示例：Compound Components
\`\`\`tsx
<Select value={selected} onChange={setSelected}>
  <Select.Trigger>选择选项</Select.Trigger>
  <Select.Options>
    <Select.Option value="a">选项 A</Select.Option>
    <Select.Option value="b">选项 B</Select.Option>
  </Select.Options>
</Select>
\`\`\``,
      status: 'locked',
      category: 'advanced',
      duration: 25,
      tags: ['React', '设计模式', '架构'],
      parentId: 'react',
      childIds: [],
    }),
  },
  {
    id: 'state-management',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: '状态管理',
      description: `# 前端状态管理

管理应用中共享状态的策略和工具。

## 状态类型
- **本地状态** - 组件内 useState
- **共享状态** - Context/Redux/Zustand
- **服务器状态** - React Query/SWR
- **URL 状态** - 路由参数
- **表单状态** - React Hook Form

## 方案对比
| 方案 | 复杂度 | 场景 |
|------|--------|------|
| Context | 低 | 简单共享 |
| Zustand | 中 | 中型应用 |
| Redux | 高 | 大型应用 |
| Jotai | 低 | 原子化状态 |`,
      status: 'pending',
      category: 'advanced',
      duration: 30,
      tags: ['状态管理', 'Redux', 'Zustand'],
      parentId: 'frontend',
      childIds: [],
    }),
  },

  // === Backend Branch ===
  {
    id: 'backend',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: '后端开发',
      description: `# 后端开发

处理业务逻辑、数据存储和 API 接口的服务器端开发。

## 核心技能
1. 编程语言 (Node.js/Python/Go)
2. API 设计 (REST/GraphQL)
3. 数据库 (SQL/NoSQL)
4. 认证与授权
5. 安全最佳实践

## 就业方向
- 后端工程师
- API 开发工程师
- 全栈工程师`,
      status: 'pending',
      category: 'core',
      duration: 200,
      tags: ['后端', 'API', '服务器'],
      parentId: 'root',
      childIds: ['nodejs', 'database', 'api-design'],
    }),
  },
  {
    id: 'nodejs',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'Node.js',
      description: `# Node.js

基于 Chrome V8 引擎的 JavaScript 运行时，让 JS 可以运行在服务器端。

## 核心模块
- fs (文件系统)
- http (HTTP 服务)
- path (路径处理)
- events (事件发射器)
- stream (流处理)

## 常用框架
- **Express** - 最流行的 Web 框架
- **Koa** - 更现代的中间件架构
- **NestJS** - 企业级 TypeScript 框架
- **Fastify** - 高性能框架

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000);
\`\`\``,
      status: 'pending',
      category: 'core',
      duration: 50,
      tags: ['Node.js', 'JavaScript', '服务器'],
      parentId: 'backend',
      childIds: [],
    }),
  },
  {
    id: 'database',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: '数据库',
      description: `# 数据库设计与操作

数据持久化存储的核心知识。

## SQL vs NoSQL
| 特性 | SQL | NoSQL |
|------|-----|-------|
| 结构 | 固定 Schema | 灵活 Schema |
| 扩展 | 垂直扩展 | 水平扩展 |
| 事务 | ACID | BASE |
| 代表 | PostgreSQL, MySQL | MongoDB, Redis |

## 学习重点
1. SQL 基础语法
2. 表设计与范式
3. 索引优化
4. 事务与锁
5. ORM 使用 (Prisma/TypeORM)`,
      status: 'locked',
      category: 'core',
      duration: 60,
      tags: ['数据库', 'SQL', 'NoSQL'],
      parentId: 'backend',
      childIds: ['sql-basics', 'mongodb'],
    }),
  },
  {
    id: 'sql-basics',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'SQL 基础',
      description: `# SQL 基础

结构化查询语言，关系型数据库的标准语言。

## 核心语句
\`\`\`sql
-- 查询
SELECT name, email FROM users WHERE age > 18;

-- 插入
INSERT INTO users (name, email) VALUES ('张三', 'zhang@example.com');

-- 更新
UPDATE users SET name = '李四' WHERE id = 1;

-- 删除
DELETE FROM users WHERE id = 1;

-- 联表查询
SELECT u.name, o.total 
FROM users u 
JOIN orders o ON u.id = o.user_id;
\`\`\`

## 进阶主题
- 子查询
- 窗口函数
- 存储过程
- 触发器`,
      status: 'locked',
      category: 'foundation',
      duration: 25,
      tags: ['SQL', '数据库', '查询'],
      parentId: 'database',
      childIds: [],
    }),
  },
  {
    id: 'mongodb',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'MongoDB',
      description: `# MongoDB

流行的文档型 NoSQL 数据库。

## 特点
- 📄 文档模型 (JSON-like)
- 🔄 灵活 Schema
- 📈 水平可扩展
- 🔍 强大的查询能力

## 基本操作
\`\`\`javascript
// 插入文档
db.users.insertOne({
  name: "张三",
  email: "zhang@example.com",
  skills: ["JavaScript", "Python"]
});

// 查询文档
db.users.find({ "skills": "JavaScript" });

// 聚合查询
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } }
]);
\`\`\``,
      status: 'locked',
      category: 'core',
      duration: 30,
      tags: ['MongoDB', 'NoSQL', '数据库'],
      parentId: 'database',
      childIds: [],
    }),
  },
  {
    id: 'api-design',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'API 设计',
      description: `# RESTful API 设计

设计清晰、一致、易用的 API 接口。

## REST 原则
1. **资源导向** - URL 表示资源
2. **HTTP 动词** - GET/POST/PUT/DELETE
3. **无状态** - 每次请求独立
4. **统一接口** - 一致的响应格式

## 最佳实践
\`\`\`
GET    /api/users          # 获取用户列表
GET    /api/users/:id      # 获取单个用户
POST   /api/users          # 创建用户
PUT    /api/users/:id      # 更新用户
DELETE /api/users/:id      # 删除用户

# 响应格式
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
\`\`\``,
      status: 'locked',
      category: 'advanced',
      duration: 20,
      tags: ['API', 'REST', '架构'],
      parentId: 'backend',
      childIds: [],
    }),
  },

  // === DevOps Branch ===
  {
    id: 'devops',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'DevOps & 部署',
      description: `# DevOps & 部署

开发运维一体化，让代码从开发到生产更高效。

## 核心概念
1. **CI/CD** - 持续集成/持续部署
2. **容器化** - Docker
3. **云服务** - AWS/GCP/Azure
4. **监控告警** - 日志、指标、追踪

## 学习路径
1. Git 进阶
2. Linux 基础
3. Docker 容器
4. CI/CD 流水线
5. 云平台部署`,
      status: 'locked',
      category: 'advanced',
      duration: 120,
      tags: ['DevOps', '部署', '运维'],
      parentId: 'root',
      childIds: ['git', 'docker', 'ci-cd'],
    }),
  },
  {
    id: 'git',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'Git 版本控制',
      description: `# Git 版本控制

分布式版本控制系统，团队协作必备技能。

## 核心概念
- 工作区 → 暂存区 → 仓库
- 分支 (Branch)
- 合并 (Merge/Rebase)
- 远程仓库 (Remote)

## 常用命令
\`\`\`bash
# 基础操作
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 分支操作
git checkout -b feature/new-feature
git merge feature/new-feature

# 回退操作
git reset --soft HEAD^
git revert <commit-hash>
\`\`\`

## Git Flow
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复分支`,
      status: 'completed',
      category: 'foundation',
      duration: 15,
      tags: ['Git', '版本控制', '协作'],
      parentId: 'devops',
      childIds: [],
    }),
  },
  {
    id: 'docker',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'Docker',
      description: `# Docker 容器化

将应用及其依赖打包到容器中，实现"一次构建，到处运行"。

## 核心概念
- **镜像 (Image)** - 只读模板
- **容器 (Container)** - 镜像的运行实例
- **Dockerfile** - 构建镜像的脚本
- **Docker Compose** - 多容器编排

## Dockerfile 示例
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 常用命令
\`\`\`bash
docker build -t myapp .
docker run -p 3000:3000 myapp
docker-compose up -d
\`\`\``,
      status: 'locked',
      category: 'core',
      duration: 30,
      tags: ['Docker', '容器', '部署'],
      parentId: 'devops',
      childIds: [],
    }),
  },
  {
    id: 'ci-cd',
    type: 'concept',
    position: { x: 0, y: 0 },
    data: createNodeData({
      label: 'CI/CD 流水线',
      description: `# CI/CD 持续集成/持续部署

自动化构建、测试和部署流程。

## CI (持续集成)
- 代码提交触发自动构建
- 运行单元测试/集成测试
- 代码质量检查 (Lint)
- 安全扫描

## CD (持续部署)
- 自动部署到测试环境
- 自动/手动部署到生产环境
- 回滚机制

## GitHub Actions 示例
\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\``,
      status: 'locked',
      category: 'advanced',
      duration: 25,
      tags: ['CI/CD', '自动化', 'DevOps'],
      parentId: 'devops',
      childIds: [],
    }),
  },
];

/**
 * Mock roadmap edges defining relationships between nodes
 */
export const mockRoadmapEdges: RoadmapEdge[] = [
  // Root to main branches
  { id: 'e-root-frontend', source: 'root', target: 'frontend', data: { relationship: 'prerequisite' } },
  { id: 'e-root-backend', source: 'root', target: 'backend', data: { relationship: 'prerequisite' } },
  { id: 'e-root-devops', source: 'root', target: 'devops', data: { relationship: 'prerequisite' } },

  // Frontend branch
  { id: 'e-frontend-html', source: 'frontend', target: 'html-css', data: { relationship: 'prerequisite' } },
  { id: 'e-frontend-js', source: 'frontend', target: 'javascript', data: { relationship: 'prerequisite' } },
  { id: 'e-frontend-react', source: 'frontend', target: 'react', data: { relationship: 'prerequisite' } },
  { id: 'e-frontend-state', source: 'frontend', target: 'state-management', data: { relationship: 'prerequisite' } },
  { id: 'e-js-ts', source: 'javascript', target: 'typescript', data: { relationship: 'prerequisite' } },
  { id: 'e-html-js', source: 'html-css', target: 'javascript', data: { relationship: 'prerequisite' } },
  { id: 'e-js-react', source: 'javascript', target: 'react', data: { relationship: 'prerequisite' } },
  { id: 'e-react-hooks', source: 'react', target: 'react-hooks', data: { relationship: 'prerequisite' } },
  { id: 'e-react-patterns', source: 'react', target: 'react-patterns', data: { relationship: 'prerequisite' } },
  { id: 'e-hooks-patterns', source: 'react-hooks', target: 'react-patterns', data: { relationship: 'related' } },
  { id: 'e-react-state', source: 'react', target: 'state-management', data: { relationship: 'related' } },
  { id: 'e-ts-react', source: 'typescript', target: 'react', data: { relationship: 'related' } },

  // Backend branch
  { id: 'e-backend-node', source: 'backend', target: 'nodejs', data: { relationship: 'prerequisite' } },
  { id: 'e-backend-db', source: 'backend', target: 'database', data: { relationship: 'prerequisite' } },
  { id: 'e-backend-api', source: 'backend', target: 'api-design', data: { relationship: 'prerequisite' } },
  { id: 'e-db-sql', source: 'database', target: 'sql-basics', data: { relationship: 'prerequisite' } },
  { id: 'e-db-mongo', source: 'database', target: 'mongodb', data: { relationship: 'prerequisite' } },
  { id: 'e-node-api', source: 'nodejs', target: 'api-design', data: { relationship: 'related' } },

  // DevOps branch
  { id: 'e-devops-git', source: 'devops', target: 'git', data: { relationship: 'prerequisite' } },
  { id: 'e-devops-docker', source: 'devops', target: 'docker', data: { relationship: 'prerequisite' } },
  { id: 'e-devops-cicd', source: 'devops', target: 'ci-cd', data: { relationship: 'prerequisite' } },
  { id: 'e-git-cicd', source: 'git', target: 'ci-cd', data: { relationship: 'prerequisite' } },
  { id: 'e-docker-cicd', source: 'docker', target: 'ci-cd', data: { relationship: 'related' } },

  // Cross-branch relations
  { id: 'e-js-node', source: 'javascript', target: 'nodejs', data: { relationship: 'related' } },
  { id: 'e-node-docker', source: 'nodejs', target: 'docker', data: { relationship: 'optional' } },
  { id: 'e-api-react', source: 'api-design', target: 'react', data: { relationship: 'optional' } },
];

/**
 * Get child node IDs for a given node
 */
export function getChildNodeIds(nodeId: string, edges: RoadmapEdge[]): string[] {
  return edges
    .filter((edge) => edge.source === nodeId && edge.data?.relationship === 'prerequisite')
    .map((edge) => edge.target);
}

/**
 * Get all descendant node IDs recursively
 */
export function getAllDescendantIds(nodeId: string, edges: RoadmapEdge[]): string[] {
  const descendants: string[] = [];
  const queue = [nodeId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = getChildNodeIds(currentId, edges);
    descendants.push(...children);
    queue.push(...children);
  }

  return descendants;
}
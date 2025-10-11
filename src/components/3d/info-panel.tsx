'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/unified';
import { KnowledgeNode, KnowledgeConnection } from '@/types/api';

interface InfoPanelProps {
  nodes: KnowledgeNode[];
  connections: KnowledgeConnection[];
  selectedNode?: KnowledgeNode | null;
  onNodeSelect?: (nodeId: string) => void;
  onSearchNode?: (nodeId: string) => void;
  onHighlightPath?: (nodeIds: string[]) => void;
  className?: string;
}

interface SearchResult {
  node: KnowledgeNode;
  score: number;
  matchType: 'title' | 'description' | 'category';
}

export function InfoPanel({
  nodes,
  connections,
  selectedNode,
  onNodeSelect,
  onSearchNode,
  onHighlightPath,
  className = '',
}: InfoPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'connections' | 'path'>('info');

  // 搜索功能
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    nodes.forEach(node => {
      let score = 0;
      let matchType: SearchResult['matchType'] = 'title';

      // 标题匹配
      if (node.title.toLowerCase().includes(query)) {
        score += 10;
        matchType = 'title';
      }

      // 描述匹配
      if (node.description.toLowerCase().includes(query)) {
        score += 5;
        matchType = 'description';
      }

      // 分类匹配
      if (node.category.toLowerCase().includes(query)) {
        score += 3;
        matchType = 'category';
      }

      if (score > 0) {
        results.push({ node, score, matchType });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [searchQuery, nodes]);

  // 获取选中节点的连接
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return { incoming: [], outgoing: [] };

    const incoming = connections.filter(conn => conn.toNodeId === selectedNode.id);
    const outgoing = connections.filter(conn => conn.fromNodeId === selectedNode.id);

    return { incoming, outgoing };
  }, [selectedNode, connections]);

  // 获取学习路径
  const learningPath = useMemo(() => {
    if (!selectedNode) return [];

    const visited = new Set<string>();
    const path: KnowledgeNode[] = [];

    function buildPath(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      // 添加前置条件
      node.metadata.prerequisites.forEach(prereqId => {
        buildPath(prereqId);
      });

      path.push(node);
    }

    buildPath(selectedNode.id);
    return path;
  }, [selectedNode, nodes]);

  const handleSearchSelect = (node: KnowledgeNode) => {
    onNodeSelect?.(node.id);
    onSearchNode?.(node.id);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleHighlightPath = () => {
    if (learningPath.length > 0) {
      onHighlightPath?.(learningPath.map(node => node.id));
    }
  };

  const getCompletionColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'not_started': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'prerequisite': return 'text-red-400';
      case 'builds_on': return 'text-blue-400';
      case 'related': return 'text-green-400';
      case 'similar': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`absolute left-4 top-4 z-10 w-80 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-white/10 bg-black/30 text-white backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">知识图谱</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>

          {/* 搜索框 */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Input
                  placeholder="搜索知识节点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                {/* 搜索结果 */}
                {searchResults.length > 0 && (
                  <motion.div
                    className="absolute top-full mt-1 w-full rounded-lg border border-white/10 bg-black/80 backdrop-blur-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {searchResults.map((result) => (
                      <motion.button
                        key={result.node.id}
                        className="w-full p-2 text-left hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => handleSearchSelect(result.node)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium">{result.node.title}</div>
                        <div className="text-xs text-gray-400 truncate">
                          {result.node.description}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {result.matchType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.node.category}
                          </Badge>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedNode ? (
            <>
              {/* 标签页 */}
              <div className="flex space-x-1 rounded-lg bg-white/10 p-1">
                {[
                  { key: 'info', label: '信息' },
                  { key: 'connections', label: '连接' },
                  { key: 'path', label: '路径' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex-1 rounded-md px-3 py-1 text-xs transition-all ${
                      activeTab === tab.key
                        ? 'bg-blue-500/50 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                    onClick={() => setActiveTab(tab.key as any)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 内容区域 */}
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{selectedNode.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{selectedNode.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCompletionColor(selectedNode.userProgress?.isLearned ? 'completed' : 'not_started')}>
                        {selectedNode.userProgress?.isLearned ? '已完成' : '未开始'}
                      </Badge>
                      <Badge variant="secondary">{selectedNode.type}</Badge>
                      <Badge variant="secondary">{selectedNode.level}</Badge>
                      <Badge variant="secondary">{selectedNode.category}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">难度:</span>
                        <span>{Math.round(selectedNode.metadata.difficulty * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">重要性:</span>
                        <span>{Math.round(selectedNode.metadata.importance * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">学习时长:</span>
                        <span>{selectedNode.metadata.learningTime}分钟</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'connections' && (
                  <motion.div
                    key="connections"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {nodeConnections.incoming.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">前置条件</h4>
                        <div className="space-y-1">
                          {nodeConnections.incoming.map((conn) => {
                            const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                            return fromNode ? (
                              <div
                                key={conn.id}
                                className="flex items-center justify-between p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10"
                                onClick={() => onNodeSelect?.(fromNode.id)}
                              >
                                <span className="text-sm">{fromNode.title}</span>
                                <span className={`text-xs ${getConnectionTypeColor(conn.type)}`}>
                                  {conn.type}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {nodeConnections.outgoing.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">后续内容</h4>
                        <div className="space-y-1">
                          {nodeConnections.outgoing.map((conn) => {
                            const toNode = nodes.find(n => n.id === conn.toNodeId);
                            return toNode ? (
                              <div
                                key={conn.id}
                                className="flex items-center justify-between p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10"
                                onClick={() => onNodeSelect?.(toNode.id)}
                              >
                                <span className="text-sm">{toNode.title}</span>
                                <span className={`text-xs ${getConnectionTypeColor(conn.type)}`}>
                                  {conn.type}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'path' && (
                  <motion.div
                    key="path"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">学习路径</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleHighlightPath}
                        className="h-6 px-2 text-xs text-blue-400 hover:bg-blue-500/20"
                      >
                        高亮路径
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {learningPath.map((node, index) => (
                        <motion.div
                          key={node.id}
                          className="flex items-center space-x-2 p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10"
                          onClick={() => onNodeSelect?.(node.id)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/30 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{node.title}</div>
                            <div className="text-xs text-gray-400">{node.metadata.learningTime}分钟</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <svg className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">点击节点查看详细信息</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

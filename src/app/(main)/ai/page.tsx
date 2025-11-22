'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  Textarea,
  EnhancedCard,
  Progress,
  PageLayout,
} from '@/components/unified';
import { Aurora } from '@/components/reactbit';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  FileText,
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  BookOpen,
  Code,
  Palette,
  Video,
  Sparkles,
  MessageSquare,
  Clock,
  Star,
} from 'lucide-react';
import { WalletGuard } from '@/components/auth/WalletGuard';

// AI 助手消息类型
interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// AI 工具类型
interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  usage: number;
  rating: number;
  color: string;
}

// AI 推荐内容类型
interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'article' | 'video' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  relevanceScore: number;
  tags: string[];
}

/**
 * AI 助手页面
 */
export default function AIPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI 工具列表
  const aiTools: AITool[] = [
    {
      id: '1',
      name: '代码助手',
      description: '智能代码生成、调试和优化',
      icon: <Code className="h-6 w-6" />,
      category: '编程',
      usage: 1234,
      rating: 4.8,
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: '学习规划师',
      description: '个性化学习路径规划',
      icon: <Target className="h-6 w-6" />,
      category: '学习',
      usage: 987,
      rating: 4.9,
      color: 'bg-green-500',
    },
    {
      id: '3',
      name: '创意生成器',
      description: '项目创意和灵感生成',
      icon: <Lightbulb className="h-6 w-6" />,
      category: '创意',
      usage: 756,
      rating: 4.7,
      color: 'bg-yellow-500',
    },
    {
      id: '4',
      name: '文档助手',
      description: '智能文档生成和编辑',
      icon: <FileText className="h-6 w-6" />,
      category: '写作',
      usage: 654,
      rating: 4.6,
      color: 'bg-purple-500',
    },
    {
      id: '5',
      name: '设计助手',
      description: 'UI/UX 设计建议和生成',
      icon: <Palette className="h-6 w-6" />,
      category: '设计',
      usage: 543,
      rating: 4.5,
      color: 'bg-pink-500',
    },
    {
      id: '6',
      name: '数据分析师',
      description: '数据可视化和分析',
      icon: <TrendingUp className="h-6 w-6" />,
      category: '数据',
      usage: 432,
      rating: 4.4,
      color: 'bg-indigo-500',
    },
  ];

  // AI 推荐内容
  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      title: 'React 18 并发特性深度解析',
      description:
        '学习 React 18 的最新并发特性，包括 Suspense、useTransition 等',
      type: 'course',
      difficulty: 'intermediate',
      estimatedTime: '2小时',
      relevanceScore: 95,
      tags: ['React', 'JavaScript', '前端'],
    },
    {
      id: '2',
      title: '机器学习入门实战项目',
      description: '通过实际项目学习机器学习基础概念和应用',
      type: 'project',
      difficulty: 'beginner',
      estimatedTime: '4小时',
      relevanceScore: 88,
      tags: ['机器学习', 'Python', 'AI'],
    },
    {
      id: '3',
      title: 'Three.js 3D 可视化教程',
      description: '创建令人惊叹的 3D 网页体验',
      type: 'video',
      difficulty: 'advanced',
      estimatedTime: '3小时',
      relevanceScore: 82,
      tags: ['Three.js', '3D', 'WebGL'],
    },
  ];

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
      // 添加欢迎消息
      setMessages([
        {
          id: '1',
          type: 'ai',
          content:
            '你好！我是 PraxisGrove 的 AI 助手。我可以帮助你学习编程、规划学习路径、解答问题，还能协助你完成各种创意项目。有什么我可以帮助你的吗？',
          timestamp: new Date(),
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟 AI 回复
    setTimeout(() => {
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `我理解你的问题："${inputMessage}"。这是一个很好的问题！让我为你提供一些建议和解决方案...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 切换录音状态
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'project':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-background relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={['#6366f1', '#ef4444', '#FFE600']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="container relative z-10 mx-auto space-y-8 px-4 py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#6366f1', '#ef4444', '#FFE600']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main className="relative z-10">
        <WalletGuard>
          <PageLayout
            title="AI 智能助手"
            subtitle="让 AI 成为你学习和创作的最佳伙伴"
            backgroundClass=""
          >
            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* 主要内容区域 */}
            <div className="lg:col-span-2">
              <EnhancedCard variant="glow" className="h-[600px] p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex h-full flex-col"
                >
                  <TabsList className="grid w-full grid-cols-3 border border-white/20 bg-white/10 dark:bg-white/5">
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      AI 对话
                    </TabsTrigger>
                    <TabsTrigger
                      value="tools"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      AI 工具
                    </TabsTrigger>
                    <TabsTrigger
                      value="recommendations"
                      className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      智能推荐
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="chat"
                    className="mt-6 flex flex-1 flex-col"
                  >
                    {/* 聊天消息区域 */}
                    <div className="mb-4 flex-1 space-y-4 overflow-y-auto pr-2">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex max-w-[80%] items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              {message.type === 'ai' ? (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                  <Bot className="h-4 w-4" />
                                </div>
                              ) : (
                                <AvatarFallback>U</AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="mt-1 text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString('zh-CN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                <Bot className="h-4 w-4" />
                              </div>
                            </Avatar>
                            <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                  style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                  style={{ animationDelay: '0.2s' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* 输入区域 */}
                    <div className="border-t pt-4">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Textarea
                            placeholder="输入你的问题或需求..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="min-h-[60px] resize-none"
                            rows={2}
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            onClick={toggleRecording}
                            variant={isRecording ? 'destructive' : 'outline'}
                            size="sm"
                            className="h-10 w-10 p-0"
                          >
                            {isRecording ? (
                              <MicOff className="h-4 w-4" />
                            ) : (
                              <Mic className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="h-10 w-10 p-0"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tools" className="mt-6 flex-1">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {aiTools.map((tool) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                        >
                          <Card className="h-full transition-shadow hover:shadow-lg">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`rounded-lg p-2 text-white ${tool.color}`}
                                >
                                  {tool.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{tool.name}</h4>
                                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    {tool.description}
                                  </p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tool.category}
                                      </Badge>
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        <span>{tool.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {tool.usage} 次使用
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-6 flex-1">
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="transition-shadow hover:shadow-lg">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="mb-2 flex items-center space-x-2">
                                    {getTypeIcon(rec.type)}
                                    <h4 className="font-semibold">
                                      {rec.title}
                                    </h4>
                                    <Badge
                                      className={`text-xs ${getDifficultyColor(rec.difficulty)}`}
                                    >
                                      {rec.difficulty === 'beginner'
                                        ? '初级'
                                        : rec.difficulty === 'intermediate'
                                          ? '中级'
                                          : '高级'}
                                    </Badge>
                                  </div>
                                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                                    {rec.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{rec.estimatedTime}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Target className="h-3 w-3" />
                                      <span>{rec.relevanceScore}% 匹配</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {rec.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="mb-2 text-right">
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                      {rec.relevanceScore}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      相关度
                                    </div>
                                  </div>
                                  <Progress
                                    value={rec.relevanceScore}
                                    className="h-2 w-16"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </EnhancedCard>
            </div>

            {/* 右侧边栏 */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* AI 状态 */}
                <EnhancedCard variant="glow" className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">AI 助手状态</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">在线状态</span>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">
                        在线
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">响应时间</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ~2秒
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">今日对话</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        15 次
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">满意度</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm">4.9</span>
                      </div>
                    </div>
                  </div>
                </EnhancedCard>

                {/* 快速操作 */}
                <EnhancedCard variant="glow" className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">快速操作</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Code className="mr-2 h-4 w-4" />
                      代码审查
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      创意生成
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Target className="mr-2 h-4 w-4" />
                      学习规划
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      文档生成
                    </Button>
                  </div>
                </EnhancedCard>

                {/* 使用统计 */}
                <EnhancedCard variant="glow" className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">使用统计</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>代码助手</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>学习规划</span>
                        <span>72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>创意生成</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>文档助手</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                  </EnhancedCard>
                </div>
              </div>
            </div>
          </PageLayout>
        </WalletGuard>
      </main>
    </div>
  );
}

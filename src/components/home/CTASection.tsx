'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟提交过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: 添加实际的提交逻辑

    setIsSubmitting(false);
    setEmail('');
    setName('');
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden py-12',
        // 移除深色实体背景，使用透明背景以不遮挡粒子效果
        'bg-transparent',
        className
      )}
    >
      {/* 完全透明背景，让粒子效果完全展示 */}

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              开启您的
              <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                智慧学习{' '}
              </span>
              之旅
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              加入 50,000+ 学习者的行列，体验 AI 驱动的个性化教育平台
            </p>
          </motion.div>

          {/* 主要 CTA 区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {/* 左侧：快速注册表单 */}
            <Card className="bg-card/40 border-none backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <Sparkles className="text-primary mx-auto mb-4 h-12 w-12" />
                  <h3 className="text-card-foreground mb-2 text-2xl font-bold">
                    免费开始学习
                  </h3>
                  <p className="text-muted-foreground">
                    立即注册，获得 7 天免费试用
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-foreground mb-2 block"
                    >
                      姓名
                    </Label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="请输入您的姓名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-foreground mb-2 block"
                    >
                      邮箱地址
                    </Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入您的邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full py-3 text-lg font-semibold',
                      'bg-gradient-to-r from-purple-500 to-pink-500',
                      'hover:from-purple-600 hover:to-pink-600',
                      'transform transition-all duration-200 hover:scale-105',
                      'disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        注册中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        免费开始学习
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                  注册即表示您同意我们的服务条款和隐私政策
                </p>
              </CardContent>
            </Card>

            {/* 右侧：其他 CTA 选项 */}
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full py-6 text-lg font-semibold',
                    'bg-card/30 backdrop-blur-sm'
                  )}
                >
                  <div className="flex items-center justify-center">
                    探索 3D 知识宇宙
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full py-6 text-lg font-semibold',
                    'bg-card/30 backdrop-blur-sm'
                  )}
                >
                  <div className="flex items-center justify-center">
                    观看产品演示
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    'w-full py-6 text-lg font-semibold',
                    'bg-card/30 backdrop-blur-sm'
                  )}
                >
                  <div className="flex items-center justify-center">
                    联系销售团队
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Button>
              </motion.div>

              {/* 特色亮点 */}
              <div className="bg-card/40 rounded-lg border-none p-6 backdrop-blur-sm">
                <h4 className="text-card-foreground mb-4 font-semibold">
                  为什么选择我们？
                </h4>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-center">
                    <div className="from-primary to-secondary mr-3 h-2 w-2 rounded-full bg-gradient-to-r" />
                    7 天免费试用，无需信用卡
                  </li>
                  <li className="flex items-center">
                    <div className="from-primary to-secondary mr-3 h-2 w-2 rounded-full bg-gradient-to-r" />
                    24/7 AI 学习助手支持
                  </li>
                  <li className="flex items-center">
                    <div className="from-primary to-secondary mr-3 h-2 w-2 rounded-full bg-gradient-to-r" />
                    个性化学习路径定制
                  </li>
                  <li className="flex items-center">
                    <div className="from-primary to-secondary mr-3 h-2 w-2 rounded-full bg-gradient-to-r" />
                    全球学习者社区
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

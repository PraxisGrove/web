'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AceternityGlassCard,
  GradientText,
  FloatingElement,
  AceternityTypewriter,
  AnimatedContainer,
  InViewAnimation,
} from '@/components/unified';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'register';
}

/**
 * 增强的认证页面布局组件
 * 集成了 Aceternity 和 ReactBit 的高级效果
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const features = [
    {
      icon: '🤖',
      text: '个性化AI学习助手',
      delay: 0.2,
    },
    {
      icon: '🌌',
      text: '3D知识宇宙探索',
      delay: 0.4,
    },
    {
      icon: '🌍',
      text: '全球学习者社区',
      delay: 0.6,
    },
    {
      icon: '⚡',
      text: '智能学习路径规划',
      delay: 0.8,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 粒子背景 - 暂时注释以排查问题 */}
      {/* <div className="absolute inset-0 z-0">
        <ParticleBackground
          particleCount={100}
          particleColor="#3b82f6"
          particleSize={2}
          speed={0.5}
        />
      </div> */}

      {/* 光束背景 - 暂时注释以排查问题 */}
      {/* <div className="absolute inset-0 z-10">
        <BackgroundBeams />
      </div> */}

      {/* 鼠标跟随效果 - 暂时注释以排查问题 */}
      {/* <MouseFollower /> */}

      {/* 主要内容 */}
      <div className="relative z-20 flex min-h-screen">
        {/* 左侧品牌展示区域 */}
        <div className="hidden items-center justify-center p-12 lg:flex lg:w-1/2">
          <AnimatedContainer className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* 品牌标题 */}
              <div className="mb-8">
                <GradientText className="text-6xl font-bold">
                  PraxisGrove
                </GradientText>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-4"
                >
                  <AceternityTypewriter
                    text="一所无需许可的学校"
                    className="text-xl text-blue-200"
                    speed={100}
                    delay={500}
                  />
                </motion.div>
              </div>

              {/* 特性列表 */}
              <div className="max-w-md space-y-6">
                {features.map((feature, index) => (
                  <InViewAnimation
                    key={index}
                    animation="slideInLeft"
                    delay={feature.delay}
                  >
                    <FloatingElement
                      amplitude={5 + index * 2}
                      frequency={2 + index * 0.5}
                      className="group"
                    >
                      <motion.div
                        className="flex items-center space-x-4 rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="text-2xl"
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        >
                          {feature.icon}
                        </motion.div>
                        <span className="text-lg font-medium">
                          {feature.text}
                        </span>
                      </motion.div>
                    </FloatingElement>
                  </InViewAnimation>
                ))}
              </div>

              {/* 装饰性元素 */}
              <motion.div
                className="mt-12 flex justify-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </AnimatedContainer>
        </div>

        {/* 右侧认证表单区域 */}
        <div className="flex flex-1 items-center justify-center p-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AceternityGlassCard className="overflow-hidden p-8">
              {/* 表单标题 */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GradientText className="text-3xl font-bold">
                  {title}
                </GradientText>
                <motion.p
                  className="mt-3 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {subtitle}
                </motion.p>
              </motion.div>

              {/* 表单内容 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {children}
              </motion.div>

              {/* 装饰性底部 */}
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              </motion.div>
            </AceternityGlassCard>
          </motion.div>
        </div>
      </div>

      {/* 移动端品牌信息 */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 z-30 lg:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="rounded-lg bg-black/20 p-4 text-center text-white backdrop-blur-sm">
          <GradientText className="text-2xl font-bold">
            PraxisGrove
          </GradientText>
          <p className="mt-1 text-sm opacity-80">探索知识的无限可能</p>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;

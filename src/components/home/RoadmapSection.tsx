'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  Zap,
  Rocket,
  Brain,
  Globe,
  Users,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapSectionProps {
  className?: string;
}

interface RoadmapItem {
  id: string;
  quarter: string;
  title: string;
  description: string;
  features: string[];
  status: 'completed' | 'in-progress' | 'planned';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: 'q3-2025',
    quarter: '2025 Q1',
    title: 'AI Learning Assistant 2.0',
    description:
      'Comprehensive upgrade of AI Learning Assistant, providing a smarter personalized learning experience.',
    features: [
      'Multimodal Content Understanding',
      'Real-time Learning State Analysis',
      'Intelligent Learning Plan Generation',
      'Personalized Difficulty Adjustment',
    ],
    status: 'completed',
    icon: Brain,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'q4-2025',
    quarter: '2025 Q2',
    title: '3D Knowledge Universe Enhancement',
    description:
      'Create a more immersive 3D learning environment with VR/AR device support.',
    features: [
      'VR/AR Device Support',
      'Physics Engine Integration',
      'Multi-user Collaboration Space',
      'Knowledge Graph Visualization',
    ],
    status: 'in-progress',
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'q1-2026',
    quarter: '2025 Q3',
    title: 'Intelligent Learning Community',
    description:
      'Build a global learner community enabling intelligent matching and collaborative learning.',
    features: [
      'Intelligent Partner Matching',
      'Real-time Collaboration Tools',
      'Knowledge Sharing Platform',
      'Learning Achievement System',
    ],
    status: 'planned',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'q2-2026',
    quarter: '2025 Q4',
    title: 'Enterprise Solutions',
    description:
      'Provide customized learning management systems for enterprises and educational institutions.',
    features: [
      'Enterprise Permission Management',
      'Learning Data Analysis',
      'Customized Course System',
      'API Integration Support',
    ],
    status: 'planned',
    icon: Target,
    gradient: 'from-orange-500 to-red-500',
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'bg-green-500',
    textColor: 'text-green-600',
  },
  'in-progress': {
    icon: Zap,
    label: 'In Progress',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
  },
  planned: {
    icon: Clock,
    label: 'Planned',
    color: 'bg-muted',
    textColor: 'text-muted-foreground',
  },
};

export function RoadmapSection({ className }: RoadmapSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden py-12',
        // 使用透明背景以不遮挡粒子效果
        'bg-transparent',
        className
      )}
    >
      {/* 完全透明背景，让粒子效果完全展示 */}

      <div className="container relative z-10 mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex items-center justify-center">
            <Rocket className="text-primary mr-3 h-8 w-8" />
            <h2 className="text-foreground text-3xl font-bold md:text-4xl lg:text-5xl">
              Product Roadmap
            </h2>
          </div>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
            Explore the future development plan of PraxisGrove and witness the
            innovation of educational technology.
          </p>
        </motion.div>

        {/* 路线图时间线 */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* 时间线连接线 */}
          <div className="from-primary via-secondary absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b to-transparent opacity-30" />

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <RoadmapCard
                key={item.id}
                item={item}
                index={index}
                variants={itemVariants}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface RoadmapCardProps {
  item: RoadmapItem;
  index: number;
  variants: any;
}

function RoadmapCard({ item, index, variants }: RoadmapCardProps) {
  const Icon = item.icon;
  const StatusIcon = statusConfig[item.status].icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={variants}
      className={cn(
        'relative flex items-center',
        isEven ? 'justify-start' : 'justify-end'
      )}
    >
      {/* 时间线节点 */}
      <div className="absolute left-1/2 z-20 -translate-x-1/2 transform">
        <div
          className={cn(
            'border-background h-6 w-6 rounded-full border-4',
            `bg-gradient-to-br ${item.gradient}`
          )}
        />
      </div>

      {/* 卡片内容 */}
      <div className={cn('w-full max-w-md', isEven ? 'pr-8' : 'pl-8')}>
        <Card
          className={cn(
            'bg-card/40 backdrop-blur-sm',
            'border-none',
            'transition-all duration-300',
            'hover:scale-105'
          )}
        >
          <CardHeader>
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs font-medium',
                  statusConfig[item.status].textColor
                )}
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig[item.status].label}
              </Badge>
              <span className="text-muted-foreground text-sm font-medium">
                {item.quarter}
              </span>
            </div>

            <div className="mb-3 flex items-center">
              <div
                className={cn(
                  'mr-4 flex h-12 w-12 items-center justify-center rounded-full',
                  `bg-gradient-to-br ${item.gradient}`
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-card-foreground text-xl font-bold">
                {item.title}
              </CardTitle>
            </div>

            <CardDescription className="text-muted-foreground leading-relaxed">
              {item.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {item.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="text-muted-foreground flex items-center text-sm"
                >
                  <div className="from-primary to-secondary mr-3 h-1.5 w-1.5 rounded-full bg-gradient-to-r" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

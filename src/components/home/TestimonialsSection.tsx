'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialsSectionProps {
  className?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  highlight: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Zhang Ming',
    role: 'Software Engineer',
    company: 'Tencent',
    avatar: '/avatars/zhang-ming.jpg',
    rating: 5,
    content:
      "PraxisGrove's AI Learning Assistant is amazing! It recommends the most suitable content based on my learning progress and preferences, increasing my learning efficiency by 300%.",
    highlight: 'Learning efficiency increased by 300%',
  },
  {
    id: '2',
    name: 'Li Xiaoyu',
    role: 'Product Manager',
    company: 'ByteDance',
    avatar: '/avatars/li-xiaoyu.jpg',
    rating: 5,
    content:
      'The 3D Knowledge Universe experience is stunning! Complex concepts become very easy to understand through 3D visualization. This way of learning is unprecedented.',
    highlight: '3D visualization learning experience',
  },
  {
    id: '3',
    name: 'Wang Jianhua',
    role: 'Data Scientist',
    company: 'Alibaba',
    avatar: '/avatars/wang-jianhua.jpg',
    rating: 5,
    content:
      'The quality of the learning community is very high. Being able to communicate with global experts and learners has provided me with many valuable insights and suggestions.',
    highlight: 'Global expert exchange',
  },
  {
    id: '4',
    name: 'Chen Sisi',
    role: 'Designer',
    company: 'Meituan',
    avatar: '/avatars/chen-sisi.jpg',
    rating: 5,
    content:
      'The personalized learning path is well designed, perfectly matching my learning pace and goals. I gain something new every day.',
    highlight: 'Personalized learning path',
  },
  {
    id: '5',
    name: 'Liu Qiang',
    role: 'Entrepreneur',
    company: 'Independent Startup',
    avatar: '/avatars/liu-qiang.jpg',
    rating: 5,
    content:
      "As an entrepreneur, time is precious. PraxisGrove's smart recommendations help me quickly find the knowledge I need most, saving a lot of time.",
    highlight: 'Smart recommendations save time',
  },
  {
    id: '6',
    name: 'Zhao Meili',
    role: 'Student',
    company: 'Tsinghua University',
    avatar: '/avatars/zhao-meili.jpg',
    rating: 5,
    content:
      'The course quality on the platform is very high. The teachers explain clearly, and with the AI assistant answering questions, the learning effect is much better than traditional methods.',
    highlight: 'AI assistant Q&A',
  },
];

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        'bg-gradient-to-b from-slate-50 to-white py-20 dark:from-slate-900 dark:to-slate-800',
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Real User Reviews
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl dark:text-gray-300">
            Hear what our users have to say about the PraxisGrove learning
            experience.
          </p>
        </motion.div>

        {/* 无限滚动卡片容器 */}
        <div className="relative overflow-hidden">
          <InfiniteMovingCards testimonials={testimonials} />
        </div>

        {/* 统计数据 */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600 md:text-4xl dark:text-purple-400">
              50K+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Active Learners
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl dark:text-blue-400">
              1000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Quality Courses
            </div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-green-600 md:text-4xl dark:text-green-400">
              98%
            </div>
            <div className="text-gray-600 dark:text-gray-300">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600 md:text-4xl dark:text-orange-400">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-300">AI Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 星级评分组件
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= rating
              ? 'fill-current text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
    </div>
  );
}

// 无限滚动卡片组件
function InfiniteMovingCards({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // 复制数组以实现无限滚动效果
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="animate-scroll flex space-x-6">
      {duplicatedTestimonials.map((testimonial, index) => (
        <TestimonialCard
          key={`${testimonial.id}-${index}`}
          testimonial={testimonial}
        />
      ))}
    </div>
  );
}

// 推荐卡片组件
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-64 w-80 flex-shrink-0 border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800/80">
      <CardContent className="flex h-full flex-col justify-between p-6">
        {/* 评分和内容 */}
        <div>
          <StarRating rating={testimonial.rating} />
          <p className="mt-4 line-clamp-4 leading-relaxed text-gray-700 dark:text-gray-300">
            &ldquo;{testimonial.content}&rdquo;
          </p>
        </div>

        {/* 用户信息 */}
        <div className="mt-4 flex items-center">
          <Avatar className="mr-4 h-12 w-12">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {testimonial.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.role} · {testimonial.company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

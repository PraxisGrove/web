'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map, BookOpen, Lightbulb, ArrowRight, Layers } from 'lucide-react';
import { Badge } from '@/components/unified';
import { cn } from '@/lib/utils';

export const ContextSidebar = () => {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Active Context Card */}
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-xl dark:bg-black/40 dark:border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Map className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Current Roadmap Context</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Node</span>
            <Badge variant="outline" className="text-[10px] font-bold border-emerald-200 text-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 px-2 py-0.5">IN PROGRESS</Badge>
          </div>
          
          <h4 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">React Fundamentals</h4>
          
          <p className="mb-5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            You are currently exploring the core concepts of React, specifically focusing on <span className="font-medium text-emerald-600 dark:text-emerald-400">Component Lifecycle</span> and <span className="font-medium text-emerald-600 dark:text-emerald-400">State Management</span>.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-[10px] font-medium text-slate-500">
                <span>Prerequisites Mastery</span>
                <span className="text-emerald-600 dark:text-emerald-400">85%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                 <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                 />
              </div>
            </div>
            
            <div className="rounded-xl bg-white/50 p-3 border border-white/20 dark:bg-white/5 dark:border-white/5">
              <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Related Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {['Virtual DOM', 'JSX', 'Props', 'Hooks'].map((tag) => (
                  <span key={tag} className="rounded-md px-2 py-1 text-[10px] font-medium bg-white border border-slate-200 text-slate-600 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Explain / Micro-Course Suggestions */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Micro-Courses</h3>
            <span className="text-[10px] text-emerald-500 font-medium cursor-pointer hover:underline">View All</span>
        </div>
        
        {[
          { title: "Understanding useEffect", type: "Deep Dive", time: "5 min", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "State vs Props Analogy", type: "ELI5", time: "3 min", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "React Rendering Cycle", type: "Visual", time: "7 min", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 + 0.2 }}
            className="group cursor-pointer rounded-xl border border-white/40 bg-white/60 p-3.5 transition-all hover:border-emerald-400 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10 dark:border-white/5 dark:bg-white/5 dark:hover:border-emerald-500/50 dark:hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", item.bg, item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-300 transition-colors">{item.title}</h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{item.type}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white opacity-0 shadow-sm transition-all group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800">
                <ArrowRight className="h-3 w-3 text-emerald-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
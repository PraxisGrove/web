'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, GitBranch, Wand2, CheckCircle2, AlertTriangle, FileJson, Save } from 'lucide-react';
import { EnhancedCard, Button, Textarea, Badge } from '@/components/unified';
import { GlowBorder } from '@/components/aceternity/styled-components';
import { BackgroundBeams } from '@/components/aceternity/background-beams';

export const CreatorDashboard = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`## ${topic} - Knowledge Node

### Core Concepts
1. **Definition**: A fundamental building block of...
2. **Key Properties**: Scalability, Modularity, and...

### Learning Objectives
- Understand the basic syntax
- Apply the pattern in real-world scenarios

### Resources
- [Official Documentation](https://example.com)
- [Deep Dive Article](https://example.com/article)`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Top Control Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <GlowBorder className="relative overflow-hidden p-4 md:col-span-2 bg-card border border-border">
          <div className="relative z-10">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <Wand2 className="h-5 w-5 text-violet-500" />
              AI Node Generator
            </h3>
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter a topic (e.g., 'Advanced TypeScript Generics')..."
                className="min-h-[80px] resize-none bg-white/50 backdrop-blur-sm dark:bg-black/20"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button
                className="h-auto w-24 flex-col gap-1 bg-violet-600 hover:bg-violet-700"
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <SparklesIcon className="h-5 w-5" />
                )}
                <span className="text-xs">{isGenerating ? 'Building...' : 'Generate'}</span>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10">
            <BackgroundBeams />
          </div>
        </GlowBorder>

        <EnhancedCard variant="glow" className="flex flex-col justify-between p-4">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <GitBranch className="h-4 w-4" />
              Structure Health
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> No Cycles</span>
                <span className="font-bold">Pass</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Orphan Nodes</span>
                <span className="font-bold">2 Found</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
            Run Full Audit
          </Button>
        </EnhancedCard>
      </div>

      {/* Main Workspace */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor / Preview */}
        <EnhancedCard className="flex flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-medium text-slate-500">Draft Content</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6"><FileJson className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6"><Save className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className="flex-1 bg-white p-4 dark:bg-slate-950">
            {generatedContent ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                <pre className="whitespace-pre-wrap font-sans text-sm">{generatedContent}</pre>
              </motion.div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <PenTool className="mb-2 h-8 w-8 opacity-20" />
                <p className="text-sm">Ready to create. Generate a node to start editing.</p>
              </div>
            )}
          </div>
        </EnhancedCard>

        {/* Visualizer Placeholder (Roadmap Architect) */}
        <EnhancedCard className="relative flex flex-col overflow-hidden p-0">
           <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-medium text-slate-500">Structure Preview</span>
            <Badge variant="outline" className="text-[10px]">Interactive</Badge>
          </div>
          <div className="relative flex-1 bg-slate-50 dark:bg-slate-900">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            {/* Mock Nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative h-64 w-64">
                  <motion.div 
                    className="absolute left-1/2 top-0 -translate-x-1/2 rounded-lg border border-violet-500 bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm dark:bg-violet-900/50 dark:text-violet-300"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Core Concept
                  </motion.div>
                  
                  <svg className="absolute inset-0 h-full w-full pointer-events-none">
                    <path d="M128 32 L64 128" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M128 32 L192 128" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>

                  <motion.div 
                    className="absolute left-0 top-1/2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                  >
                    Sub-topic A
                  </motion.div>

                  <motion.div 
                    className="absolute right-0 top-1/2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                  >
                    Sub-topic B
                  </motion.div>
               </div>
            </div>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 3v4" />
    <path d="M3 5h4" />
    <path d="M3 9h4" />
  </svg>
);
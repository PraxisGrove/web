'use client';

import React, { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle2,
  Lock,
  MoreVertical,
  ArrowRight,
  Code,
  ChevronRight,
  Circle
} from 'lucide-react';
import type { RoadmapNodeData } from '../types';
import { useRoadmapStore } from '../store';
import { useUIStore } from '@/store/ui';

type ConceptNodeProps = NodeProps<Node<RoadmapNodeData, 'concept'>>;

function ConceptNodeComponent({ id, data, selected }: ConceptNodeProps) {
  const toggleNodeExpanded = useRoadmapStore((s) => s.toggleNodeExpanded);
  const setAIChatConfig = useUIStore((state) => state.setAIChatConfig);
  
  const {
    label,
    status,
    objectives,
    description,
    isExpanded
  } = data;

  const handleStartWithAI = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setAIChatConfig({ visible: true });
  }, [setAIChatConfig]);

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNodeExpanded(id);
  }, [id, toggleNodeExpanded]);

  // --- Variant: Completed ---
  if (status === 'completed') {
    return (
      <div className="relative w-[320px] group transition-all duration-300 hover:scale-[1.02]">
        <div className="relative w-full bg-[#161b22] border border-green-900/40 rounded-2xl shadow-2xl overflow-hidden group-hover:border-green-500/50 transition-colors duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-green-500/10 to-transparent flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">{label}</h3>
              <p className="text-slate-400 text-xs mt-1">Core syntax and logic</p>
            </div>
            <div className="bg-green-500/20 text-green-400 p-1.5 rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <Check size={18} />
            </div>
          </div>
          
          {/* Body */}
          <div className="p-2 space-y-1">
            {(objectives || ['Variables & Data Types', 'Control Flow & Loops', 'Functions & Modules']).slice(0, 3).map((obj, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/item opacity-60">
                <CheckCircle2 className="text-green-500" size={18} />
                <span className="text-sm text-slate-400 line-through">{obj}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <span className="text-xs font-medium text-green-400">Completed</span>
            </div>
            <button className="text-xs text-slate-400 hover:text-white font-medium px-3 py-1.5 rounded hover:bg-white/5 transition-colors">
              Review
            </button>
          </div>
        </div>
        
        <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-slate-600 opacity-0" />
        <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-green-500 opacity-0" />
      </div>
    );
  }

  // --- Variant: In Progress ---
  if (status === 'in-progress') {
    return (
      <div className="relative w-[360px] group z-20">
        {/* Glow Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
        
        <div className="relative w-full bg-[#161b22] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col">
          {/* Header */}
          <div className="relative px-5 py-5 border-b border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 mb-2 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  CURRENT MODULE
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">{label}</h3>
              </div>
              <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Code size={24} />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-2 space-y-1 bg-[#161b22]">
            {(objectives || ['NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning']).slice(0, 3).map((obj, i) => (
              <button key={i} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group/item text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${i === 0 ? 'bg-blue-500/20 text-blue-400 border-blue-500/20 group-hover/item:bg-blue-500 group-hover/item:text-white' : i === 1 ? 'bg-purple-500/20 text-purple-400 border-purple-500/20 group-hover/item:bg-purple-500 group-hover/item:text-white' : 'bg-white/5 text-slate-500 border-white/5 group-hover/item:border-white/20'}`}>
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className={`text-sm font-medium transition-colors ${i < 2 ? 'text-slate-200 group-hover/item:text-white' : 'text-slate-400 group-hover/item:text-slate-200'}`}>
                    {obj}
                  </span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-all group-hover/item:translate-x-0.5 ${i === 0 ? 'group-hover/item:text-blue-400' : i === 1 ? 'group-hover/item:text-purple-400' : 'group-hover/item:text-slate-400'}`} />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-[80px]">
              <div className="flex items-center gap-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                </div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">In Progress</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleStartWithAI}
                className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>Start with AI</span>
                <ArrowRight size={16} className="font-bold" />
              </button>
              <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-slate-600 opacity-0" />
        <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-blue-500 opacity-0" />
      </div>
    );
  }

  // --- Variant: Locked (Default) ---
  return (
    <div className="relative w-[320px] z-10">
      <div className="relative w-full bg-[#161b22] border border-white/5 rounded-2xl shadow-xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300 group">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
          <div>
            <h3 className="text-slate-300 font-bold text-lg leading-tight group-hover:text-white transition-colors">{label}</h3>
            <p className="text-slate-500 text-xs mt-1">Supervised Learning</p>
          </div>
          <div className="bg-white/5 text-slate-500 p-1.5 rounded-lg border border-white/5">
            <Lock size={18} />
          </div>
        </div>

        {/* Body */}
        <div className="p-2 space-y-1 pointer-events-none grayscale opacity-60 blur-[1px] group-hover:blur-0 transition-all">
          {(objectives || ['Linear Regression', 'Classification Models', 'Model Evaluation']).slice(0, 3).map((obj, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
              <Circle size={18} className="text-slate-600" />
              <span className="text-sm text-slate-500">{obj}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
            <span className="text-xs font-medium text-slate-500">Locked</span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-slate-600 opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-[#161b22] !bg-slate-600 opacity-0" />
    </div>
  );
}

export const ConceptNode = memo(ConceptNodeComponent);

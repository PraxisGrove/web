'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, Sparkles, BrainCircuit, ArrowRight, X } from 'lucide-react';
import { Button, Textarea, Avatar, AvatarFallback } from '@/components/unified';
import { Typewriter } from '@/components/aceternity';
import { cn } from '@/lib/utils';
import { useUIStore, uiSelectors } from '@/store/ui';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  conceptProbe?: {
    question: string;
    options: string[];
  };
}

export const AIChatPanel = () => {
  const aiChatConfig = useUIStore(uiSelectors.aiChatConfig);
  const toggleAIChatVisibility = useUIStore((state) => state.toggleAIChatVisibility);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your Roadmap Assistant. I can help you plan your learning path, break down complex topics, or answer questions about specific nodes. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand you're looking for guidance on that. Based on your current roadmap progress, I suggest focusing on the prerequisites first...",
        timestamp: new Date(),
        conceptProbe: Math.random() > 0.7 ? {
          question: "Quick check: How does this connect to the previous node?",
          options: ["Direct dependency", "Conceptual similarity", "Practical application"]
        } : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!aiChatConfig.enabled || !aiChatConfig.visible) return null;

  const getPositionStyles = () => {
    switch (aiChatConfig.position) {
      case 'sidebar':
        return "fixed right-0 top-20 bottom-0 w-[400px] border-l border-white/20 rounded-l-2xl m-4 mb-0";
      case 'bottom':
        return "fixed bottom-0 left-0 right-0 h-[400px] border-t border-white/20 rounded-t-2xl mx-4";
      case 'float':
      default:
        return "fixed bottom-24 right-6 w-[400px] h-[600px] rounded-2xl border border-white/20 shadow-2xl";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "z-40 flex flex-col overflow-hidden bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 shadow-2xl",
          getPositionStyles()
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/50 px-4 py-3 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
              <BrainCircuit className="h-4 w-4" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Roadmap Assistant</h3>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                <p className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80">AI Powered</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={toggleAIChatVisibility}
             >
                <X className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full gap-3",
                msg.type === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className={cn(
                "h-8 w-8 shrink-0 border shadow-sm",
                msg.type === 'ai' ? "border-emerald-100 dark:border-emerald-900/30" : "border-blue-100 dark:border-blue-900/30"
              )}>
                {msg.type === 'ai' ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 text-emerald-600 dark:from-emerald-950 dark:to-cyan-950 dark:text-emerald-400">
                    <Bot className="h-4 w-4" />
                  </div>
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] text-white font-bold">ME</AvatarFallback>
                )}
              </Avatar>

              <div className={cn(
                "flex max-w-[85%] flex-col gap-1",
                msg.type === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "relative rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed",
                  msg.type === 'user'
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm"
                )}>
                  {msg.type === 'ai' ? (
                    <Typewriter
                      text={msg.content}
                      speed={20}
                      className="font-medium"
                    />
                  ) : (
                    <span className="font-medium">{msg.content}</span>
                  )}
                </div>

                {/* Concept Probe Widget */}
                {msg.conceptProbe && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 w-full max-w-xs overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10"
                  >
                    <div className="flex items-center gap-2 border-b border-emerald-500/10 bg-emerald-500/5 px-3 py-2">
                      <Sparkles className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Suggestion</span>
                    </div>
                    <div className="p-3">
                      <p className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">{msg.conceptProbe.question}</p>
                      <div className="space-y-1.5">
                        {msg.conceptProbe.options.map((option, idx) => (
                          <button
                            key={idx}
                            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[10px] text-slate-600 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                          >
                            {option}
                            <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <span className="text-[10px] text-slate-400 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-slate-400 pl-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 delay-0"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 delay-150"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 delay-300"></span>
              </div>
              Thinking...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 border-t border-slate-200 bg-white/50 p-3 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/50">
          <div className="relative flex items-end gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your roadmap..."
                className="min-h-[40px] w-full resize-none border-0 bg-transparent px-3 py-2.5 text-sm font-medium placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-200"
                rows={1}
              />
              <div className="flex gap-1 pb-1 pr-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-all">
                  <Mic className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

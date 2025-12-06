'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import { Button, Textarea, Avatar, AvatarFallback } from '@/components/unified';
import { Typewriter } from '@/components/aceternity';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isThinking?: boolean; // For Socratic mode "thinking" state
  conceptProbe?: { // For Concept Probes
    question: string;
    options: string[];
  };
}

export const SocraticChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your Socratic Tutor. I'm here to help you *understand*, not just memorize. What topic shall we explore today?",
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

    // Simulate Socratic thinking/response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "That's an interesting perspective. But have you considered how this relates to the fundamental principles of...",
        timestamp: new Date(),
        conceptProbe: Math.random() > 0.7 ? {
          question: "Quick check: Which of these best describes the core concept?",
          options: ["Option A: Direct mapping", "Option B: Abstract reference", "Option C: Value copy"]
        } : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-xl shadow-2xl dark:bg-black/40 dark:border-white/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/30 px-6 py-4 backdrop-blur-md dark:bg-black/20">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <BrainCircuit className="h-5 w-5" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Socratic Tutor</h3>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">Guided Discovery</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
           <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex w-full gap-4",
              msg.type === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className={cn(
              "h-10 w-10 shrink-0 border-2 shadow-md",
              msg.type === 'ai' ? "border-emerald-100 dark:border-emerald-900/30" : "border-blue-100 dark:border-blue-900/30"
            )}>
              {msg.type === 'ai' ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 text-emerald-600 dark:from-emerald-950 dark:to-cyan-950 dark:text-emerald-400">
                  <Bot className="h-5 w-5" />
                </div>
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">ME</AvatarFallback>
              )}
            </Avatar>

            <div className={cn(
              "flex max-w-[85%] flex-col gap-2",
              msg.type === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "relative rounded-2xl px-5 py-4 text-sm shadow-sm leading-relaxed",
                msg.type === 'user'
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/20"
                  : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-tl-sm border border-white/50 dark:border-white/10 shadow-xl shadow-black/5"
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
                  className="mt-2 w-full max-w-md overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10"
                >
                  <div className="flex items-center gap-2 border-b border-emerald-500/10 bg-emerald-500/5 px-3 py-2">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Concept Probe</span>
                  </div>
                  <div className="p-3">
                    <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">{msg.conceptProbe.question}</p>
                    <div className="space-y-2">
                      {msg.conceptProbe.options.map((option, idx) => (
                        <button
                          key={idx}
                          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-slate-400">
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
      <div className="relative z-10 border-t border-white/10 bg-white/40 p-4 backdrop-blur-xl dark:bg-black/40">
        <div className="relative flex items-end gap-2 rounded-2xl bg-white/50 p-2 shadow-inner ring-1 ring-black/5 dark:bg-black/20 dark:ring-white/10">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question or explain your thought process..."
              className="min-h-[50px] w-full resize-none border-0 bg-transparent px-3 py-3 text-sm font-medium placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-200"
              rows={1}
            />
            <div className="flex gap-2 pb-2 pr-2">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-9 w-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
        </div>
        <div className="mt-2 flex justify-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
      </div>
    </div>
  );
};
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Sparkles, BrainCircuit, ArrowRight, MoreVertical, History, ArrowUp } from 'lucide-react';
import { Typewriter } from '@/components/aceternity';
import { cn } from '@/lib/utils';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I see you're working on the **Data Processing** module. Ready to dive into Pandas DataFrames?",
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
        content: "Here is a simple example using `pd.DataFrame()`...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 bg-[#13161c]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-white text-[18px] font-bold">AI</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-[#13161c] rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Chat</h3>
            <p className="text-[10px] text-white/50 font-medium">Always active • GPT-4o</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="size-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <History size={18} />
          </button>
          <button className="size-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-gradient-to-b from-[#0f1115] to-[#0b0c10]">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.type === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "size-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1",
              msg.type === 'ai' 
                ? "bg-gradient-to-tr from-blue-500 to-purple-600" 
                : "bg-white/10 border border-white/10"
            )}>
              {msg.type === 'ai' ? (
                <span className="text-white text-[12px] font-bold">AI</span>
              ) : (
                <span className="text-white text-[10px]">ME</span>
              )}
            </div>
            
            <div className={cn("flex flex-col gap-1 max-w-[85%]", msg.type === 'user' ? "items-end" : "")}>
              <span className={cn("text-xs text-white/40 font-medium", msg.type === 'user' ? "mr-1" : "ml-1")}>
                {msg.type === 'ai' ? 'Chat' : 'You'}
              </span>
              <div className={cn(
                "p-4 shadow-sm text-sm leading-relaxed",
                msg.type === 'ai'
                  ? "bg-[#1c2127] border border-white/5 rounded-2xl rounded-tl-none text-slate-200"
                  : "bg-blue-500/20 border border-blue-500/20 rounded-2xl rounded-tr-none text-white"
              )}>
                {msg.type === 'ai' ? (
                  <Typewriter text={msg.content} speed={20} />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 items-center opacity-50">
            <div className="size-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">AI</span>
            </div>
            <div className="flex gap-1 bg-[#1c2127] border border-white/5 rounded-full px-4 py-3 h-10 items-center">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-0"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[#13161c]">
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mask-linear">
          <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500/20 text-xs font-medium transition-colors">Generate Quiz</button>
          <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white text-xs font-medium transition-colors">Summarize</button>
          <button className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white text-xs font-medium transition-colors">Real-world examples</button>
        </div>
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full bg-[#0b0c10] text-sm text-white placeholder-white/30 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none h-[50px] custom-scrollbar" 
            placeholder="Ask anything about Python or Data..."
          ></textarea>
          <button 
            onClick={handleSend}
            className="absolute right-2 bottom-2 size-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-white/30 mt-2">AI can make mistakes. Verify important info.</p>
      </div>
    </>
  );
};

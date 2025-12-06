'use client';

import React from 'react';
import { WalletGuard } from '@/components/auth/WalletGuard';
import { AILayout } from './components/AILayout';
import { SocraticChat } from './components/SocraticChat';
import { CreatorDashboard } from './components/CreatorDashboard';

/**
 * AI 助手页面
 * 核心旅程：对话 → 路线图生成
 */
export default function AIPage() {
  return (
    <WalletGuard>
      <AILayout>
        {(mode) => (
          <div className="h-[calc(100vh-140px)] min-h-[500px]">
            {mode === 'learner' ? (
              /* Learner Mode: 全屏聊天，聚焦对话体验 */
              <div className="mx-auto h-full max-w-4xl">
                <SocraticChat />
              </div>
            ) : (
              /* Creator Mode: 创作工具面板 */
              <CreatorDashboard />
            )}
          </div>
        )}
      </AILayout>
    </WalletGuard>
  );
}

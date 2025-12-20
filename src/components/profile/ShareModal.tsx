'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'link' | 'card';

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('link');
  const [theme, setTheme] = useState<'cyberpunk' | 'academic'>('cyberpunk');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none overflow-hidden sm:max-w-5xl">
        <DialogTitle className="sr-only">Share Profile</DialogTitle>
        <div className="relative w-full bg-[#111418] rounded-2xl shadow-2xl border border-[#283039] flex flex-col h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-6 z-50 text-[#9dabb9] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* Header / Tabs */}
          <div className="px-6 border-b border-[#283039] shrink-0 pt-2">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('link')}
                className={cn(
                  "flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors group",
                  activeTab === 'link' 
                    ? "border-b-[#137fec] text-white" 
                    : "border-b-transparent text-[#9dabb9] hover:text-[#cad6e2]"
                )}
              >
                <span className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2">
                  <span className={cn("material-symbols-outlined text-lg", activeTab === 'link' ? "text-[#137fec]" : "")}>person</span>
                  Link Share
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('card')}
                className={cn(
                  "flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors",
                  activeTab === 'card'
                    ? "border-b-[#137fec] text-white"
                    : "border-b-transparent text-[#9dabb9] hover:text-[#cad6e2]"
                )}
              >
                <span className="text-sm font-bold leading-normal tracking-[0.015em] flex items-center gap-2">
                  <span className={cn("material-symbols-outlined text-lg", activeTab === 'card' ? "text-[#137fec]" : "")}>auto_awesome_mosaic</span>
                  Card Share
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 bg-[#0b0e11]">
            {activeTab === 'link' ? (
              <LinkShareContent />
            ) : (
              <CardShareContent theme={theme} setTheme={setTheme} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LinkShareContent() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Public Profile Link Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-[#111418] border border-[#283039] rounded-xl shadow-lg">
        <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
          <div className="h-10 w-10 rounded-full bg-[#137fec]/10 flex items-center justify-center shrink-0 text-[#137fec] border border-[#137fec]/20">
            <span className="material-symbols-outlined">public</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-[#9dabb9] uppercase font-bold tracking-wider mb-0.5">Public Profile Link</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono text-sm truncate opacity-90">praxisgrove.io/u/alex_sterling</span>
              <span className="material-symbols-outlined text-xs text-green-400" title="Active">circle</span>
            </div>
          </div>
        </div>
        <button className="shrink-0 px-5 py-2.5 bg-[#1c2127] hover:bg-[#283039] text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-[#283039] transition-all flex items-center gap-2 hover:border-[#137fec]/50 group">
          <span className="material-symbols-outlined text-sm group-hover:text-[#137fec] transition-colors">content_copy</span>
          Copy Link
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Profile Header Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#111418] border border-[#283039] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#137fec]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-[#1c2127] p-1 border border-[#283039] shadow-2xl shrink-0 overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-display font-bold text-3xl">AS</div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1c2127]"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-bold font-display text-white">Alex Sterling</h1>
                    <span className="material-symbols-outlined text-[#137fec] text-xl" title="Verified Identity">verified</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1c2127] border border-[#283039] text-[10px] text-[#9dabb9] uppercase font-bold tracking-wider ml-auto md:ml-2">Visitor View</span>
                  </div>
                  <p className="text-[#9dabb9] text-lg font-light">Full-Stack Blockchain Architect & AI Researcher</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c2127] border border-[#283039]">
                      <span className="material-symbols-outlined text-sm text-[#9dabb9]">location_on</span>
                      <span className="text-xs text-gray-300">San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#137fec]/10 border border-[#137fec]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137fec] animate-pulse"></span>
                      <span className="text-xs text-[#137fec] font-bold">Open to Work</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Nodes */}
              <div className="p-6 rounded-2xl bg-[#111418] border border-[#283039] flex flex-col gap-4 group hover:border-[#137fec]/30 transition-colors relative overflow-hidden min-h-[220px]">
                <div className="flex justify-between items-center z-10">
                  <h3 className="text-white font-display font-bold text-lg">Skill Nodes</h3>
                  <div className="flex items-center gap-1 text-[#9dabb9] text-xs">
                    <span className="material-symbols-outlined text-sm">hub</span>
                    <span>Graph</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 z-10 relative">
                  <span className="px-3 py-1.5 rounded-lg bg-[#1c2127]/80 backdrop-blur-md text-gray-300 text-xs border border-[#283039] font-medium">Solidity</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#1c2127]/80 backdrop-blur-md text-gray-300 text-xs border border-[#283039] font-medium">Rust</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#1c2127]/80 backdrop-blur-md text-gray-300 text-xs border border-[#283039] font-medium">ZK-Rollups</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#1c2127]/80 backdrop-blur-md text-gray-300 text-xs border border-[#283039] font-medium">React</span>
                </div>
                <div className="absolute inset-0 top-8 opacity-40 pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 120">
                    <circle cx="40" cy="40" fill="#137fec" r="3"></circle>
                    <circle cx="100" cy="20" fill="#137fec" r="3"></circle>
                    <circle cx="160" cy="50" fill="#137fec" r="3"></circle>
                    <circle cx="70" cy="80" fill="#137fec" r="3"></circle>
                    <circle cx="130" cy="90" fill="#137fec" r="3"></circle>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="40" x2="100" y1="40" y2="20"></line>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="100" x2="160" y1="20" y2="50"></line>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="40" x2="70" y1="40" y2="80"></line>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="70" x2="130" y1="80" y2="90"></line>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="160" x2="130" y1="50" y2="90"></line>
                    <line stroke="#137fec" strokeOpacity="0.5" strokeWidth="0.5" x1="100" x2="70" y1="20" y2="80"></line>
                  </svg>
                </div>
              </div>

              {/* Pinned Project */}
              <div className="p-6 rounded-2xl bg-[#111418] border border-[#283039] flex flex-col gap-4 group hover:border-[#137fec]/30 transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-display font-bold text-lg">Pinned Project</h3>
                  <span className="px-2 py-0.5 rounded bg-[#137fec]/20 text-[#137fec] text-[10px] font-bold">NEW</span>
                </div>
                <div className="aspect-video w-full rounded-lg bg-[#1c2127] overflow-hidden relative border border-[#283039]">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiHFWxlW_BZN_vKKSye2_AhphkJT6V71Es2-HXBgvU7VOZPyMJLv0Ll65u2xnSchTuFIDWxVWEt_fjydwvLRpxAVQ6iTtCUm4M50VcO0aiX4lw5FyD3Oo-obJIJRS-cdK4Jhs_OqGvq5JACdrWa_Az7guvJmOztEwKeDksLjZS96NoC0hdRqGl12f5FWcltjmE7k5V0Q5RV9Yl_fArVXthuc05KlsuMXUX4eygovPE-sXOFcsek0TsdEwA21GsrKDzjdI4nvHqfj9X')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <span className="text-white font-bold text-sm block">DeFi Liquidity Aggregator</span>
                    <span className="text-gray-400 text-[10px]">Deployed on Optimism</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="p-6 rounded-2xl bg-[#111418] border border-[#283039] flex flex-col gap-3">
              <h3 className="text-white font-display font-bold text-lg">About</h3>
              <p className="text-[#9dabb9] text-sm leading-relaxed">
                I build decentralized applications that scale. With a background in distributed systems and a passion for zero-knowledge proofs, I help teams bridge the gap between theoretical cryptography and production-ready code. Currently focused on Layer 2 scaling solutions and AI-driven smart contract auditing tools.
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-[#111418] border border-[#283039] flex flex-col gap-5 sticky top-0 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#283039]">
                <h3 className="text-xs uppercase font-bold text-[#9dabb9] tracking-wider">Interact</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-500 font-bold">Online</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold shadow-[0_0_20px_rgba(19,127,236,0.25)] hover:shadow-[0_0_25px_rgba(19,127,236,0.4)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="material-symbols-outlined group-hover:animate-bounce">waving_hand</span>
                <span>Hire Me / Connect</span>
              </button>
              <button className="w-full py-4 rounded-xl bg-transparent border border-[#283039] hover:bg-[#1c2127] hover:border-emerald-500/50 text-white font-bold transition-all flex items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-emerald-500 group-hover:scale-110 transition-transform">verified</span>
                <span>Endorse Skills</span>
              </button>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="p-3 rounded-lg bg-[#1c2127] border border-[#283039] text-center group hover:border-[#137fec]/30 transition-colors">
                  <div className="text-xl font-bold text-white font-display group-hover:text-[#137fec] transition-colors">98</div>
                  <div className="text-[10px] text-[#9dabb9] uppercase tracking-wider font-bold">Reputation</div>
                </div>
                <div className="p-3 rounded-lg bg-[#1c2127] border border-[#283039] text-center group hover:border-emerald-500/30 transition-colors">
                  <div className="text-xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors">156</div>
                  <div className="text-[10px] text-[#9dabb9] uppercase tracking-wider font-bold">Endorsements</div>
                </div>
              </div>
              <div className="space-y-3 pt-3 border-t border-[#283039]">
                <a className="flex items-center gap-3 text-sm text-[#9dabb9] hover:text-white transition-colors p-2 rounded hover:bg-[#1c2127]" href="#">
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  <span className="truncate">@alex_sterling</span>
                </a>
                <a className="flex items-center gap-3 text-sm text-[#9dabb9] hover:text-white transition-colors p-2 rounded hover:bg-[#1c2127]" href="#">
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                  <span className="truncate">github.com/sterling</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-[#9dabb9] p-2 rounded bg-[#1c2127]/50 border border-[#283039] justify-between group cursor-pointer hover:border-[#137fec]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-[#137fec]">account_balance_wallet</span>
                    <span className="font-mono text-xs">0x71C...9A2F</span>
                  </div>
                  <span className="material-symbols-outlined text-base group-hover:text-white">content_copy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardShareContent({ theme, setTheme }: { theme: 'cyberpunk' | 'academic', setTheme: (t: 'cyberpunk' | 'academic') => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-500">
      {/* Preview Column */}
      <div className="lg:col-span-7 flex flex-col items-center lg:items-start gap-4">
        <div className="flex items-center justify-between w-full max-w-[420px]">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider font-display text-[#137fec]/80">Preview</h3>
          <div className="flex items-center gap-2 text-xs text-[#9dabb9]">
            <span className="material-symbols-outlined text-sm">aspect_ratio</span>
            4:5 Vertical
          </div>
        </div>
        <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#137fec]/30 shadow-[0_0_15px_rgba(19,127,236,0.15)] bg-[#0b0e11] group select-none flex flex-col">
          <div className="absolute top-0 left-0 w-full p-6 z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center px-2 py-1 rounded bg-[#137fec]/20 border border-[#137fec]/30 text-[#137fec] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Latest Branch
                </div>
                <h2 className="text-white text-2xl font-bold font-display leading-tight drop-shadow-md">Smart Contracts</h2>
                <p className="text-gray-300 text-xs font-mono mt-1">Block Height: #18,294,002</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-white">hub</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiHFWxlW_BZN_vKKSye2_AhphkJT6V71Es2-HXBgvU7VOZPyMJLv0Ll65u2xnSchTuFIDWxVWEt_fjydwvLRpxAVQ6iTtCUm4M50VcO0aiX4lw5FyD3Oo-obJIJRS-cdK4Jhs_OqGvq5JACdrWa_Az7guvJmOztEwKeDksLjZS96NoC0hdRqGl12f5FWcltjmE7k5V0Q5RV9Yl_fArVXthuc05KlsuMXUX4eygovPE-sXOFcsek0TsdEwA21GsrKDzjdI4nvHqfj9X')" }}>
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b0e11] via-[#0b0e11]/60 to-transparent"></div>
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-80 mix-blend-screen">
            <div className="relative w-full h-full">
              <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-[#137fec] rounded-full shadow-[0_0_10px_#137fec] animate-pulse"></div>
              <div className="absolute top-[55%] right-[35%] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#137fec]/50" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line strokeDasharray="2 2" strokeWidth="0.5" x1="30" x2="65" y1="40" y2="55"></line>
              </svg>
            </div>
          </div>
          <div className="mt-auto relative z-20 p-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#283039]/80 backdrop-blur-md border border-white/5">
                <span className="material-symbols-outlined text-[#137fec] text-xs">lock_open</span>
                <span className="text-white text-xs font-bold">Smart Contracts</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#283039]/80 backdrop-blur-md border border-white/5">
                <span className="material-symbols-outlined text-emerald-400 text-xs">trending_up</span>
                <span className="text-white text-xs font-bold">L2 Scaling</span>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border-l-2 border-[#137fec]">
              <p className="text-gray-300 text-xs leading-relaxed italic">
                &quot;Velocity in backend logic increased by 40%. Unlocking &apos;Smart Contracts&apos; bridges frontend skills to chain architecture.&quot;
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold font-display tracking-wide uppercase">PraxisGrove</span>
                <span className="text-gray-500 text-[10px]">A Permissionless School</span>
              </div>
              <div className="h-24 w-24 bg-white rounded relative">
                <Image alt="QR Code" className="object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ZWvAyBrHZc0E7-3xBG89D30v81V13va7VWYVLB0k4t6d7iMicOX2dBlOVczLV_j1sEIgPKS-XTCNG6AjYYHTB8xb5rdXp9D5rUMSyQu2P6efFj26DpxFLq7K_VnSZsjbc8C5-mNUlQEBBgWPU5rVkx6MprQ1G0enhqEsFxR79u9cTrUR9C8uTSI3yq2Ny_LVdx4vRenDNP25IV5eHyp4OvK7VeE6xBEKHtHE7Onv-g6eDJ7MqPRLVKQrAP0IDxtgZ1LDnNPwHqCb" fill unoptimized />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Column */}
      <div className="lg:col-span-5 flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <h4 className="text-[#9dabb9] text-xs font-bold uppercase tracking-wider">New Milestones Extracted</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1c2127] border border-[#283039]">
              <div className="h-8 w-8 rounded-full bg-[#137fec]/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#137fec] text-sm">lock_open</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold">Node Unlocked: Smart Contracts</span>
                <span className="text-[#9dabb9] text-xs">Core architecture branch</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1c2127] border border-[#283039]">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-emerald-400 text-sm">vertical_align_bottom</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold">Depth Gained: L2 Scaling</span>
                <span className="text-[#9dabb9] text-xs">Rollups & Optimism understanding</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1c2127] border border-[#283039]">
              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-purple-400 text-sm">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold">Project Shipped: DeFi Dashboard</span>
                <span className="text-[#9dabb9] text-xs">React + Ethers.js integration</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[#9dabb9] text-xs font-bold uppercase tracking-wider">Visual Theme</h4>
          <div className="flex p-1 bg-[#1c2127] rounded-lg border border-[#283039]">
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" 
                name="theme" 
                value="cyberpunk" 
                className="peer sr-only" 
                checked={theme === 'cyberpunk'}
                onChange={() => setTheme('cyberpunk')}
              />
              <div className="flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-[#9dabb9] peer-checked:bg-[#283039] peer-checked:text-white peer-checked:shadow-sm transition-all">
                <span className="material-symbols-outlined text-base">blur_on</span>
                Cyberpunk
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" 
                name="theme" 
                value="academic" 
                className="peer sr-only"
                checked={theme === 'academic'}
                onChange={() => setTheme('academic')}
              />
              <div className="flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-[#9dabb9] peer-checked:bg-[#283039] peer-checked:text-white peer-checked:shadow-sm transition-all">
                <span className="material-symbols-outlined text-base">school</span>
                Academic
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-[#9dabb9] text-xs font-bold uppercase tracking-wider">AI Growth Narrative</h4>
            <span className="bg-[#137fec]/20 text-[#137fec] text-[10px] px-2 py-0.5 rounded font-bold">GENERATED</span>
          </div>
          <div className="p-4 rounded-xl bg-[#1c2127] border border-[#283039] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#137fec] to-transparent"></div>
            <p className="text-gray-300 text-sm leading-relaxed font-normal">
              <span className="text-[#137fec] font-bold">Insight:</span> Your velocity in backend logic has increased by <span className="text-white font-bold">40%</span> this week. Unlocking <span className="text-white font-bold">&apos;Smart Contracts&apos;</span> effectively bridges the gap between your established frontend skills and decentralized blockchain architecture.
            </p>
          </div>
        </div>

        <div className="flex-1"></div>
        <div className="flex flex-col gap-3 pt-4 border-t border-[#283039]">
          <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold text-base transition-all shadow-[0_0_15px_rgba(19,127,236,0.3)] hover:shadow-[0_0_20px_rgba(19,127,236,0.5)]">
            <span className="material-symbols-outlined">download</span>
            Save Image
          </button>
          <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#283039] hover:bg-[#3b4754] text-white font-bold text-base transition-all">
            <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            Share to X
          </button>
        </div>
      </div>
    </div>
  );
}

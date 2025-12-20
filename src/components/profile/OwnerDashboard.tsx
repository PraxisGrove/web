'use client';

import React, { useEffect, useState } from 'react';
import SettingsModal from './SettingsModal';

export default function OwnerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-profile-bg-light dark:bg-profile-bg-dark min-h-screen text-white flex flex-col font-sans">
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
        }
        .grid-card {
          background-color: var(--color-profile-card);
          border: 1px solid var(--color-profile-border);
          border-radius: 1rem;
          overflow: hidden;
        }
        .text-gradient {
          background: linear-gradient(to right, #fff, #9dabb9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-profile-bg-dark);
        }
        ::-webkit-scrollbar-thumb {
          background: #283039;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3b4754;
        }
        .mask-image-b {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
      `}</style>

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="grid-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-glow-sm relative group overflow-visible gap-4">
            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-xl w-16 h-16 shadow-glow ring-1 ring-white/10"
                    data-alt="3D stylized digital avatar with blue glowing accents"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAeWjwnyDPeuEl7vZXtMrOplVF3nXzmJ24JarYLEos-ei-ot-x8o_8drs9n6hsqu0fSk3VsYtpKZBggg6DbrmQbyj8nvXOxbDKZ-CLtOw9iW1fABtFTKA-YXxE2m8lhH3WhzAxwurudW1JQwIIa-PR2ZbpKR9E0ramhNV1tcjqOP9W6Dw81A8TvS6bv68U_Stu2zC8IHYqPGRcy9ppPgzudo4CrFNjUCWNOfT1khzGgAPuqAj3d39iJEDFRgN0C5mLzus5CMEbaerLF")',
                    }}
                  ></div>
                  <div className="absolute -bottom-1 -right-1 bg-[#161b22] p-0.5 rounded-full border border-white/10">
                    <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-[#161b22]"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white text-xl font-bold tracking-tight">
                    0xAlice.eth
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-profile-primary font-mono text-xs bg-profile-primary/10 px-2 py-0.5 rounded border border-profile-primary/20">
                      0x71C...9A2
                    </p>
                    <span className="text-gray-500 text-xs">•</span>
                    <p className="text-gray-400 text-xs">Level 42 Architect</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-6 h-10">
              <a
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors group/icon"
                href="#"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors group/icon"
                href="#"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
              <a
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors group/icon"
                href="#"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"></path>
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button className="flex-shrink-0 h-10 bg-profile-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(19,127,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,127,236,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 px-4 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">
                  ios_share
                </span>
                Share
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="flex-shrink-0 h-10 w-10 border border-white/10 hover:border-white/30 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  settings
                </span>
              </button>
            </div>
          </div>

          {/* Middle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Skill Matrix */}
            <div className="grid-card p-6 flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-profile-primary text-sm">
                    hub
                  </span>
                  <h3 className="text-white font-medium text-sm tracking-wide">
                    Live Skill Matrix
                  </h3>
                </div>
                <span className="text-[10px] text-green-400 font-mono bg-green-400/10 px-2 py-1 rounded">
                  LIVE UPDATING
                </span>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <svg
                  className="w-full h-full max-h-[240px]"
                  viewBox="0 0 200 200"
                >
                  <polygon
                    fill="none"
                    points="100,20 176,64 176,152 100,196 24,152 24,64"
                    stroke="#283039"
                    strokeWidth="1"
                  ></polygon>
                  <polygon
                    fill="none"
                    points="100,50 150,79 150,137 100,166 50,137 50,79"
                    stroke="#283039"
                    strokeWidth="1"
                  ></polygon>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="100"
                    y1="100"
                    y2="20"
                  ></line>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="176"
                    y1="100"
                    y2="64"
                  ></line>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="176"
                    y1="100"
                    y2="152"
                  ></line>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="100"
                    y1="100"
                    y2="196"
                  ></line>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="24"
                    y1="100"
                    y2="152"
                  ></line>
                  <line
                    stroke="#283039"
                    strokeWidth="1"
                    x1="100"
                    x2="24"
                    y1="100"
                    y2="64"
                  ></line>
                  <polygon
                    fill="rgba(19, 127, 236, 0.2)"
                    filter="url(#glow)"
                    points="100,30 165,75 140,130 100,180 40,140 60,80"
                    stroke="#137fec"
                    strokeWidth="2"
                  ></polygon>
                  <circle
                    className="animate-pulse"
                    cx="100"
                    cy="30"
                    fill="#fff"
                    r="3"
                  ></circle>
                  <circle cx="165" cy="75" fill="#fff" r="3"></circle>
                  <circle cx="140" cy="130" fill="#fff" r="3"></circle>
                  <circle cx="100" cy="180" fill="#fff" r="3"></circle>
                  <circle cx="40" cy="140" fill="#fff" r="3"></circle>
                  <circle cx="60" cy="80" fill="#fff" r="3"></circle>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="middle"
                    x="100"
                    y="15"
                  >
                    Solidity
                  </text>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="start"
                    x="185"
                    y="65"
                  >
                    React
                  </text>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="start"
                    x="185"
                    y="155"
                  >
                    DeFi
                  </text>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="middle"
                    x="100"
                    y="210"
                  >
                    Rust
                  </text>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="end"
                    x="15"
                    y="155"
                  >
                    ZK-Rollups
                  </text>
                  <text
                    fill="#9dabb9"
                    fontFamily="Inter"
                    fontSize="10"
                    textAnchor="end"
                    x="15"
                    y="65"
                  >
                    IPFS
                  </text>
                  <defs>
                    <filter
                      height="140%"
                      id="glow"
                      width="140%"
                      x="-20%"
                      y="-20%"
                    >
                      <feGaussianBlur
                        result="blur"
                        stdDeviation="3"
                      ></feGaussianBlur>
                      <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                      ></feComposite>
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Knowledge Heatmap */}
            <div className="grid-card p-6 flex flex-col min-h-[320px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-profile-primary text-sm">
                    grid_view
                  </span>
                  <h3 className="text-white font-medium text-sm tracking-wide">
                    Knowledge Heatmap
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span>Less</span>
                  <div className="w-2 h-2 rounded-[2px] bg-[#283039]"></div>
                  <div className="w-2 h-2 rounded-[2px] bg-profile-primary/40"></div>
                  <div className="w-2 h-2 rounded-[2px] bg-profile-primary"></div>
                  <span>More</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex gap-1 overflow-hidden h-[160px] w-full mask-image-b">
                  <div className="flex flex-1 gap-1 justify-between opacity-80">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-1 w-full">
                        {Array.from({ length: 7 }).map((_, j) => {
                          const opacity =
                            Math.random() > 0.6
                              ? Math.random() > 0.8
                                ? 'bg-profile-primary'
                                : 'bg-profile-primary/40'
                              : 'bg-[#283039]';
                          return (
                            <div
                              key={j}
                              className={`aspect-square rounded-[2px] ${opacity} w-full transition-colors hover:ring-1 hover:ring-white`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                      Total Contributions
                    </p>
                    <p className="text-2xl font-mono text-white">1,492</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                      Current Streak
                    </p>
                    <p className="text-white font-mono text-sm">12 Days 🔥</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain Footprint */}
            <div className="grid-card p-6 flex flex-col justify-between min-h-[320px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-profile-primary text-sm">
                    wallet
                  </span>
                  <h3 className="text-white font-medium text-sm tracking-wide">
                    On-Chain Footprint
                  </h3>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-sm">
                    more_horiz
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-[#101922] p-4 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-profile-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                      <span className="material-symbols-outlined text-lg">
                        verified
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Identity Score</p>
                      <p className="text-lg font-bold text-white group-hover:text-profile-primary transition-colors">
                        850
                        <span className="text-sm font-normal text-gray-500">
                          /1000
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/5"></div>
                  <div className="text-right">
                    <p className="text-xs text-green-400 font-mono">+12%</p>
                    <p className="text-[10px] text-gray-500">vs last month</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#101922] p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Linked Assets</p>
                    <p className="text-xl font-mono text-white">$142.5k</p>
                  </div>
                  <div className="bg-[#101922] p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">DAO Votes</p>
                    <p className="text-xl font-mono text-white">47</p>
                  </div>
                </div>
                <div className="mt-2 bg-gradient-to-r from-profile-primary/20 to-transparent p-4 rounded-xl border border-profile-primary/20 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold text-profile-primary uppercase tracking-widest">
                      Next Milestone
                    </span>
                    <span className="text-xs text-white">92%</span>
                  </div>
                  <p className="relative z-10 text-sm font-medium text-white mt-1">
                    Governance Steward Level 2
                  </p>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-profile-primary/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verified Credentials */}
            <div className="grid-card p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium text-sm tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-profile-primary text-sm">
                    workspace_premium
                  </span>
                  Verified Credentials (SBTs)
                </h3>
                <a
                  className="text-xs text-profile-primary hover:text-white transition-colors"
                  href="#"
                >
                  View All
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-[#283039] flex items-center justify-center flex-shrink-0 group-hover:bg-profile-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-profile-primary">
                      code
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-sm font-bold">
                      ETHGlobal Hackathon
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Finalist • ZK Track
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-500 text-[14px]">
                        check_circle
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        0x8a...2b1 Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-[#283039] flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-purple-400">
                      school
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-sm font-bold">
                      Advanced Solidity
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">Metacrafters</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-500 text-[14px]">
                        check_circle
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        0x4c...9d3 Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-[#283039] flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-orange-400">
                      token
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-sm font-bold">
                      Gitcoin Donor
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      GR15 Contributor
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-500 text-[14px]">
                        check_circle
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        0x1f...5a9 Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-[#283039] flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-teal-400">
                      group
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-sm font-bold">
                      Lens Profile
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Early Adopter
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-500 text-[14px]">
                        check_circle
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        0x9e...3c2 Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-[#283039] flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <span className="material-symbols-outlined text-white/50 group-hover:text-cyan-400">
                      gavel
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-white text-sm font-bold">
                      DAO Contributor
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Uniswap Governance
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-green-500 text-[14px]">
                        check_circle
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        0x1b...7c8 Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cultural Fingerprint */}
            <div className="grid-card p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium text-sm tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-profile-primary text-sm">
                    fingerprint
                  </span>
                  Cultural Fingerprint
                </h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  AI Signals
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                <div
                  className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                  data-alt="Book cover: Snow Crash"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyDMa5ZMJQw2rJ1S30hJcV84mqTNca0cuHDk8cqQftBAfqpgh-Ic2EzBGFj-FC5URZyUzhX3euRXwYCEYKON6MMEz_pWy9a7acGX2IUM2Ni_SBaBHY3DnMve6PXJKQClcfVlklhxrHZOLUfgC2GQv0rqw9EBUpboKqZvFT2meGMBFCOs9DulaIyWAbfvt6V2XWI4oxUK7Ugmm3k41oiocJd1tcrjNP-zxU3Nt_2TKMTUbH5WSIRFgmvPQ4RRC0R9ISr85RMjLleehm")',
                  }}
                ></div>
                <div
                  className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                  data-alt="Movie poster: Blade Runner style"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2YuXRpGy1H6Jpa_WkESPRrq9o2_U0PA-gVMsiVf0OC6JiWYuD-SGQqyNKQrUIEr_JC93SjpNaLLiQ2hGjMPs15zVeUh_AxBUJJGLXN2twsV4SqyaOdVc5n8i5V9erBmJwAs__BiFEx8Cr5CncIIGUSklxbdlElRa4hGoE8hpF6MT22xx5DZjsg_vuE4NjYNT2kwE_Md_7GZS8i5FwA8RrxWAMyZgUZpN6BcuYIsAD760eoiIcZevfuPIQQsJunQR2KzrEFbx0oon7")',
                  }}
                ></div>
                <div
                  className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                  data-alt="Abstract album art"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAo2sX6dWYFU55YvCsm2yBl8a5bzhBaoOyzNcmu_4VoBUPjC231BXF9vwllgIEeR-yHSatCiuxgwkBVIrmjdX6G7TDESwQ9Vec-VG0Ij3cKtvOrmO-CodH50pq6742_CQCSmLTGt5bAzOWF_X2Jv1j20zK1whwMWEy5J584Mxmath_vavNmHNLZ22N5gWwJUO1izmBj8_ZmsPWuDvOq8m4He9dAs6QhoyTw-2mzjbOPLWAAyQ7sPMry6xBQmpa-T-U7pGRj3Pyny4xm")',
                  }}
                ></div>
                <div
                  className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                  data-alt="Book cover: Clean code"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOu6qXbeq11UEbid2qITnR5R5don6lgl0sNzXpKXLjCvrfWRMKXLbwXqaFbxtNmF5LjojY130JcV7n2lsaJso4I1rBIPA9L84RF03SZk9dkFGhyRPgSaeg9sfcWJgbGNNXHZhXnzm8citma1ScL6fUZL_K75NMjLkw_pv4URoU_XfbHV5B7nVX1VnyLdXY5vmwgRTVrjBAIC67n346IcRI_3-GVq8YlIu161I0G_-o2BhxupYyDXYLMjR-j4fBPxMGoPzB58GlT4QH")',
                  }}
                ></div>
                <div
                  className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10 hidden sm:block"
                  data-alt="Sci-fi landscape art"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMm_4k-lKY-3SO82785z4FpjNY4aHPR93UOabQubE9yz1b7wp3He3TnSFPnjctwOxGSyW9_BiSZcyLGN_CAiH3CTpswup8ZDLsIQfXilh_6M9Xt5Poo-MbtugeLHQ07fbVTkgcM-1Z1wyx2AmQyjrk73SmZ98J7dXbgga894-fuJZYJ378_KwXRK5TaTCcQQbr4BqFypk5Nd0c6E93DcVQag4vNKLWvrP8r7XWNaNJPg57aR_O7bibrCZIqc1i8BE04fFCy0Ezyf0n")',
                  }}
                ></div>
                <div className="aspect-[2/3] rounded-lg bg-[#283039] flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border border-dashed border-white/20">
                  <span className="material-symbols-outlined text-2xl">
                    add
                  </span>
                  <span className="text-[10px] mt-1">Add</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                  #Cyberpunk
                </span>
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                  #HardSciFi
                </span>
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                  #Cryptography
                </span>
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
                  #ElectronicMusic
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-profile-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';

export default function OwnerDashboard() {
  const [mounted, setMounted] = useState(false);

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          {/* Profile Header */}
          <div className="grid-card col-span-12 lg:col-span-9 p-8 shadow-glow-sm relative group overflow-visible">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <span className="material-symbols-outlined text-white/20 text-[100px] leading-none select-none">
                fingerprint
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-2xl w-32 h-32 md:w-40 md:h-40 shadow-glow ring-1 ring-white/10"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAeWjwnyDPeuEl7vZXtMrOplVF3nXzmJ24JarYLEos-ei-ot-x8o_8drs9n6hsqu0fSk3VsYtpKZBggg6DbrmQbyj8nvXOxbDKZ-CLtOw9iW1fABtFTKA-YXxE2m8lhH3WhzAxwurudW1JQwIIa-PR2ZbpKR9E0ramhNV1tcjqOP9W6Dw81A8TvS6bv68U_Stu2zC8IHYqPGRcy9ppPgzudo4CrFNjUCWNOfT1khzGgAPuqAj3d39iJEDFRgN0C5mLzus5CMEbaerLF")',
                    }}
                  ></div>
                  <div className="absolute -bottom-2 -right-2 bg-[#161b22] p-1 rounded-full border border-white/10">
                    <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-[#161b22]"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 justify-center gap-2">
                <div className="flex flex-col">
                  <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
                    0xAlice.eth
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-profile-primary font-mono text-sm bg-profile-primary/10 px-2 py-0.5 rounded border border-profile-primary/20">
                      0x71C...9A2
                    </p>
                    <span className="text-gray-500 text-xs">•</span>
                    <p className="text-gray-400 text-sm">Level 42 Architect</p>
                  </div>
                </div>
                <p className="text-gray-300 text-base font-normal leading-relaxed max-w-2xl mt-2">
                  AI-Augmented Web3 Builder specializing in Zero Knowledge
                  proofs and DeFi infrastructure. Currently synthesizing
                  cross-chain identity protocols.
                </p>
                <div className="mt-6 w-full max-w-xl">
                  <label className="flex flex-col w-full relative group/input">
                    <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-profile-primary/30 bg-[#101922] focus-within:border-profile-primary focus-within:ring-1 focus-within:ring-profile-primary/50 transition-all duration-300 shadow-inner">
                      <div className="flex items-center justify-center pl-4 text-profile-primary animate-pulse">
                        <span className="material-symbols-outlined">
                          auto_awesome
                        </span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-white focus:outline-0 h-14 placeholder:text-gray-500 px-4 text-base font-medium font-mono"
                        placeholder="Paste GitHub or project URL to analyze..."
                      />
                      <button className="bg-profile-primary/10 hover:bg-profile-primary text-profile-primary hover:text-white px-5 m-1 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer">
                        Analyze
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                    <div className="absolute -bottom-6 left-1 flex items-center gap-2 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500">
                      <div className="flex gap-1">
                        <span
                          className="w-1 h-1 bg-profile-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-profile-primary rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-profile-primary rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></span>
                      </div>
                      <span className="text-xs text-profile-primary font-mono">
                        Neural engine ready for input
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Control Center */}
          <div className="grid-card col-span-12 lg:col-span-3 p-6 flex flex-col justify-between h-full bg-[#161b22]/50">
            <div className="flex flex-col gap-4">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                Control Center
              </h3>
              <div className="flex gap-3">
                <button className="flex-1 h-12 bg-profile-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(19,127,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,127,236,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">
                    ios_share
                  </span>
                  Share View
                </button>
                <button className="h-12 w-12 border border-white/10 hover:border-white/30 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all cursor-pointer">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4">
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>Profile Completeness</span>
                <span className="text-white">85%</span>
              </div>
              <div className="w-full bg-[#101922] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-profile-primary h-1.5 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Live Skill Matrix */}
          <div className="grid-card col-span-12 md:col-span-6 lg:col-span-4 p-6 flex flex-col min-h-[320px]">
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
              <svg className="w-full h-full max-h-[240px]" viewBox="0 0 200 200">
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
          <div className="grid-card col-span-12 md:col-span-6 lg:col-span-4 p-6 flex flex-col min-h-[320px]">
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
          <div className="grid-card col-span-12 lg:col-span-4 p-6 flex flex-col justify-between min-h-[320px]">
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

          {/* Verified Credentials */}
          <div className="grid-card col-span-12 lg:col-span-6 p-6">
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
                  <h4 className="text-white text-sm font-bold">Lens Profile</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Early Adopter</p>
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
            </div>
          </div>

          {/* Cultural Fingerprint */}
          <div className="grid-card col-span-12 lg:col-span-6 p-6">
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
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyDMa5ZMJQw2rJ1S30hJcV84mqTNca0cuHDk8cqQftBAfqpgh-Ic2EzBGFj-FC5URZyUzhX3euRXwYCEYKON6MMEz_pWy9a7acGX2IUM2Ni_SBaBHY3DnMve6PXJKQClcfVlklhxrHZOLUfgC2GQv0rqw9EBUpboKqZvFT2meGMBFCOs9DulaIyWAbfvt6V2XWI4oxUK7Ugmm3k41oiocJd1tcrjNP-zxU3Nt_2TKMTUbH5WSIRFgmvPQ4RRC0R9ISr85RMjLleehm")',
                }}
              ></div>
              <div
                className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2YuXRpGy1H6Jpa_WkESPRrq9o2_U0PA-gVMsiVf0OC6JiWYuD-SGQqyNKQrUIEr_JC93SjpNaLLiQ2hGjMPs15zVeUh_AxBUJJGLXN2twsV4SqyaOdVc5n8i5V9erBmJwAs__BiFEx8Cr5CncIIGUSklxbdlElRa4hGoE8hpF6MT22xx5DZjsg_vuE4NjYNT2kwE_Md_7GZS8i5FwA8RrxWAMyZgUZpN6BcuYIsAD760eoiIcZevfuPIQQsJunQR2KzrEFbx0oon7")',
                }}
              ></div>
              <div
                className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAo2sX6dWYFU55YvCsm2yBl8a5bzhBaoOyzNcmu_4VoBUPjC231BXF9vwllgIEeR-yHSatCiuxgwkBVIrmjdX6G7TDESwQ9Vec-VG0Ij3cKtvOrmO-CodH50pq6742_CQCSmLTGt5bAzOWF_X2Jv1j20zK1whwMWEy5J584Mxmath_vavNmHNLZ22N5gWwJUO1izmBj8_ZmsPWuDvOq8m4He9dAs6QhoyTw-2mzjbOPLWAAyQ7sPMry6xBQmpa-T-U7pGRj3Pyny4xm")',
                }}
              ></div>
              <div
                className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBOu6qXbeq11UEbid2qITnR5R5don6lgl0sNzXpKXLjCvrfWRMKXLbwXqaFbxtNmF5LjojY130JcV7n2lsaJso4I1rBIPA9L84RF03SZk9dkFGhyRPgSaeg9sfcWJgbGNNXHZhXnzm8citma1ScL6fUZL_K75NMjLkw_pv4URoU_XfbHV5B7nVX1VnyLdXY5vmwgRTVrjBAIC67n346IcRI_3-GVq8YlIu161I0G_-o2BhxupYyDXYLMjR-j4fBPxMGoPzB58GlT4QH")',
                }}
              ></div>
              <div
                className="aspect-[2/3] rounded-lg bg-cover bg-center hover:scale-105 transition-transform cursor-pointer border border-white/10 hidden sm:block"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMm_4k-lKY-3SO82785z4FpjNY4aHPR93UOabQubE9yz1b7wp3He3TnSFPnjctwOxGSyW9_BiSZcyLGN_CAiH3CTpswup8ZDLsIQfXilh_6M9Xt5Poo-MbtugeLHQ07fbVTkgcM-1Z1wyx2AmQyjrk73SmZ98J7dXbgga894-fuJZYJ378_KwXRK5TaTCcQQbr4BqFypk5Nd0c6E93DcVQag4vNKLWvrP8r7XWNaNJPg57aR_O7bibrCZIqc1i8BE04fFCy0Ezyf0n")',
                }}
              ></div>
              <div className="aspect-[2/3] rounded-lg bg-[#283039] flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors cursor-pointer border border-dashed border-white/20">
                <span className="material-symbols-outlined text-2xl">add</span>
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
      </main>
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-profile-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

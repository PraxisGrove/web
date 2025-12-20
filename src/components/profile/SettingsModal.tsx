import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile Settings', icon: 'badge' },
  { id: 'ai-engine', label: 'AI Engine & Compute', icon: 'memory' },
  { id: 'interface-privacy', label: 'Interface & Privacy', icon: 'tune' },
  { id: 'external-links', label: 'External Links', icon: 'link' },
  { id: 'deployment-roadmap', label: 'Deployment & Roadmap', icon: 'rocket_launch' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (!isOpen) return;

    const observerOptions = {
      root: contentRef.current,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    NAV_ITEMS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        sectionRefs.current.set(id, section);
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section && contentRef.current) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1015]/80 backdrop-blur-md p-4 overflow-y-auto settings-modal">
      <style>{`
        .settings-modal ::-webkit-scrollbar { width: 8px; }
        .settings-modal ::-webkit-scrollbar-track { background: #111418; }
        .settings-modal ::-webkit-scrollbar-thumb { background: #3b4754; border-radius: 4px; }
        .settings-modal ::-webkit-scrollbar-thumb:hover { background: #4e5d6d; }
      `}</style>
      <div className="relative w-full max-w-4xl flex flex-col bg-[#111418] rounded-2xl shadow-2xl border border-[#293038] overflow-hidden my-8 h-[80vh]">
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-[#293038] flex-shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-2xl font-bold leading-tight tracking-tight">Settings</h1>
            <p className="text-[#9dabb9] text-sm font-normal">Control your compute, privacy, and future deployment options.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <nav className="flex flex-col w-64 bg-[#111418] border-r border-[#293038] p-6 flex-shrink-0 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ id, label, icon }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? 'text-white bg-[#1c2127]'
                        : 'text-[#9dabb9] hover:bg-[#1c2127]'
                    }`}
                    href={`#${id}`}
                    onClick={(e) => handleNavClick(e, id)}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#137fec]' : ''}`}>
                      {icon}
                    </span>
                    {label}
                  </a>
                );
              })}
            </div>
            <div className="mt-auto pt-6 border-t border-[#293038]">
              <button className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-all duration-300 shadow-sm group">
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">logout</span>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
          <div className="flex-1 flex flex-col">
            <div ref={contentRef} className="flex flex-col p-6 md:p-8 gap-8 overflow-y-auto flex-1 scroll-smooth">
              <section className="flex flex-col gap-6" id="profile">
                <div className="flex items-center gap-2 pb-2 border-b border-[#293038]/50">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">badge</span>
                  <h3 className="text-white text-lg font-bold leading-tight">Profile Settings</h3>
                </div>
                <p className="text-[#9dabb9] text-sm -mt-4">Update your personal profile that will be used across the platform.</p>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative group cursor-pointer flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-[#1c2127] border-2 border-[#3b4754] overflow-hidden relative">
                      <Image alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJwnsjiDOxv3YOZ0IRArGpN1EB8KJm3OyAcl8xNyqZOgm9Uwk3uhcM7gY31kDBFSQyB-zwE_VBmZvEar9bLw2U7x2yeJlaVXm_WuT7Y6NMfX2-79BA1pJASyrpYbvR8MJiEJNZoB3kkYDs4U4jFjRry2bq4d1sE0dScgNnOR2qtlkLxUUPhJTRdpyKplaed1Ugp0rxdH1Q9oPwJuytJXtNTpgnNPPhCwvpG0oadZRxN1LqlMK6q5d6yxz30HAcmGDqSSuFUbyTEedI" fill unoptimized />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-sm">edit</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-white text-xs font-medium uppercase tracking-wider text-[#9dabb9]">Display Name</label>
                        <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" type="text" defaultValue="Alex Quant" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-white text-xs font-medium uppercase tracking-wider text-[#9dabb9]">Short Bio</label>
                        <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" type="text" defaultValue="Building the future of decentralized compute." />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button className="px-3 py-1.5 rounded-md bg-[#137fec]/10 text-[#137fec] text-xs font-medium hover:bg-[#137fec]/20 transition-colors border border-[#137fec]/20">Save Profile</button>
                      <button className="px-3 py-1.5 rounded-md text-[#9dabb9] text-xs font-medium hover:text-white transition-colors hover:bg-[#1c2127]">Cancel</button>
                    </div>
                  </div>
                </div>
              </section>
              <div className="h-px w-full bg-[#293038]"></div>
              <section className="flex flex-col gap-4" id="ai-engine">
                <div className="flex items-center gap-2 pb-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">memory</span>
                  <h3 className="text-white text-lg font-bold leading-tight">AI Engine & Compute</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">AI Model</label>
                  <div className="relative">
                    <select className="w-full h-12 bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-4 pr-10 appearance-none focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all">
                      <option value="gpt4">GPT-4</option>
                      <option value="claude">Claude 3.5 Sonnet</option>
                      <option value="gpt3">GPT-3.5 Turbo</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9dabb9]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  <p className="text-[#9dabb9] text-xs">Choose the AI model powering your experience.</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between">
                    <label className="text-white text-sm font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#9dabb9]">lock</span>
                      OpenAI API Key
                    </label>
                    <span className="text-[#137fec] text-xs cursor-pointer hover:underline">Where to find?</span>
                  </div>
                  <div className="flex w-full items-stretch rounded-lg">
                    <input className="flex-1 bg-[#1c2127] border border-[#3b4754] border-r-0 rounded-l-lg text-white px-4 h-12 placeholder:text-[#9dabb9] focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] focus:z-10 font-mono tracking-widest text-sm" placeholder="sk-••••••••••••••••" type="password" defaultValue="sk-89sfd78sfd789saf78" />
                    <button className="flex items-center justify-center px-4 bg-[#1c2127] border border-[#3b4754] border-l-0 rounded-r-lg text-[#9dabb9] hover:text-white transition-colors group">
                      <span className="material-symbols-outlined group-hover:text-white">visibility_off</span>
                    </button>
                  </div>
                  <p className="text-[#9dabb9] text-xs">Use your own API key for higher rate limits or access to specific models.</p>
                </div>
              </section>
              <div className="h-px w-full bg-[#293038]"></div>
              <section className="flex flex-col gap-5" id="interface-privacy">
                <div className="flex items-center gap-2 pb-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">tune</span>
                  <h3 className="text-white text-lg font-bold leading-tight">Interface & Privacy</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">Show &quot;SBT Wall&quot;</span>
                      <span className="text-[#9dabb9] text-xs">Display your Soulbound Tokens on profile.</span>
                    </div>
                    <button aria-checked="true" className="bg-[#137fec] relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:ring-offset-2" role="switch" type="button">
                      <span aria-hidden="true" className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">Show &quot;Cultural Fingerprint&quot;</span>
                      <span className="text-[#9dabb9] text-xs">Visualize interaction history as data art.</span>
                    </div>
                    <button aria-checked="false" className="bg-[#3b4754] relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#137fec] focus:ring-offset-2" role="switch" type="button">
                      <span aria-hidden="true" className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Theme Mode</label>
                    <div className="flex p-1 bg-[#1c2127] rounded-lg border border-[#3b4754]">
                      <button className="flex-1 py-1.5 px-3 rounded text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">Light</button>
                      <button className="flex-1 py-1.5 px-3 rounded text-sm font-medium bg-[#137fec]/20 text-white shadow-sm ring-1 ring-white/10">Dark</button>
                      <button className="flex-1 py-1.5 px-3 rounded text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">System</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Language</label>
                    <div className="relative">
                      <select className="w-full h-[42px] bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 pr-10 text-sm appearance-none focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec]">
                        <option value="en">English</option>
                        <option value="zh">Chinese</option>
                        <option value="jp">Japanese</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9dabb9]">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="h-px w-full bg-[#293038]"></div>
              <section className="flex flex-col gap-5" id="external-links">
                <div className="flex items-center gap-2 pb-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">link</span>
                  <h3 className="text-white text-lg font-bold leading-tight">External Links</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-yellow-500">currency_bitcoin</span>
                    ICoin / Web3 Address
                    <span className="ml-auto text-[10px] font-bold text-[#137fec] bg-[#137fec]/10 px-2 py-0.5 rounded border border-[#137fec]/20 uppercase tracking-wide">Featured</span>
                  </label>
                  <div className="relative">
                    <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all font-mono" placeholder="Enter your ICoin payment address or profile URL" type="text" defaultValue="0x71C...9A23" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#137fec] cursor-pointer hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                  </div>
                  <p className="text-[#9dabb9] text-xs">This address will be highlighted on your profile for seamless transactions.</p>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-end pb-1">
                    <label className="text-white text-sm font-medium">Profile Links</label>
                    <button className="text-[#137fec] text-xs font-medium hover:text-white transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      Add New Link
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start group">
                      <div className="pt-2.5 text-[#9dabb9] cursor-move opacity-50 group-hover:opacity-100 hover:text-white transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" placeholder="Title" type="text" defaultValue="Twitter / X" />
                        </div>
                        <div className="relative flex items-center">
                          <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" placeholder="URL" type="text" defaultValue="https://x.com/alexquant" />
                        </div>
                      </div>
                      <button className="mt-2 text-[#9dabb9] hover:text-red-400 p-1.5 rounded-lg hover:bg-[#1c2127] transition-colors border border-transparent hover:border-[#3b4754]">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                    <div className="flex gap-3 items-start group">
                      <div className="pt-2.5 text-[#9dabb9] cursor-move opacity-50 group-hover:opacity-100 hover:text-white transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" placeholder="Title" type="text" defaultValue="Portfolio" />
                        </div>
                        <div className="relative flex items-center">
                          <input className="w-full bg-[#1c2127] border border-[#3b4754] rounded-lg text-white px-3 py-2 text-sm focus:outline-none focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] transition-all" placeholder="URL" type="text" defaultValue="https://alexquant.io" />
                        </div>
                      </div>
                      <button className="mt-2 text-[#9dabb9] hover:text-red-400 p-1.5 rounded-lg hover:bg-[#1c2127] transition-colors border border-transparent hover:border-[#3b4754]">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 p-3 border border-dashed border-[#3b4754] rounded-lg bg-[#1c2127]/30 text-center text-[#9dabb9] text-xs hover:bg-[#1c2127]/50 hover:text-white hover:border-[#9dabb9] transition-all cursor-pointer">
                    Drag and drop to reorder your links.
                  </div>
                </div>
              </section>
              <div className="h-px w-full bg-[#293038]"></div>
              <section className="flex flex-col gap-4" id="deployment-roadmap">
                <div className="flex items-center gap-2 pb-2">
                  <span className="material-symbols-outlined text-[#137fec] text-[20px]">rocket_launch</span>
                  <h3 className="text-white text-lg font-bold leading-tight">Deployment & Roadmap</h3>
                </div>
                <div className="relative group border border-dashed border-[#3b4754] bg-[#1c2127]/40 hover:bg-[#1c2127]/60 rounded-xl p-5 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#9dabb9]">public</span>
                      <span className="text-white font-semibold">Deploy Personal Website</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#137fec]/20 text-[#137fec] text-[10px] font-bold uppercase tracking-wider border border-[#137fec]/20">Beta</span>
                  </div>
                  <p className="text-[#9dabb9] text-sm leading-relaxed pr-8">
                    Package your profile into a personal website and deploy it to GitHub Pages or IPFS. Your data, fully owned by you.
                  </p>
                  <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-4xl text-white">deployed_code</span>
                  </div>
                </div>
              </section>
            </div>
            <div className="p-6 md:px-8 md:py-6 border-t border-[#293038] bg-[#161b22] flex justify-end gap-3 flex-shrink-0">
              <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#1c2127] transition-colors">Cancel</button>
              <button className="px-5 py-2.5 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/25">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

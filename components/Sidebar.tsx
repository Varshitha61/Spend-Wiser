import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, Sparkles, Lightbulb, Menu, X, Zap, Cpu, ShieldCheck, TrendingUp, User, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  userEmail?: string;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  userEmail,
  userName,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Neural Overview', icon: LayoutDashboard },
    { id: 'wallets', label: 'Vault Access', icon: Wallet },
    { id: 'transactions', label: 'Ledger History', icon: CreditCard },
    { id: 'suggestions', label: 'AI Advisor', icon: Lightbulb },
    { id: 'investments', label: 'Investment Plans', icon: TrendingUp },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header - High Tech Interface */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 glass-panel flex items-center justify-between px-6 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-[1rem] flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] rotate-3">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="font-black text-white text-xl tracking-tighter uppercase text-glow">SpendWiser</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-2xl">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container - Floating Terminal */}
      <div className={`
        fixed inset-y-6 left-6 glass-panel w-72 rounded-[3.5rem] transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-40 border border-white/10
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-[120%] md:translate-x-0 opacity-0 md:opacity-100 md:scale-100'}
        md:static md:h-[calc(100vh-3rem)] md:my-6
      `}>
        <div className="h-full flex flex-col p-6">

          {/* Logo Area - Mainframe Branding */}
          <div className="hidden md:flex flex-col gap-1 px-4 h-24 mb-10 border-b border-white/5 justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] rotate-3 hover:rotate-6 transition-transform duration-500 border border-white/20">
                <span className="text-white font-black text-2xl">S</span>
              </div>
              <div>
                <span className="font-black text-white text-2xl tracking-tighter uppercase text-glow">SpendWiser</span>
                <p className="text-[8px] font-black text-indigo-500/60 uppercase tracking-[0.4em] mt-0.5">Neural Systems Unit</p>
              </div>
            </div>
          </div>

          {/* Nav Items - Data Channels */}
          <nav className="flex-1 px-2 py-4 space-y-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`
                    w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 animate-reveal group relative overflow-hidden
                    ${isActive
                      ? 'bg-white/10 text-white shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10 scale-[1.02]'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent hover:translate-x-2'}
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-r-full animate-pulse" />
                  )}
                  <div className={`transition-all duration-500 ${isActive ? 'scale-110 text-indigo-400 rotate-3' : 'scale-100 group-hover:rotate-12'}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-black tracking-[0.1em] uppercase text-[10px]">{item.label}</span>

                  {/* Hover Scan Line */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-indigo-500/20 opacity-0 group-hover:animate-scan" />
                </button>
              );
            })}
          </nav>

          {/* Bottom Section - Identity & Status */}
          <div className="px-2 pt-6 border-t border-white/5 space-y-6">

            {/* System Status - Telemetry Hub */}
            <div className="bg-black/40 rounded-[2.5rem] p-5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu size={14} className="text-indigo-400 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sys.Core</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[78%] animate-pulse" />
              </div>
            </div>

            {/* Profile - User Node */}
            <div className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-12 h-12 rounded-[1rem] bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                {userName ? userName[0].toUpperCase() : (userEmail ? userEmail[0].toUpperCase() : 'U')}
              </div>
              <div className="relative z-10 flex-1 overflow-hidden">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate leading-tight group-hover:text-indigo-400 transition-colors">{userName || (userEmail?.split('@')[0]) || 'User'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Auth_Verified</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              <ShieldCheck size={12} className="text-indigo-500/40" />
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Node_Secured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile - Atmospheric Veil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-30 md:hidden backdrop-blur-3xl transition-opacity duration-700 animate-reveal"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 animate-pulse opacity-10 bg-indigo-900/20" />
        </div>
      )}
    </>
  );
};

export default Sidebar;

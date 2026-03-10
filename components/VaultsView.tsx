import React from 'react';
import { Wallet as WalletType } from '../types';
import { CreditCard, Wallet, Landmark, TrendingUp, Zap } from 'lucide-react';

interface VaultsViewProps {
    wallets: WalletType[];
}

const VaultsView: React.FC<VaultsViewProps> = ({ wallets }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'card': return <CreditCard size={32} />;
            case 'cash': return <Wallet size={32} />;
            case 'savings': return <Landmark size={32} />;
            default: return <Landmark size={32} />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-12 animate-reveal">
            <div className="flex items-center gap-6 mb-12">
                <div className="bg-indigo-600/20 p-5 rounded-[1.5rem] border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                    <Landmark size={32} className="text-indigo-400 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase text-glow">Vault Repository</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Active Neural Nodes: {wallets.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {wallets.map((wallet, idx) => (
                    <div
                        key={wallet.id}
                        style={{ animationDelay: `${idx * 150}ms` }}
                        className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group glass-card-hover animate-reveal border border-white/5"
                    >
                        {/* Holographic Depth Effect */}
                        <div
                            className="absolute top-0 right-0 w-64 h-64 rounded-bl-full z-0 opacity-10 blur-[80px] transition-all duration-1000 group-hover:opacity-40 group-hover:scale-150"
                            style={{ backgroundColor: wallet.color }}
                        ></div>

                        <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-20 transition-all duration-700 text-white rotate-12 group-hover:rotate-0 group-hover:scale-125">
                            {getIcon(wallet.type)}
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-white transition-colors">
                                    {getIcon(wallet.type)}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Linked</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.3em]">{wallet.type} node</p>
                            <h3 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase group-hover:text-glow transition-all">{wallet.name}</h3>

                            <div className="space-y-2">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Bitstream Balance</p>
                                <p className="text-4xl font-black tracking-tighter text-white">
                                    {formatCurrency(wallet.balance)}
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={14} className="text-indigo-400" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Activity High</span>
                                </div>
                                <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                                    <Zap size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Wallet Placeholder */}
                <div className="flex flex-col items-center justify-center border-[3px] border-dashed border-white/5 rounded-[3rem] h-full min-h-[380px] hover:border-indigo-400/40 hover:bg-white/[0.02] transition-all duration-700 cursor-pointer group animate-reveal">
                    <div className="bg-white/5 p-8 rounded-[2rem] group-hover:scale-125 group-hover:rotate-90 transition-all duration-700 border border-white/5">
                        <Zap size={40} className="text-slate-800 group-hover:text-indigo-400" />
                    </div>
                    <p className="mt-6 text-[10px] font-black text-slate-600 group-hover:text-indigo-400 tracking-[0.4em] uppercase transition-colors">Initialize New Node</p>
                </div>
            </div>
        </div>
    );
};

export default VaultsView;

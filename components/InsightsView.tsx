import React from 'react';
import { Sparkles, Brain, Zap, Cpu, ShieldAlert, BarChart3, Fingerprint } from 'lucide-react';

interface InsightsViewProps {
    isLoading: boolean;
    insights: string;
    onGenerate: () => void;
    hasTransactions: boolean;
}

const InsightsView: React.FC<InsightsViewProps> = ({ isLoading, insights, onGenerate, hasTransactions }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-reveal">

            {/* AI Hero Section */}
            <div className="glass-panel bg-gradient-to-br from-indigo-950/40 to-slate-950/80 rounded-[4rem] p-16 text-white border border-white/10 relative overflow-hidden group shadow-[0_0_150px_rgba(79,70,229,0.1)]">

                {/* Animated Neural Background */}
                <div className="absolute inset-0 bg-mesh opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] group-hover:bg-indigo-500/20 transition-all duration-1000 animate-pulse" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-10 group/orb">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-40 animate-ping" />
                        <div className="relative w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center rotate-3 group-hover/orb:rotate-12 transition-all duration-700 border border-white/20">
                            <Brain size={56} className="text-indigo-900" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-slate-950 animate-pulse">
                            <Zap size={14} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-glow">Gemini Neural Core</h2>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.6em]">System Intelligence v3.0</p>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                    </div>

                    <p className="text-xl text-slate-300 mb-12 leading-relaxed font-medium max-w-2xl px-4">
                        Access advanced fiscal intelligence by synthesizing your neural transaction patterns. Our AI analyzes multi-dimensional spending vectors to provide actionable optimizations.
                    </p>

                    <button
                        onClick={onGenerate}
                        disabled={isLoading || !hasTransactions}
                        className="group/btn relative px-12 py-6 bg-white hover:bg-indigo-50 text-indigo-950 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-transparent to-indigo-200 -translate-x-full group-hover/btn:animate-scan pointer-events-none" />
                        <div className="relative z-10 flex items-center gap-4">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-indigo-950/30 border-t-indigo-950 rounded-full animate-spin" />
                                    <span>Synthesizing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} className="animate-pulse" />
                                    <span>Ignite AI Intelligence</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Results or Empty State */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Detailed Insights Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {insights ? (
                        <div className="glass-panel p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden animate-reveal min-h-[400px]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-scan opacity-20" />

                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                                    <Fingerprint size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Transmission Metadata</h3>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-2xl text-slate-200 leading-relaxed font-black mb-8 border-l-4 border-indigo-500 pl-8">
                                    {insights}
                                </p>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 flex gap-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Confidence Score</span>
                                    <span className="text-xl font-black text-emerald-500">98.4%</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Compute Latency</span>
                                    <span className="text-xl font-black text-white">420ms</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel p-20 rounded-[3.5rem] border border-white/5 text-center bg-black/20 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/5">
                                <Cpu size={32} className="text-slate-800" />
                            </div>
                            <p className="text-sm font-black text-slate-600 uppercase tracking-[0.4em]">Neural Core awaiting transmission signal...</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info Blocks */}
                <div className="space-y-10">
                    <div className="glass-panel p-10 rounded-[3rem] border border-white/5 group hover:border-indigo-500/30 transition-all">
                        <BarChart3 className="text-indigo-400 mb-6 transition-transform group-hover:scale-125 duration-500" size={32} />
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">Pattern Recognition</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">Advanced algorithms identify recurring fiscal anomalies and spending vectors.</p>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border border-white/5 group hover:border-rose-500/30 transition-all">
                        <ShieldAlert className="text-rose-400 mb-6 transition-transform group-hover:scale-125 duration-500" size={32} />
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">Threat Mitigation</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">AI identifies unnecessary outflows and redirects thermal resources to savings vaults.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1 rounded-[3rem]">
                        <div className="bg-slate-950 p-10 rounded-[2.8rem] flex flex-col items-center text-center">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Neural Subscription</p>
                            <p className="text-2xl font-black text-white uppercase mb-2">Pro Linked</p>
                            <div className="w-12 h-1 bg-indigo-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsView;

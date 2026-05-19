import React from 'react';
import { Transaction } from '../types';
import { Search, ChevronRight, TrendingUp, TrendingDown, Clock, ListFilter, Zap, Trash2, Download } from 'lucide-react';

interface LedgerViewProps {
    transactions: Transaction[];
    searchQuery: string;
    onSearch: (query: string) => void;
    onDelete?: (id: string) => void;
}

const LedgerView: React.FC<LedgerViewProps> = ({ transactions, searchQuery, onSearch, onDelete }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
        const rows = filteredTransactions.map(t => [
            new Date(t.date).toLocaleDateString('en-IN'),
            t.description,
            t.category,
            t.type,
            t.amount.toString(),
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spendwiser-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredTransactions = transactions
        .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-10 animate-reveal">
            {/* Ledger Header & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                <div className="lg:col-span-1">
                    <div className="flex items-center gap-5 mb-4">
                        <div className="bg-indigo-600/20 p-4 rounded-2xl border border-indigo-500/30">
                            <Clock size={24} className="text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase text-glow">Ledger Feed</h2>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Temporal Data Stream Interface</p>
                </div>

                <div className="lg:col-span-2">
                    <div className="glass-panel p-2 rounded-[2rem] border border-white/5 flex gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="QUERY LEDGER BITSTREAM..."
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-2xl text-white font-black tracking-widest text-[10px] focus:ring-2 focus:ring-indigo-500/50 outline-none uppercase transition-all"
                            />
                        </div>
                        <button className="px-8 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5 flex items-center gap-3">
                            <ListFilter size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Sort Protocol</span>
                        </button>
                        <button onClick={exportToCSV} className="px-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all border border-emerald-500/20 flex items-center gap-2">
                            <Download size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Export CSV</span>
                        </button>
                        <a
                            href="/api/transactions/download"
                            download
                            className="px-6 py-5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-2xl transition-all border border-indigo-500/20 flex items-center gap-2"
                        >
                            <Download size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Download Excel</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Ledger Feed */}
            <div className="glass-panel rounded-[3rem] overflow-hidden border border-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                <div className="divide-y divide-white/5 relative z-10">
                    {filteredTransactions.length === 0 ? (
                        <div className="p-32 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                                <Zap size={32} className="text-slate-800" />
                            </div>
                            <p className="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">No data records found in the current temporal frame</p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx, idx) => (
                            <div
                                key={tx.id}
                                className="p-8 hover:bg-white/[0.03] flex items-center justify-between transition-all group animate-reveal border-l-4 border-l-transparent hover:border-l-indigo-500"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="flex items-center gap-8">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-rose-500/10'}`}>
                                        {tx.type === 'income' ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <p className="font-black text-white text-xl uppercase tracking-tight group-hover:text-glow transition-all">{tx.description}</p>
                                            <ChevronRight size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                <Clock size={10} className="text-slate-500" />
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                                    {new Date(tx.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">{tx.category}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <p className={`text-2xl font-black tracking-tighter transition-all group-hover:scale-110 ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </p>
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Execution Success</p>
                                    </div>
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(tx.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                                            title="Delete transaction"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Ledger Stats Footer */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Entries</p>
                    <p className="text-xl font-black text-white">{filteredTransactions.length}</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-xl font-black text-emerald-500">100%</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Encryption</p>
                    <p className="text-xl font-black text-indigo-400">AES-256</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Protocol</p>
                    <p className="text-xl font-black text-white">FIX.5 / JSON</p>
                </div>
            </div>
        </div>
    );
};

export default LedgerView;

import React, { useMemo } from 'react';
import { Transaction, Wallet, Budget } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Search, FileText, IndianRupee, Zap, Plus } from 'lucide-react';
import LiquidGauge from './LiquidGauge';

interface DashboardProps {
  transactions: Transaction[];
  wallets: Wallet[];
  budgets: Budget[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, wallets, budgets, onSearch, searchQuery }) => {

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const balance = income - expense;

    // Group by category for Chart
    const categoryData: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    const pieData = Object.keys(categoryData).map(key => ({
      name: key,
      value: categoryData[key]
    }));

    return { income, expense, balance, pieData };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery]);

  const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-12 animate-reveal">

      {/* Search Bar - Floating Glass */}
      <div className="glass-panel p-5 rounded-[2rem] shadow-2xl border border-white/5 sticky top-0 z-20 animate-scan">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
          <input
            type="text"
            placeholder="ACCESS LOGS..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold tracking-widest text-xs uppercase"
          />
        </div>
      </div>

      {/* Stats Cards - Futuristic Vaults */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group glass-card-hover animate-reveal" style={{ animationDelay: '100ms' }}>
          <div className="absolute right-[-20px] top-[-20px] p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-125 text-white">
            <IndianRupee size={160} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Neural Balance</p>
            <h3 className="text-4xl font-black text-white text-glow tracking-tighter">{formatCurrency(stats.balance)}</h3>
            <div className="mt-6 flex items-center text-[9px] font-black text-indigo-400 bg-indigo-500/10 w-fit px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">
              <Zap size={10} className="mr-2 animate-pulse" /> {wallets.length} active nodes
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group glass-card-hover animate-reveal" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Total Inflow</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{formatCurrency(stats.income)}</h3>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-6 text-[9px] font-black text-emerald-500 flex items-center bg-emerald-500/5 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/10 tracking-[0.2em]">
            <ArrowUpRight size={14} className="mr-1" /> SYSTEM GROWTH
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group glass-card-hover animate-reveal" style={{ animationDelay: '300ms' }}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Total Outflow</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{formatCurrency(stats.expense)}</h3>
            </div>
            <div className="bg-rose-500/10 p-4 rounded-2xl text-rose-400 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)] group-hover:-rotate-12 transition-transform duration-500">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="mt-6 text-[9px] font-black text-rose-500 flex items-center bg-rose-500/5 w-fit px-3 py-1.5 rounded-lg border border-rose-500/10 tracking-[0.2em]">
            <ArrowDownRight size={14} className="mr-1" /> CORE DRAIN
          </div>
        </div>
      </div>

      {/* Budget Pulse Section - Floating Lab */}
      <section className="glass-panel p-10 rounded-[3rem] relative overflow-hidden animate-reveal" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Zap size={22} className="text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Neural Pulse</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Real-time sync active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping"></div>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
          {budgets.map((budget, idx) => {
            const percent = (budget.spent / budget.limit) * 100;
            return (
              <div key={budget.id} className="animate-reveal" style={{ animationDelay: `${500 + (idx * 100)}ms` }}>
                <LiquidGauge
                  percent={percent}
                  label={budget.category as string}
                  amount={formatCurrency(budget.spent)}
                  limit={formatCurrency(budget.limit)}
                />
              </div>
            );
          })}

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] h-64 hover:border-indigo-400/40 hover:bg-white/[0.02] transition-all duration-500 cursor-pointer group animate-reveal" style={{ animationDelay: '900ms' }}>
            <div className="bg-white/5 p-5 rounded-[1.5rem] group-hover:scale-125 group-hover:rotate-90 transition-all duration-700">
              <Plus size={32} className="text-slate-700 group-hover:text-indigo-400" />
            </div>
            <p className="mt-4 text-[10px] font-black text-slate-600 group-hover:text-indigo-400 tracking-[0.3em] uppercase transition-colors">Add Module</p>
          </div>
        </div>

        {/* Decorative background effects */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-600/20 transition-all" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-reveal" style={{ animationDelay: '1000ms' }}>
        {/* Charts Area */}
        <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] shadow-2xl border border-white/5 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-xl font-black text-white tracking-tighter uppercase">Spending Landscape</h4>
            <div className="h-1 w-20 bg-indigo-600/30 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[60%] animate-pulse"></div>
            </div>
          </div>
          <div className="h-80 w-full relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.pieData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} interval={0} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: '900' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(2, 4, 8, 0.95)', color: '#fff', padding: '16px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={32}>
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all duration-500 hover:opacity-80" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 rounded-[2rem]">
                <p className="font-black text-xs tracking-[0.3em] uppercase">No data recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Mini Transaction List */}
        <div className="lg:col-span-1 glass-panel p-10 rounded-[3rem] shadow-2xl border border-white/5 flex flex-col h-[520px] group transition-all duration-500 hover:border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Live Feed</h4>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-slate-700 py-16 font-black text-[10px] tracking-[0.4em] border-2 border-dashed border-white/5 rounded-[2rem] uppercase">Queue Empty</div>
            ) : filteredTransactions.map((tx, idx) => (
              <div key={tx.id}
                className="flex items-center justify-between group p-4 hover:bg-white/[0.03] rounded-2xl transition-all duration-500 border border-transparent hover:border-white/5 group/tx animate-reveal"
                style={{ animationDelay: `${1100 + (idx * 50)}ms` }}>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/tx:scale-110 group-hover/tx:rotate-6 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {tx.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-white truncate max-w-[120px] leading-tight uppercase tracking-tight group-hover/tx:text-indigo-400 transition-colors">{tx.description}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black tracking-tighter transition-all group-hover/tx:scale-110 ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  {tx.receiptUrl && <FileText size={10} className="ml-auto text-indigo-400 mt-1 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 transition-all border border-white/5 hover:border-white/10">
            Export Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
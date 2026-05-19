import React from 'react';
import {
  Lightbulb, TrendingUp, PiggyBank, AlertTriangle,
  Sparkles, RefreshCw, ArrowUpRight, Wallet, BarChart2, Target
} from 'lucide-react';
import { AISuggestionsResult, AISuggestion } from '../services/geminiService';

interface AISuggestionsViewProps {
  isLoading: boolean;
  result: AISuggestionsResult | null;
  onGenerate: () => void;
  hasTransactions: boolean;
}

const typeConfig = {
  saving: {
    icon: PiggyBank,
    color: 'emerald',
    label: 'Saving Tip',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]',
  },
  investment: {
    icon: TrendingUp,
    color: 'indigo',
    label: 'Investment',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.1)]',
  },
  warning: {
    icon: AlertTriangle,
    color: 'rose',
    label: 'Warning',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.1)]',
  },
};

const priorityBadge = {
  high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const SuggestionCard: React.FC<{ suggestion: AISuggestion; index: number }> = ({ suggestion, index }) => {
  const cfg = typeConfig[suggestion.type] || typeConfig.saving;
  const Icon = cfg.icon;

  return (
    <div
      className={`glass-panel p-8 rounded-[2.5rem] border ${cfg.border} ${cfg.glow} hover:scale-[1.02] transition-all duration-500 animate-reveal`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className={`p-3 ${cfg.bg} rounded-2xl border ${cfg.border}`}>
          <Icon size={22} className={cfg.text} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${priorityBadge[suggestion.priority]}`}>
            {suggestion.priority}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
        </div>
      </div>

      <h3 className="text-base font-black text-white uppercase tracking-tight mb-3">{suggestion.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-6">{suggestion.description}</p>

      <div className={`flex items-center gap-2 px-4 py-2 ${cfg.bg} rounded-2xl border ${cfg.border} w-fit`}>
        <ArrowUpRight size={14} className={cfg.text} />
        <span className={`text-[10px] font-black ${cfg.text} uppercase tracking-widest`}>{suggestion.estimatedImpact}</span>
      </div>
    </div>
  );
};

const AISuggestionsView: React.FC<AISuggestionsViewProps> = ({
  isLoading,
  result,
  onGenerate,
  hasTransactions,
}) => {
  const savings = result?.suggestions.filter(s => s.type === 'saving') ?? [];
  const investments = result?.suggestions.filter(s => s.type === 'investment') ?? [];
  const warnings = result?.suggestions.filter(s => s.type === 'warning') ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-reveal">

      {/* Hero */}
      <div className="glass-panel bg-gradient-to-br from-emerald-950/40 to-slate-950/80 rounded-[4rem] p-14 text-white border border-white/10 relative overflow-hidden group shadow-[0_0_150px_rgba(16,185,129,0.08)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] group-hover:bg-emerald-500/20 transition-all duration-1000 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 animate-ping" />
            <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-700 border border-white/20">
              <Lightbulb size={48} className="text-emerald-700" />
            </div>
          </div>

          <h2 className="text-4xl font-black uppercase tracking-tighter mb-3 text-glow">AI Financial Advisor</h2>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-10 bg-emerald-500 rounded-full" />
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Saving & Investment Intelligence</p>
            <div className="h-1 w-10 bg-emerald-500 rounded-full" />
          </div>

          <p className="text-base text-slate-300 mb-10 leading-relaxed max-w-xl">
            Analyze your money flow and get personalized suggestions to save smarter and invest for a stronger financial future.
          </p>

          <button
            onClick={onGenerate}
            disabled={isLoading || !hasTransactions}
            className="group/btn relative px-12 py-5 bg-white hover:bg-emerald-50 text-emerald-950 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Analyzing your finances...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="animate-pulse" />
                  <span>{result ? 'Refresh Suggestions' : 'Get AI Suggestions'}</span>
                </>
              )}
            </div>
          </button>

          {!hasTransactions && (
            <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">Add transactions first to get suggestions</p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {result && (
        <div className="grid grid-cols-3 gap-6 animate-reveal">
          {[
            { label: 'Total Income', value: `₹${result.totalIncome.toLocaleString('en-IN')}`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Total Expenses', value: `₹${result.totalExpenses.toLocaleString('en-IN')}`, icon: BarChart2, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            { label: 'Savings Rate', value: `${result.savingsRate}%`, icon: Target, color: result.savingsRate >= 20 ? 'text-emerald-400' : 'text-amber-400', bg: result.savingsRate >= 20 ? 'bg-emerald-500/10' : 'bg-amber-500/10', border: result.savingsRate >= 20 ? 'border-emerald-500/20' : 'border-amber-500/20' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`glass-panel p-7 rounded-[2.5rem] border ${stat.border} flex flex-col gap-3`}>
                <div className={`p-2.5 ${stat.bg} rounded-xl w-fit border ${stat.border}`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {result?.summary && (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 animate-reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Sparkles size={18} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Financial Health Summary</h3>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm border-l-4 border-indigo-500 pl-5">{result.summary}</p>
        </div>
      )}

      {/* Suggestions Grid */}
      {result && result.suggestions.length > 0 && (
        <div className="space-y-8">
          {warnings.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Warnings — Act Now
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {warnings.map((s, i) => <SuggestionCard key={i} suggestion={s} index={i} />)}
              </div>
            </section>
          )}

          {savings.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <PiggyBank size={14} /> Saving Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savings.map((s, i) => <SuggestionCard key={i} suggestion={s} index={i} />)}
              </div>
            </section>
          )}

          {investments.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Investment Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {investments.map((s, i) => <SuggestionCard key={i} suggestion={s} index={i} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="glass-panel p-20 rounded-[3.5rem] border border-white/5 text-center bg-black/20 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5">
            <Lightbulb size={28} className="text-slate-700" />
          </div>
          <p className="text-sm font-black text-slate-600 uppercase tracking-[0.4em]">
            {hasTransactions ? 'Click the button above to get your personalized suggestions' : 'No transactions found — add some to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AISuggestionsView;

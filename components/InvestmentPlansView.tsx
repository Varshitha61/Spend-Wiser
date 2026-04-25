import React, { useMemo } from 'react';
import { Transaction } from '../types';
import {
  TrendingUp, Zap, Shield, Target, DollarSign, Clock, AlertCircle,
  CheckCircle, ArrowRight, Lightbulb, PieChart
} from 'lucide-react';

interface InvestmentPlansViewProps {
  transactions: Transaction[];
}

interface InvestmentPlan {
  id: string;
  name: string;
  type: 'mutual-fund' | 'lic' | 'fixed-deposit' | 'ppf' | 'nps' | 'gold';
  description: string;
  minInvestment: number;
  expectedReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: string;
  benefits: string[];
  taxBenefit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const InvestmentPlansView: React.FC<InvestmentPlansViewProps> = ({ transactions }) => {
  const [liveRates, setLiveRates] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const res = await fetch('/api/investment-rates/scrape');
        if (res.ok) {
          const data = await res.json();
          setLiveRates(data);
        }
      } catch (err) {
        console.error('Failed to fetch live rates', err);
      }
    };
    fetchLiveRates();
  }, []);

  const monthlyIncome = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(t => {
        const txDate = new Date(t.date);
        return t.type === 'income' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlyExpense = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(t => {
        const txDate = new Date(t.date);
        return t.type === 'expense' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlySavings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  const investmentPlans: InvestmentPlan[] = [
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      type: 'ppf',
      description: 'Government-backed long-term savings scheme with guaranteed returns',
      minInvestment: 500,
      expectedReturn: liveRates['ppf'] || '7.1% p.a.',
      riskLevel: 'low',
      timeHorizon: '15 years (extendable)',
      benefits: ['Tax-free returns', 'Partial withdrawal allowed', 'Loan facility available', 'Government guarantee'],
      taxBenefit: '₹1.5 lakh deduction under Section 80C',
      icon: <Shield size={28} />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'mutual-funds',
      name: 'Mutual Funds (Equity)',
      type: 'mutual-fund',
      description: 'Diversified portfolio managed by professionals for wealth creation',
      minInvestment: 100,
      expectedReturn: liveRates['mutual-funds'] || '12% - 15% p.a.',
      riskLevel: 'high',
      timeHorizon: '5-10 years',
      benefits: ['Professional management', 'Diversification', 'Liquidity', 'SIP options available'],
      taxBenefit: 'LTCG tax at 20% after 1 year',
      icon: <PieChart size={28} />,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      id: 'lic',
      name: 'LIC Insurance Plans',
      type: 'lic',
      description: 'Life insurance with investment component for protection & returns',
      minInvestment: 5000,
      expectedReturn: liveRates['lic'] || '4% - 6% p.a.',
      riskLevel: 'low',
      timeHorizon: '10-20 years',
      benefits: ['Life coverage', 'Guaranteed returns', 'Maturity bonus', 'Loan against policy'],
      taxBenefit: '₹1.5 lakh deduction under Section 80C',
      icon: <Shield size={28} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      id: 'nps',
      name: 'National Pension System (NPS)',
      type: 'nps',
      description: 'Retirement planning scheme with tax benefits and flexible investment',
      minInvestment: 500,
      expectedReturn: liveRates['nps'] || '8% - 10% p.a.',
      riskLevel: 'medium',
      timeHorizon: '20-30 years',
      benefits: ['Retirement security', 'Tax-free withdrawal at 60', 'Flexible allocation', 'Low charges'],
      taxBenefit: '₹1.5 lakh under 80C + ₹50k under 80CCD(1B)',
      icon: <Target size={28} />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'fixed-deposit',
      name: 'Fixed Deposits (FD)',
      type: 'fixed-deposit',
      description: 'Safe, guaranteed returns with fixed tenure and interest rate',
      minInvestment: 1000,
      expectedReturn: liveRates['fixed-deposit'] || '6% - 7.5% p.a.',
      riskLevel: 'low',
      timeHorizon: '1-10 years',
      benefits: ['Guaranteed returns', 'DICGC protection up to ₹5L', 'Flexible tenure', 'Loan facility'],
      taxBenefit: 'Interest taxed as per income slab',
      icon: <DollarSign size={28} />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'gold',
      name: 'Gold Investment',
      type: 'gold',
      description: 'Hedge against inflation with physical or digital gold options',
      minInvestment: 100,
      expectedReturn: liveRates['gold'] || '8% - 10% p.a.',
      riskLevel: 'medium',
      timeHorizon: '5-10 years',
      benefits: ['Inflation hedge', 'Liquidity', 'No counterparty risk', 'Cultural significance'],
      taxBenefit: 'LTCG tax at 20% after 2 years',
      icon: <TrendingUp size={28} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
  ];

  const getRecommendedPlans = () => {
    const recommended = [];

    if (savingsRate >= 30) {
      recommended.push('mutual-funds', 'nps');
    } else if (savingsRate >= 20) {
      recommended.push('ppf', 'nps');
    } else if (savingsRate >= 10) {
      recommended.push('ppf', 'fixed-deposit');
    } else {
      recommended.push('fixed-deposit', 'gold');
    }

    if (monthlySavings >= 10000) {
      recommended.push('lic');
    }

    return recommended;
  };

  const recommendedIds = getRecommendedPlans();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-reveal">
      {/* Hero Section */}
      <div className="glass-panel bg-gradient-to-br from-indigo-950/40 to-slate-950/80 rounded-[4rem] p-14 text-white border border-white/10 relative overflow-hidden group shadow-[0_0_150px_rgba(99,102,241,0.1)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000 animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-30 animate-ping" />
            <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-700 border border-white/20">
              <TrendingUp size={48} className="text-indigo-700" />
            </div>
          </div>

          <h2 className="text-4xl font-black uppercase tracking-tighter mb-3 text-glow">Investment Plans</h2>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-10 bg-indigo-500 rounded-full" />
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Personalized Wealth Building</p>
            <div className="h-1 w-10 bg-indigo-500 rounded-full" />
          </div>

          <p className="text-base text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Explore investment options tailored to your financial profile. Build wealth systematically with plans suited to your risk appetite and goals.
          </p>
        </div>
      </div>

      {/* Financial Profile */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Income</p>
          <p className="text-2xl font-black text-emerald-400">₹{monthlyIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Expense</p>
          <p className="text-2xl font-black text-rose-400">₹{monthlyExpense.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly Savings</p>
          <p className="text-2xl font-black text-indigo-400">₹{monthlySavings.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Savings Rate</p>
          <p className="text-2xl font-black text-amber-400">{savingsRate}%</p>
        </div>
      </div>

      {/* Recommended Plans */}
      {recommendedIds.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Lightbulb size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Recommended for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentPlans
              .filter(p => recommendedIds.includes(p.id))
              .map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`glass-panel p-8 rounded-[2.5rem] border ${plan.borderColor} ${plan.bgColor} hover:scale-[1.02] transition-all duration-500 animate-reveal relative overflow-hidden group`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-20 transition-opacity duration-500 text-white scale-150">
                    {plan.icon}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${plan.bgColor} rounded-2xl border ${plan.borderColor}`}>
                        {plan.icon}
                      </div>
                      <CheckCircle size={20} className="text-emerald-400" />
                    </div>

                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{plan.name}</h4>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{plan.description}</p>

                    <div className="space-y-3 mb-6 pb-6 border-b border-white/5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 uppercase tracking-widest font-black">Min Investment</span>
                        <span className={`font-black ${plan.color}`}>₹{plan.minInvestment.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 uppercase tracking-widest font-black">Expected Return</span>
                        <span className={`font-black ${plan.color}`}>{plan.expectedReturn}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 uppercase tracking-widest font-black">Time Horizon</span>
                        <span className={`font-black ${plan.color}`}>{plan.timeHorizon}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 uppercase tracking-widest font-black">Risk Level</span>
                        <span className={`font-black px-2 py-1 rounded-lg border ${getRiskColor(plan.riskLevel)}`}>
                          {plan.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Key Benefits</p>
                      <ul className="space-y-1">
                        {plan.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-[9px] text-slate-400 flex items-center gap-2">
                            <CheckCircle size={10} className="text-emerald-400 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tax Benefit</p>
                      <p className="text-[9px] text-slate-300">{plan.taxBenefit}</p>
                    </div>

                    <button className={`w-full py-3 ${plan.bgColor} border ${plan.borderColor} rounded-2xl font-black text-[10px] uppercase tracking-widest ${plan.color} hover:scale-105 transition-all flex items-center justify-center gap-2`}>
                      Learn More <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* All Plans */}
      <section>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">All Investment Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investmentPlans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`glass-panel p-8 rounded-[2.5rem] border ${plan.borderColor} hover:scale-[1.02] transition-all duration-500 animate-reveal relative overflow-hidden group`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-20 transition-opacity duration-500 text-white scale-150">
                {plan.icon}
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${plan.bgColor} rounded-2xl border ${plan.borderColor}`}>
                    {plan.icon}
                  </div>
                  {recommendedIds.includes(plan.id) && (
                    <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Recommended</span>
                    </div>
                  )}
                </div>

                <h4 className="text-base font-black text-white uppercase tracking-tight mb-2">{plan.name}</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{plan.description}</p>

                <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500 uppercase tracking-widest font-black">Min Investment</span>
                    <span className={`font-black ${plan.color}`}>₹{plan.minInvestment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500 uppercase tracking-widest font-black">Expected Return</span>
                    <span className={`font-black ${plan.color}`}>{plan.expectedReturn}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500 uppercase tracking-widest font-black">Risk</span>
                    <span className={`font-black px-2 py-0.5 rounded-lg border text-[8px] ${getRiskColor(plan.riskLevel)}`}>
                      {plan.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button className={`w-full py-2.5 ${plan.bgColor} border ${plan.borderColor} rounded-xl font-black text-[9px] uppercase tracking-widest ${plan.color} hover:scale-105 transition-all`}>
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Box */}
      <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex items-start gap-4">
        <AlertCircle size={24} className="text-amber-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm font-black text-white uppercase tracking-tight mb-2">Disclaimer</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            These investment plans are for informational purposes only. Please consult with a certified financial advisor before making any investment decisions. Past performance is not indicative of future results. All investments carry risk, including potential loss of principal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlansView;

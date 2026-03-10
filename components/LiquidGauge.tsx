import React from 'react';

interface LiquidGaugeProps {
    percent: number; // 0 to 100
    label: string;
    amount: string;
    limit: string;
}

const LiquidGauge: React.FC<LiquidGaugeProps> = ({ percent, label, amount, limit }) => {
    const fillPercent = Math.min(Math.max(percent, 0), 100);

    // Color logic based on status
    let liquidColor = '#22c55e'; // Emerald-500
    let glowColor = 'rgba(34, 197, 94, 0.4)';

    if (percent >= 90) {
        liquidColor = '#ef4444'; // Red-500
        glowColor = 'rgba(239, 68, 68, 0.4)';
    } else if (percent >= 70) {
        liquidColor = '#f59e0b'; // Amber-500
        glowColor = 'rgba(245, 158, 11, 0.4)';
    }

    return (
        <div className="flex flex-col items-center group">
            <div className="relative w-40 h-64 bg-slate-900/40 rounded-[2.5rem] p-1 border-2 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent z-20 pointer-events-none" />

                {/* Liquid Container */}
                <div className="absolute inset-0 z-10">
                    <div
                        className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out"
                        style={{
                            height: `${fillPercent}%`,
                            backgroundColor: liquidColor,
                            boxShadow: `0 0 30px ${glowColor}`
                        }}
                    >
                        {/* Animated Waves */}
                        <div className="absolute -top-6 left-0 w-[200%] h-12 opacity-60 animate-wave-slow">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full" fill={liquidColor}>
                                <path d="M0 10 Q 25 20 50 10 T 100 10 V 20 H 0 Z" />
                            </svg>
                        </div>
                        <div className="absolute -top-4 left-[-50%] w-[200%] h-10 opacity-40 animate-wave-fast">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full" fill={liquidColor}>
                                <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content Overlays */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4">
                    <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-2">
                        <span className="text-xl font-black text-white">{Math.round(percent)}%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold mb-1 opacity-80">{label}</p>
                </div>

                {/* Glass Rim Highlight */}
                <div className="absolute inset-0 border-[6px] border-white/5 rounded-[2.5rem] pointer-events-none z-40" />
            </div>

            <div className="mt-4 text-center">
                <p className="text-white font-bold text-sm">{amount}</p>
                <p className="text-slate-500 text-[10px]">of {limit} limit</p>
            </div>
        </div>
    );
};

export default LiquidGauge;

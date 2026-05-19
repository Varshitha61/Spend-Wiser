import React, { useState, useRef } from 'react';
import { X, Loader2, Camera, Receipt, Check, Zap, ShieldCheck } from 'lucide-react';
import { Category, Transaction, Wallet } from '../types';
import { analyzeReceiptImage } from '../services/geminiService';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id'>) => void;
    wallets: Wallet[];
    initialData?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, wallets, initialData }) => {
    const [amount, setAmount] = useState<string>(initialData?.amount.toString() || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState<string>(initialData?.category || Category.FOOD);
    const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
    const [walletId, setWalletId] = useState<string>(initialData?.walletId || wallets[0]?.id || '');
    const [date, setDate] = useState<string>(initialData?.date.split('T')[0] || new Date().toISOString().split('T')[0]);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(initialData?.receiptUrl || null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setReceiptPreview(base64String);

            setIsAnalyzing(true);
            try {
                const result = await analyzeReceiptImage(base64String);
                if (result.amount) setAmount(result.amount.toString());
                if (result.category) setCategory(result.category);
                if (result.description || result.merchant) setDescription(result.description || result.merchant);
                if (result.date) {
                    const parsedDate = new Date(result.date);
                    if (!isNaN(parsedDate.getTime())) {
                        setDate(parsedDate.toISOString().split('T')[0]);
                    }
                }
                setType('expense');
            } catch (error) {
                console.error("Analysis failed", error);
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !walletId) return;

        onSave({
            amount: parseFloat(amount),
            description,
            category,
            type,
            walletId,
            date: new Date(date).toISOString(),
            receiptUrl: receiptPreview || undefined,
            currency: 'INR'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 selection:bg-indigo-500/30">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-reveal" onClick={onClose} />

            <div className="relative w-full max-w-2xl glass-panel rounded-[3.5rem] p-10 shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/10 animate-reveal overflow-hidden">

                {/* Animated Background Highlights */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[1.5rem] border border-white/10 shadow-lg ${type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            <Zap size={28} className={isAnalyzing ? 'animate-spin' : 'animate-pulse'} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                {initialData ? 'Update Core' : 'Initialize Entry'}
                            </h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Ledger Sync: Authorized</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar pr-4">

                    {/* Type Selection - Cyber Toggle */}
                    <div className="grid grid-cols-2 gap-4 p-1.5 bg-black/40 border border-white/5 rounded-[2rem] relative overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${type === 'expense' ? 'bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            System Drain
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${type === 'income' ? 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            System Inflow
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Amount Field */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Telemetry.Amount (₹)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white font-black text-xl">₹</div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] text-white text-2xl font-black focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder-white/5"
                                    required
                                />
                            </div>
                        </div>

                        {/* Wallet Selection */}
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Target.Node</label>
                            <select
                                value={walletId}
                                onChange={(e) => setWalletId(e.target.value)}
                                className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] text-white font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none transition-all cursor-pointer"
                            >
                                {wallets.map(w => (
                                    <option key={w.id} value={w.id} className="bg-slate-950">{w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Operation.Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="ENTER TRANSACTION METADATA..."
                            className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] text-white font-bold text-sm uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder-slate-800"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Classification</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] text-white font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer"
                            >
                                {Object.values(Category).map(c => (
                                    <option key={c} value={c} className="bg-slate-950">{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Timestamp</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] text-white font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Receipt Scanner - Interactive Lab */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between ml-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Scan (Optional)</span>
                            {isAnalyzing && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Analyzing Bitstream</span>}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="col-span-3 border-2 border-dashed border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-[2rem] p-6 flex items-center justify-center gap-4 transition-all group"
                            >
                                <Camera size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">Capture Visual Evidence</span>
                            </button>
                            {receiptPreview ? (
                                <div className="relative group/img aspect-square rounded-[1.5rem] overflow-hidden border border-white/10">
                                    <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500" />
                                    <button
                                        type="button"
                                        onClick={() => setReceiptPreview(null)}
                                        className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white/5 rounded-[1.5rem] border border-white/5 flex items-center justify-center text-slate-800">
                                    <Receipt size={24} />
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                </form>

                <div className="mt-12 flex gap-4 pt-8 border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 rounded-[2rem] bg-white/5 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all border border-white/5"
                    >
                        Abort Entry
                    </button>
                    <button
                        type="submit"
                        form="txForm"
                        onClick={handleSubmit}
                        className="flex-[2] py-5 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan pointer-events-none" />
                        <Check size={20} />
                        <span>Authorize Protocol</span>
                    </button>
                </div>

                <div className="mt-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
                        <ShieldCheck size={12} className="text-indigo-500/40" />
                        Validated Neural Ledger Session
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;

import React, { useState } from 'react';
import { X, MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import { parseBankMessage } from '../services/geminiService';
import { Transaction } from '../types';

interface MessageParserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onParsed: (tx: Omit<Transaction, 'id'>) => void;
    wallets: { id: string, name: string }[];
}

const MessageParserModal: React.FC<MessageParserModalProps> = ({ isOpen, onClose, onParsed, wallets }) => {
    const [message, setMessage] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleParse = async () => {
        if (!message.trim()) return;
        setIsParsing(true);
        setError('');

        try {
            const result = await parseBankMessage(message);

            if (result.amount && result.type) {
                // Auto-assign to first wallet if not found (or user can select later)
                onParsed({
                    amount: result.amount,
                    type: result.type as 'income' | 'expense',
                    description: result.description || 'SMS Transaction',
                    category: (result.category as any) || 'Other',
                    date: new Date().toISOString(),
                    walletId: wallets[0]?.id || '1',
                    currency: (result.currency as any) || 'INR'
                });
                setMessage('');
                onClose();
            } else {
                setError('Could not extract transaction details. Please check the message format.');
            }
        } catch (e) {
            setError('Neural parsing failed. Please ensure your AI key is configured.');
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none focus:outline-none">
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-reveal"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-xl glass-panel rounded-[3rem] p-10 shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/10 animate-reveal">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600/20 p-4 rounded-[1.5rem] border border-indigo-500/30">
                            <MessageSquare size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">SMS Decryptor</h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Neural Message Parsing</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="PASTE BANK SMS CONTENT HERE..."
                            className="relative w-full h-48 bg-black/40 border border-white/5 rounded-[2rem] p-6 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder-slate-700 uppercase tracking-widest leading-relaxed custom-scrollbar"
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse">
                            <ShieldCheck size={16} />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[1.5rem] bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleParse}
                            disabled={isParsing || !message}
                            className="flex-[2] py-5 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 overflow-hidden group"
                        >
                            {isParsing ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Decrypting...</span>
                                </div>
                            ) : (
                                <>
                                    <Zap size={18} className="group-hover:scale-120 transition-transform" />
                                    <span>Execute Neural Parse</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Privacy Shield Active • Local session encryption</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageParserModal;

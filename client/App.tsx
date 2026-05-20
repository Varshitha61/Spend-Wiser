import React, { useState, useEffect } from 'react';
import { Transaction, Wallet, User, Budget } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VaultsView from './components/VaultsView';
import LedgerView from './components/LedgerView';
import InsightsView from './components/InsightsView';
import AISuggestionsView from './components/AISuggestionsView';
import InvestmentPlansView from './components/InvestmentPlansView';
import UserProfileView from './components/UserProfileView';
import SettingsView from './components/SettingsView';
import TransactionModal from './components/TransactionModal';
import MessageParserModal from './components/MessageParserModal';
import SMSIntegrationModal from './components/SMSIntegrationModal';
import LoginPage from './components/LoginPage';
import { getSpendingInsights, getAISuggestions, AISuggestionsResult } from './services/geminiService';
import { AuthService } from './services/authService';
import { Plus, Sparkles, AlertCircle, LogOut, MessageSquare, Database, Smartphone } from 'lucide-react';

// --- MOCK DATA (Rupees) - INITIALIZED TO ZERO ---
const MOCK_WALLETS: Wallet[] = [
    { id: '1', name: 'Main Checking', type: 'card', balance: 0, currency: 'INR', color: '#6366f1' },
    { id: '2', name: 'Cash', type: 'cash', balance: 0, currency: 'INR', color: '#10b981' },
    { id: '3', name: 'Savings', type: 'savings', balance: 0, currency: 'INR', color: '#f59e0b' },
];

const MOCK_BUDGETS: Budget[] = [
    { id: '1', category: 'Food', limit: 5000, spent: 0, currency: 'INR' },
    { id: '2', category: 'Transport', limit: 3000, spent: 0, currency: 'INR' },
    { id: '3', category: 'Entertainment', limit: 2000, spent: 0, currency: 'INR' },
];

const MOCK_TRANSACTIONS: Transaction[] = [];

const App: React.FC = () => {
    // Auth State
    const [user, setUser] = useState<User | null>(null);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isParserModalOpen, setIsParserModalOpen] = useState(false);
    const [isSMSIntegrationOpen, setIsSMSIntegrationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiInsights, setAiInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestionsResult | null>(null);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    useEffect(() => {
        // Check for Auth Session
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    // --- DATABASE SYNC & REAL-TIME UPDATES ---
    useEffect(() => {
        const storedWallets = localStorage.getItem('app_wallets_v2');
        const storedBudgets = localStorage.getItem('app_budgets_v2');

        if (storedWallets) {
            setWallets(JSON.parse(storedWallets));
        } else {
            setWallets(MOCK_WALLETS);
        }

        if (storedBudgets) {
            setBudgets(JSON.parse(storedBudgets));
        } else {
            setBudgets(MOCK_BUDGETS);
        }

        // Fetch transactions from backend
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions');
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                } else {
                    const storedTx = localStorage.getItem('app_transactions_v2');
                    if (storedTx) setTransactions(JSON.parse(storedTx));
                    else setTransactions(MOCK_TRANSACTIONS);
                }
            } catch (err) {
                console.error("Backend unreachable. Ensure Express server is running on port 5000.", err);
                const storedTx = localStorage.getItem('app_transactions_v2');
                if (storedTx) setTransactions(JSON.parse(storedTx));
                else setTransactions(MOCK_TRANSACTIONS);
            }
        };

        fetchTransactions();

        window.addEventListener('refreshTransactions', fetchTransactions);
        return () => window.removeEventListener('refreshTransactions', fetchTransactions);
    }, []);


    // Persist data when changed
    useEffect(() => {
        if (wallets.length > 0) localStorage.setItem('app_wallets_v2', JSON.stringify(wallets));
    }, [wallets]);

    useEffect(() => {
        localStorage.setItem('app_transactions_v2', JSON.stringify(transactions));

        // Recalculate budget spending whenever transactions change
        setBudgets(prev => prev.map(b => {
            const spent = transactions
                .filter(t => t.type === 'expense' && t.category === b.category)
                .reduce((acc, curr) => acc + curr.amount, 0);
            return { ...b, spent };
        }));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('app_budgets_v2', JSON.stringify(budgets));
    }, [budgets]);


    const handleLogin = (user: User) => {
        setUser(user);
    };

    const handleLogout = () => {
        AuthService.logout();
        setUser(null);
    };

    const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
        const newTx: Transaction = {
            ...txData,
            id: Math.random().toString(36).substr(2, 9),
        };
        
        // Optimistically update UI
        setTransactions(prev => [newTx, ...prev]);

        // Insert into MongoDB backend
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTx)
            });
            if (!res.ok) {
                console.error("Failed to save transaction to backend");
            }
        } catch (error) {
            console.error("Error saving transaction to backend:", error);
        }

        // Update wallet balance locally
        setWallets(prev => prev.map(w => {
            if (w.id === newTx.walletId) {
                let amountToAdd = newTx.amount;
                const change = newTx.type === 'income' ? amountToAdd : -amountToAdd;
                return { ...w, balance: w.balance + change };
            }
            return w;
        }));
    };

    const handleGenerateInsights = async () => {
        setIsLoadingInsights(true);
        try {
            const text = await getSpendingInsights(transactions);
            setAiInsights(text);
        } catch (e) {
            setAiInsights("Failed to generate insights. Check your connection or try again later.");
        } finally {
            setIsLoadingInsights(false);
        }
    };

    const handleGenerateSuggestions = async () => {
        setIsLoadingSuggestions(true);
        try {
            const result = await getAISuggestions(transactions);
            setAiSuggestions(result);
        } catch (e) {
            console.error("Failed to generate suggestions:", e);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const deleteTransaction = async (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        try {
            await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error("Failed to delete from backend:", err);
        }
    };

    // --- RENDER HELPERS ---

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="selection:bg-indigo-500/30">
            <div className="bg-mesh" />
            <div className="bg-dot-pattern fixed inset-0 z-0 opacity-20 pointer-events-none" />

            <div className="flex flex-col md:flex-row min-h-screen relative z-10 p-0 sm:p-2 md:p-4 gap-0 md:gap-4 overflow-hidden">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    userEmail={user.email}
                    userName={user.name}
                />

                <main className="flex-1 p-4 md:p-6 pt-24 md:pt-4 overflow-y-auto h-[100dvh] md:h-[calc(100vh-2rem)] custom-scrollbar sm:glass-panel sm:rounded-[2.5rem] animate-reveal pb-20 md:pb-4 w-full">
                    <header className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-6 mb-8 md:mb-12 px-2 md:px-6">
                        <div className="animate-reveal" style={{ animationDelay: '200ms' }}>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase text-glow break-words">
                                {activeTab === 'dashboard' && 'Neural Overview'}
                                {activeTab === 'wallets' && 'Vault Repository'}
                                {activeTab === 'transactions' && 'Ledger Feed'}
                                {activeTab === 'insights' && 'Gemini Core'}
                                {activeTab === 'suggestions' && 'AI Advisor'}
                                {activeTab === 'investments' && 'Investment Plans'}
                                {activeTab === 'profile' && 'User Profile'}
                                {activeTab === 'settings' && 'Settings'}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-0.5 w-12 bg-indigo-600 rounded-full animate-pulse"></div>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">SpendWiser • Cloud Storage</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 animate-reveal" style={{ animationDelay: '400ms' }}>
                            <div className="hidden 2xl:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                <Database size={14} className="text-green-400 animate-pulse" />
                                <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Live Sync</span>
                            </div>
                            <button
                                onClick={() => setIsParserModalOpen(true)}
                                className="bg-slate-800/50 hover:bg-slate-700/50 text-indigo-400 px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 border border-white/5 transition-all duration-500 hover:border-indigo-500/40"
                            >
                                <MessageSquare size={16} />
                                <span className="hidden lg:inline">Decrypt SMS</span>
                            </button>
                            <button
                                onClick={() => setIsSMSIntegrationOpen(true)}
                                className="bg-slate-800/50 hover:bg-slate-700/50 text-emerald-400 px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 border border-white/5 transition-all duration-500 hover:border-emerald-500/40"
                            >
                                <Smartphone size={16} />
                                <span className="hidden lg:inline">SMS Setup</span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 max-w-[200px] md:flex-none animate-scan bg-indigo-600 hover:bg-indigo-500 text-white px-4 md:px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all duration-500 hover:scale-[1.05] active:scale-95 border border-indigo-400/30"
                            >
                                <Plus size={18} />
                                <span>Initialize Log</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 p-3 rounded-2xl transition-all duration-500 border border-white/5"
                                title="Disconnect Node"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </header>

                    <div className="animate-reveal px-2 pb-10" style={{ animationDelay: '600ms' }}>
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                transactions={transactions}
                                wallets={wallets}
                                budgets={budgets}
                                onSearch={setSearchQuery}
                                searchQuery={searchQuery}
                            />
                        )}

                        {activeTab === 'wallets' && (
                            <VaultsView wallets={wallets} />
                        )}

                        {activeTab === 'transactions' && (
                            <LedgerView transactions={transactions} searchQuery={searchQuery} onSearch={setSearchQuery} onDelete={deleteTransaction} />
                        )}

                        {activeTab === 'insights' && (
                            <InsightsView
                                isLoading={isLoadingInsights}
                                insights={aiInsights}
                                onGenerate={handleGenerateInsights}
                                hasTransactions={transactions.length > 0}
                            />
                        )}

                        {activeTab === 'suggestions' && (
                            <AISuggestionsView
                                isLoading={isLoadingSuggestions}
                                result={aiSuggestions}
                                onGenerate={handleGenerateSuggestions}
                                hasTransactions={transactions.length > 0}
                            />
                        )}

                        {activeTab === 'investments' && (
                            <InvestmentPlansView transactions={transactions} />
                        )}

                        {activeTab === 'profile' && (
                            <UserProfileView user={user} />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsView />
                        )}
                    </div>
                </main>

                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={addTransaction}
                    wallets={wallets}
                />

                <MessageParserModal
                    isOpen={isParserModalOpen}
                    onClose={() => setIsParserModalOpen(false)}
                    onParsed={addTransaction}
                    wallets={wallets}
                />

                <SMSIntegrationModal
                    isOpen={isSMSIntegrationOpen}
                    onClose={() => setIsSMSIntegrationOpen(false)}
                />
            </div>
        </div>
    );
};

export default App;

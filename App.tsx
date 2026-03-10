import React, { useState, useEffect } from 'react';
import { Transaction, Wallet, User, Budget } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VaultsView from './components/VaultsView';
import LedgerView from './components/LedgerView';
import InsightsView from './components/InsightsView';
import TransactionModal from './components/TransactionModal';
import MessageParserModal from './components/MessageParserModal';
import LoginPage from './components/LoginPage';
import { getSpendingInsights } from './services/geminiService';
import { AuthService } from './services/authService';
import { Plus, Sparkles, AlertCircle, LogOut, MessageSquare, Database } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [aiInsights, setAiInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

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

        // Fetch transactions from MongoDB
        const fetchTransactions = async () => {
            try {
                // If the backend isn't running, this will fail gracefully.
                const response = await fetch('http://localhost:5000/api/transactions');
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                } else {
                    console.warn("API returned error, checking localStorage fallback");
                    const storedTx = localStorage.getItem('app_transactions_v2');
                    if (storedTx) setTransactions(JSON.parse(storedTx));
                    else setTransactions(MOCK_TRANSACTIONS);
                }
            } catch (err) {
                console.error("Backend unreachable. Ensure Express server is running on port 5000.", err);
                // Fallback to local storage if Express fails
                const storedTx = localStorage.getItem('app_transactions_v2');
                if (storedTx) setTransactions(JSON.parse(storedTx));
                else setTransactions(MOCK_TRANSACTIONS);
            }
        };

        fetchTransactions();

        // Since n8n/WhatsApp could add a transaction at any time, we'll poll the backend 
        // every 5 seconds for fresh data imitating "Live Sync" behavior without websockets.
        const intervalId = setInterval(fetchTransactions, 5000);

        return () => clearInterval(intervalId);
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
            const res = await fetch('http://localhost:5000/api/transactions', {
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

    // --- RENDER HELPERS ---

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="selection:bg-indigo-500/30">
            <div className="bg-mesh" />
            <div className="bg-dot-pattern fixed inset-0 z-0 opacity-20 pointer-events-none" />

            <div className="flex min-h-screen relative z-10 p-4 gap-4 overflow-hidden">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    userEmail={user.email}
                    userName={user.name}
                />

                <main className="flex-1 p-2 md:p-4 pt-24 md:pt-4 overflow-y-auto h-[calc(100vh-2rem)] custom-scrollbar glass-panel rounded-[2.5rem] animate-reveal">
                    <header className="flex justify-between items-center mb-12 px-6">
                        <div className="animate-reveal" style={{ animationDelay: '200ms' }}>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase text-glow">
                                {activeTab === 'dashboard' && 'Neural Overview'}
                                {activeTab === 'wallets' && 'Vault Repository'}
                                {activeTab === 'transactions' && 'Ledger Feed'}
                                {activeTab === 'insights' && 'Gemini Core'}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-0.5 w-12 bg-indigo-600 rounded-full animate-pulse"></div>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">SpendWiser • Mongo Connected Node</p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-reveal" style={{ animationDelay: '400ms' }}>
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl">
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
                                onClick={() => setIsModalOpen(true)}
                                className="animate-scan bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 border border-indigo-400/30"
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
                            <LedgerView transactions={transactions} searchQuery={searchQuery} onSearch={setSearchQuery} />
                        )}

                        {activeTab === 'insights' && (
                            <InsightsView
                                isLoading={isLoadingInsights}
                                insights={aiInsights}
                                onGenerate={handleGenerateInsights}
                                hasTransactions={transactions.length > 0}
                            />
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
            </div>
        </div>
    );
};

export default App;

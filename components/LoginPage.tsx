import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, User as UserIcon, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (isLoginMode) {
        user = await AuthService.login(email, password);
      } else {
        if (!name.trim()) throw new Error("Name is required");
        user = await AuthService.register(email, password, name);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black selection:bg-indigo-500/30">
      {/* Background Mesh */}
      <div className="bg-mesh opacity-50" />
      <div className="bg-dot-pattern fixed inset-0 z-0 opacity-20 pointer-events-none" />

      {/* HUD Elements */}
      <div className="fixed top-10 left-10 animate-reveal" style={{ animationDelay: '200ms' }}>
        <p className="text-[10px] font-black text-indigo-500/40 uppercase tracking-[0.6em]">System.initialize()</p>
      </div>
      <div className="fixed bottom-10 right-10 animate-reveal" style={{ animationDelay: '400ms' }}>
        <p className="text-[10px] font-black text-slate-500/40 uppercase tracking-[0.4em]">v2.5.0-NEURAL_LINK</p>
      </div>

      <div className="w-full max-w-md relative z-10 animate-reveal" style={{ animationDelay: '300ms' }}>
        <div className="glass-panel p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(79,70,229,0.15)] border border-white/10 relative overflow-hidden group">

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-bl-[100%] blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000" />

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(79,70,229,0.4)] rotate-3 hover:rotate-6 transition-transform duration-500 border border-white/20">
              <span className="text-3xl font-black text-white">S</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase text-glow">
              {isLoginMode ? 'Neural Entry' : 'Create Node'}
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">
              {isLoginMode ? 'Authenticate to proceed' : 'Register new systems node'}
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-4 text-rose-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Subject Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    required={!isLoginMode}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold text-xs uppercase tracking-widest"
                    placeholder="ENTER NAME..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold text-xs uppercase tracking-widest"
                  placeholder="IDENTITY@DOMAIN.SYS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-bold text-xs tracking-widest"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden mt-8 uppercase text-[10px] tracking-[0.3em]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan pointer-events-none" />
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLoginMode ? 'Initialize Connection' : 'Register Protocol'}</span>
                  <Zap size={18} className="animate-pulse" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={toggleMode}
              className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-indigo-400 transition-colors"
            >
              {isLoginMode ? "Need new credentials? [ Sign Up ]" : "ID already registered? [ Sign In ]"}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-3">
            <ShieldCheck size={14} className="text-emerald-500 animate-pulse" />
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
              Secure Neural Encryption Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

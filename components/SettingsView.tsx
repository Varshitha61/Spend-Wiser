import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Eye, Download, Trash2, ToggleRight, ToggleLeft, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

interface AppSettings {
  notifications: boolean;
  emailAlerts: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  autoSync: boolean;
  twoFactorAuth: boolean;
  dataRetention: number; // days
  currency: string;
}

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem('app_settings');
    return stored ? JSON.parse(stored) : {
      notifications: true,
      emailAlerts: false,
      soundEnabled: true,
      darkMode: true,
      autoSync: true,
      twoFactorAuth: false,
      dataRetention: 365,
      currency: 'INR',
    };
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [settings]);

  const toggleSetting = async (key: keyof AppSettings) => {
    // OS-Level Notification Prompt
    if (key === 'notifications' && !settings.notifications) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notification permission denied. Please allow notifications in your browser or phone settings.');
          return; // Abort toggle if denied
        }
      } else {
        alert('Your browser or device does not support push notifications.');
        return;
      }
    }

    // OS-Level Sound Prompt (Plays a test beep to interact with device audio)
    if (key === 'soundEnabled' && !settings.soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = 880; // High beep
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100);
      } catch (e) {
        console.log("Audio API not supported");
      }
    }

    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }));
  };

  const handleExportData = async () => {
    try {
      // First try to fetch real transactions from backend
      let realTransactions = [];
      const res = await fetch('/api/transactions');
      if (res.ok) {
        realTransactions = await res.json();
      } else {
        realTransactions = JSON.parse(localStorage.getItem('app_transactions_v2') || '[]');
      }

      const data = {
        transactions: realTransactions,
        wallets: JSON.parse(localStorage.getItem('app_wallets_v2') || '[]'),
        budgets: JSON.parse(localStorage.getItem('app_budgets_v2') || '[]'),
        settings: settings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spendwiser-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Failed to export. Check your connection.");
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure? This will delete all your data permanently from the server and local device.')) {
      try {
        await fetch('/api/data/clear', { method: 'DELETE' });
        localStorage.removeItem('app_transactions_v2');
        localStorage.removeItem('app_wallets_v2');
        localStorage.removeItem('app_budgets_v2');
        window.location.reload();
      } catch (e) {
        alert("Failed to clear data from backend.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-reveal">
      {/* Settings Header */}
      <div className="glass-panel bg-gradient-to-br from-indigo-950/40 to-slate-950/80 rounded-[4rem] p-14 text-white border border-white/10 relative overflow-hidden group shadow-[0_0_150px_rgba(99,102,241,0.1)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000 animate-pulse" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20">
            <Settings size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 text-glow">Settings</h2>
            <p className="text-slate-400 text-sm">Customize your SpendWiser experience</p>
          </div>
        </div>
      </div>

      {/* Notifications & Alerts */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Bell size={20} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Notifications & Alerts</h3>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Push Notifications</p>
              <p className="text-xs text-slate-500">Get alerts for transactions and budget updates</p>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className="transition-all"
            >
              {settings.notifications ? (
                <ToggleRight size={32} className="text-emerald-400" />
              ) : (
                <ToggleLeft size={32} className="text-slate-600" />
              )}
            </button>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Email Alerts</p>
              <p className="text-xs text-slate-500">Receive weekly spending summaries via email</p>
            </div>
            <button
              onClick={() => toggleSetting('emailAlerts')}
              className="transition-all"
            >
              {settings.emailAlerts ? (
                <ToggleRight size={32} className="text-emerald-400" />
              ) : (
                <ToggleLeft size={32} className="text-slate-600" />
              )}
            </button>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Sound Effects</p>
              <p className="text-xs text-slate-500">Play sound on transaction notifications</p>
            </div>
            <button
              onClick={() => toggleSetting('soundEnabled')}
              className="transition-all"
            >
              {settings.soundEnabled ? (
                <Volume2 size={24} className="text-emerald-400" />
              ) : (
                <VolumeX size={24} className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Display & Theme */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Eye size={20} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Display & Theme</h3>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Dark Mode</p>
              <p className="text-xs text-slate-500">Always enabled for optimal viewing</p>
            </div>
            <div className="flex items-center gap-2">
              <Moon size={20} className="text-indigo-400" />
              <span className="text-xs font-black text-slate-500 uppercase">ON</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black text-white uppercase tracking-tight">Currency</p>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 text-white font-black text-xs uppercase"
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">Default currency for all transactions</p>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <Lock size={20} className="text-rose-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Security & Privacy</h3>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add extra security to your account</p>
            </div>
            <button
              onClick={() => toggleSetting('twoFactorAuth')}
              className="transition-all"
            >
              {settings.twoFactorAuth ? (
                <ToggleRight size={32} className="text-emerald-400" />
              ) : (
                <ToggleLeft size={32} className="text-slate-600" />
              )}
            </button>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight mb-1">Auto-Sync</p>
              <p className="text-xs text-slate-500">Automatically sync data across devices</p>
            </div>
            <button
              onClick={() => toggleSetting('autoSync')}
              className="transition-all"
            >
              {settings.autoSync ? (
                <ToggleRight size={32} className="text-emerald-400" />
              ) : (
                <ToggleLeft size={32} className="text-slate-600" />
              )}
            </button>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black text-white uppercase tracking-tight">Data Retention</p>
              <select
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
                className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 text-white font-black text-xs uppercase"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
                <option value={180}>6 Months</option>
                <option value={365}>1 Year</option>
                <option value={730}>2 Years</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">How long to keep transaction history</p>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Download size={20} className="text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Data Management</h3>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full glass-panel p-6 rounded-[2.5rem] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Download size={20} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase tracking-tight">Export Data</p>
                <p className="text-xs text-slate-500">Download all your data as JSON backup</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400 uppercase">Export</span>
          </button>

          <button
            onClick={handleClearData}
            className="w-full glass-panel p-6 rounded-[2.5rem] border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:scale-110 transition-transform">
                <Trash2 size={20} className="text-rose-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase tracking-tight">Clear All Data</p>
                <p className="text-xs text-slate-500">Permanently delete all transactions and settings</p>
              </div>
            </div>
            <span className="text-xs font-black text-rose-400 uppercase">Delete</span>
          </button>
        </div>
      </section>

      {/* Save Indicator */}
      {saved && (
        <div className="fixed bottom-8 right-8 glass-panel px-6 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-3 animate-reveal">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Settings Saved</span>
        </div>
      )}

      {/* Info Box */}
      <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">💡 Tip</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          All settings are saved locally in your browser. Export your data regularly to keep a backup. Your bank details are never sent to external servers.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;

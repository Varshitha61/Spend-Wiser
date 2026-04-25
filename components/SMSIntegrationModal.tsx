import React, { useState } from 'react';
import { X, Copy, Check, AlertCircle, Smartphone, Zap } from 'lucide-react';

interface SMSIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SMSIntegrationModal: React.FC<SMSIntegrationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${window.location.origin.replace('3000', '5000')}/api/sms/webhook`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-reveal">
      <div className="glass-panel rounded-[3rem] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 flex items-center justify-between p-8 border-b border-white/5 bg-black/40 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Smartphone size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">SMS Integration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">How It Works</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Connect your bank's SMS notifications to automatically log transactions. Every time your bank sends a debit/credit SMS, it will be parsed and added to your ledger.
            </p>
            <div className="space-y-3">
              <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-xs font-black text-indigo-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-black text-white mb-1">Set up SMS forwarding</p>
                  <p className="text-xs text-slate-500">Forward your bank SMS to a service like Twilio or AWS SNS</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-xs font-black text-indigo-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-black text-white mb-1">Configure webhook</p>
                  <p className="text-xs text-slate-500">Point the SMS service to the webhook URL below</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-xs font-black text-indigo-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-black text-white mb-1">Auto-logging</p>
                  <p className="text-xs text-slate-500">Transactions are automatically parsed and added to your ledger</p>
                </div>
              </div>
            </div>
          </section>

          {/* Webhook URL */}
          <section>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Webhook URL</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-3">Copy this URL to your SMS service provider</p>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-xs text-slate-300 break-all">
                {webhookUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-6 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="text-indigo-400" />
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Copy</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Setup Instructions */}
          <section>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Setup Instructions</h3>
            
            <div className="space-y-6">
              {/* Twilio Option */}
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Option 1: Using Twilio
                </h4>
                <ol className="space-y-2 text-xs text-slate-400">
                  <li>1. Sign up at <span className="text-indigo-400">twilio.com</span></li>
                  <li>2. Get a Twilio phone number</li>
                  <li>3. Set up SMS forwarding from your bank to Twilio</li>
                  <li>4. In Twilio console, set the webhook URL above for incoming messages</li>
                  <li>5. Bank SMS will now auto-sync to SpendWiser</li>
                </ol>
              </div>

              {/* Manual Option */}
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-emerald-400" />
                  Option 2: Manual SMS Parsing
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  If you can't set up automatic forwarding, use the "Decrypt SMS" button in the app to manually paste bank SMS messages.
                </p>
                <p className="text-xs text-slate-500 italic">
                  Supported formats: HDFC, ICICI, Axis, SBI, and most Indian banks
                </p>
              </div>

              {/* API Format */}
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">API Request Format</h4>
                <div className="bg-black/40 p-4 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto">
                  <pre>{`POST /api/sms/webhook
Content-Type: application/json

{
  "message": "Debit of ₹500 from your account at Starbucks",
  "from": "+919876543210",
  "timestamp": "2026-04-24"
}`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Supported Banks */}
          <section>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Supported Banks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['HDFC', 'ICICI', 'Axis', 'SBI', 'IDBI', 'Kotak', 'Yes Bank', 'IndusInd', 'HSBC'].map(bank => (
                <div key={bank} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <p className="text-xs font-black text-slate-400">{bank}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Warning */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
            <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Security Note</p>
              <p className="text-xs text-amber-300/80">
                Your bank SMS contains sensitive information. Only use trusted SMS forwarding services. Never share your webhook URL publicly.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSIntegrationModal;

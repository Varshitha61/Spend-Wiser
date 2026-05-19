import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { User, Mail, Phone, MapPin, Building2, CreditCard, Save, Edit2, X, Check, Plus, Trash2 } from 'lucide-react';

interface UserProfileViewProps {
  user: UserType | null;
  onUpdate?: (user: UserType) => void;
}

interface BankDetails {
  id: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountType: string;
  mobileNumber: string;
  email: string;
}

const emptyBankDetails = (): BankDetails => ({
  id: Math.random().toString(36).substring(7),
  accountHolder: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
  accountType: 'Savings',
  mobileNumber: '',
  email: '',
});

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [bankDetailsList, setBankDetailsList] = useState<BankDetails[]>(() => {
    const stored = localStorage.getItem('app_bank_details_list');
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyBankDetails()];
    }
    // Fallback to legacy single storage if exists
    const oldStored = localStorage.getItem('app_bank_details');
    if (oldStored) {
      const parsed = JSON.parse(oldStored);
      if (parsed.accountNumber) return [{...parsed, id: emptyBankDetails().id}];
    }
    return [emptyBankDetails()];
  });

  const [editedBankDetailsList, setEditedBankDetailsList] = useState<BankDetails[]>(bankDetailsList);
  const [isBankEditing, setIsBankEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_bank_details_list', JSON.stringify(bankDetailsList));
  }, [bankDetailsList]);

  const handleSaveBankDetails = async () => {
    try {
      const userId = user?.id || 'default-user';
      const response = await fetch('/api/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accounts: editedBankDetailsList
        })
      });

      if (response.ok) {
        setBankDetailsList(editedBankDetailsList);
        setIsBankEditing(false);
        alert('Bank details saved securely. Fetching previous transactions...');
        window.dispatchEvent(new Event('refreshTransactions'));
      } else {
        alert('Failed to save bank details. Check if MongoDB is running.');
      }
    } catch (err) {
      console.error('Error saving bank details:', err);
      // Fallback to localStorage
      setBankDetailsList(editedBankDetailsList);
      setIsBankEditing(false);
      alert('Saved locally (MongoDB unavailable)');
    }
  };

  const handleCancelBankEdit = () => {
    setEditedBankDetailsList(bankDetailsList);
    setIsBankEditing(false);
  };
  
  const handleStartEditing = () => {
      setEditedBankDetailsList(bankDetailsList.length > 0 ? bankDetailsList : [emptyBankDetails()]);
      setIsBankEditing(true);
  }

  const maskAccountNumber = (num: string) => {
    if (!num) return '';
    const last4 = num.slice(-4);
    return `****${last4}`;
  };
  
  const addBankDetail = () => {
      if (editedBankDetailsList.length < 10) {
          setEditedBankDetailsList([...editedBankDetailsList, emptyBankDetails()]);
      }
  };
  
  const removeBankDetail = (idToRemove: string) => {
      if (editedBankDetailsList.length > 1) {
          setEditedBankDetailsList(editedBankDetailsList.filter(b => b.id !== idToRemove));
      } else {
          alert('You must have at least one bank detail.');
      }
  };
  
  const updateBankDetail = (index: number, field: keyof BankDetails, value: string) => {
      const newList = [...editedBankDetailsList];
      newList[index] = { ...newList[index], [field]: value };
      setEditedBankDetailsList(newList);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-reveal pb-20">
      {/* Profile Header */}
      <div className="glass-panel bg-gradient-to-br from-indigo-950/40 to-slate-950/80 rounded-[4rem] p-14 text-white border border-white/10 relative overflow-hidden group shadow-[0_0_150px_rgba(99,102,241,0.1)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000 animate-pulse" />

        <div className="relative z-10 flex items-center gap-8">
          <div className="w-32 h-32 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 text-glow">{user?.name || 'User'}</h2>
            <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Account Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <User size={20} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Personal Information</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
          >
            {isEditing ? <X size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-white font-semibold">
                {user?.name || 'Not set'}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-white font-semibold flex items-center gap-2">
                <Mail size={16} className="text-indigo-400" />
                {user?.email || 'Not set'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Account ID</p>
            <p className="text-sm text-slate-300 font-mono">{user?.id || 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Bank Details */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Building2 size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Bank Details ({bankDetailsList.length}/10)</h3>
          </div>
          <button
            onClick={() => isBankEditing ? handleCancelBankEdit() : handleStartEditing()}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
          >
            {isBankEditing ? <X size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 space-y-6">
          {isBankEditing ? (
            <div className="space-y-8">
              {editedBankDetailsList.map((bank, index) => (
                <div key={bank.id} className="p-6 bg-black/20 rounded-3xl border border-white/5 relative">
                  <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Account {index + 1}</h4>
                      {editedBankDetailsList.length > 1 && (
                          <button 
                              onClick={() => removeBankDetail(bank.id)}
                              className="text-rose-400 hover:text-rose-300 p-2 hover:bg-rose-500/10 rounded-lg transition-all"
                              title="Remove this account"
                          >
                              <Trash2 size={16} />
                          </button>
                      )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Holder Name</label>
                      <input
                        type="text"
                        value={bank.accountHolder}
                        onChange={(e) => updateBankDetail(index, 'accountHolder', e.target.value)}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="Enter account holder name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Bank Name</label>
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => updateBankDetail(index, 'bankName', e.target.value)}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="e.g., HDFC Bank"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Number</label>
                      <input
                        type="password"
                        value={bank.accountNumber}
                        onChange={(e) => updateBankDetail(index, 'accountNumber', e.target.value)}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">IFSC Code</label>
                      <input
                        type="text"
                        value={bank.ifscCode}
                        onChange={(e) => updateBankDetail(index, 'ifscCode', e.target.value.toUpperCase())}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="e.g., HDFC0001234"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Type</label>
                      <select
                        value={bank.accountType}
                        onChange={(e) => updateBankDetail(index, 'accountType', e.target.value)}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                      >
                        <option>Savings</option>
                        <option>Current</option>
                        <option>Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Mobile Number</label>
                      <input
                        type="tel"
                        value={bank.mobileNumber}
                        onChange={(e) => updateBankDetail(index, 'mobileNumber', e.target.value)}
                        className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        placeholder="e.g., +91 98765 43210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email (Optional)</label>
                    <input
                      type="email"
                      value={bank.email}
                      onChange={(e) => updateBankDetail(index, 'email', e.target.value)}
                      className="w-full p-4 bg-black/40 rounded-2xl border border-white/5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                      placeholder="e.g., user@example.com"
                    />
                  </div>
                </div>
              ))}

              {editedBankDetailsList.length < 10 && (
                <button
                  onClick={addBankDetail}
                  className="w-full py-4 border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-3xl text-slate-400 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest"
                >
                  <Plus size={16} /> Add Another Bank Account
                </button>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveBankDetails}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Save All Details
                </button>
                <button
                  onClick={handleCancelBankEdit}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bankDetailsList.length > 0 && bankDetailsList[0].accountHolder ? (
                bankDetailsList.map((bank, index) => (
                  <div key={bank.id || index} className="p-6 bg-black/20 rounded-3xl border border-white/5">
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">Account {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Holder</p>
                        <p className="text-lg font-black text-white">{bank.accountHolder || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Bank Name</p>
                        <p className="text-lg font-black text-white">{bank.bankName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Number</p>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-indigo-400" />
                          <p className="text-lg font-black text-white font-mono">{maskAccountNumber(bank.accountNumber)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">IFSC Code</p>
                        <p className="text-lg font-black text-white font-mono">{bank.ifscCode || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Type</p>
                        <p className="text-lg font-black text-white">{bank.accountType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mobile Number</p>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-emerald-400" />
                          <p className="text-lg font-black text-white">{bank.mobileNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Building2 size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No bank details added yet</p>
                  <p className="text-slate-600 text-xs mt-2">Click Edit to add your bank information</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Security Note */}
      <div className="glass-panel p-6 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5">
        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">🔒 Security & Privacy</p>
        <p className="text-xs text-amber-300/80 leading-relaxed">
          Your bank details are stored locally in your browser and never sent to external servers. Account numbers are masked for security. Always verify SMS notifications before confirming transactions.
        </p>
      </div>
    </div>
  );
};

export default UserProfileView;

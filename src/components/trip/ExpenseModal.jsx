import React from 'react';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import ModalPortal from '../common/ModalPortal';
import Select from '../common/Select';

const ExpenseModal = ({
    isOpen,
    onClose,
    onSubmit,
    expenseData,
    setExpenseData,
    tripMembers,
    userId,
    categories,
    isSubmitting,
    editingId
}) => {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(5, 10, 24, 0.92)' }} className="animate-fade-in">
                <div className="glass-modal rounded-3xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/[0.06] rounded-lg"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Description</label>
                                <input
                                    type="text"
                                    required
                                    value={expenseData.description}
                                    onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                                    className="w-full glass-input"
                                    placeholder="Dinner, Flight, etc."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        value={expenseData.amount}
                                        onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Currency</label>
                                    <Select
                                        options={['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD']}
                                        value={expenseData.currency}
                                        onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
                                        className="w-full glass-input py-3 px-4"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Who Paid?</label>
                                <div className="flex flex-wrap gap-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {tripMembers.map(member => {
                                        const isSelected = expenseData.payer === member._id;
                                        return (
                                            <button
                                                key={member._id}
                                                type="button"
                                                onClick={() => setExpenseData({ ...expenseData, payer: member._id })}
                                                className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left flex-1 min-w-[140px] ${isSelected ? 'bg-purple-500/10 border-purple-500/40 text-purple-100 shadow-lg shadow-purple-500/10' : 'glass text-slate-400 hover:bg-white/[0.06]'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white' : 'bg-white/[0.06] text-slate-400'}`}>
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-xs font-bold truncate">{member.name}</span>
                                                    {member._id === userId && <span className="text-[9px] opacity-60">Admin (Me)</span>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setExpenseData({ ...expenseData, category: cat })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${expenseData.category === cat ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20' : 'glass text-slate-400 hover:bg-white/[0.06]'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Participants (Split With)</label>
                                <div className="grid grid-cols-2 gap-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                    {tripMembers.map(member => {
                                        const isSelected = expenseData.participants.includes(member._id);
                                        return (
                                            <button
                                                key={member._id}
                                                type="button"
                                                onClick={() => {
                                                    const participants = isSelected
                                                        ? expenseData.participants.filter(id => id !== member._id)
                                                        : [...expenseData.participants, member._id];
                                                    setExpenseData({ ...expenseData, participants });
                                                }}
                                                className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${isSelected ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100' : 'glass text-slate-400 hover:bg-white/[0.06]'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-400' : 'border-slate-600'}`}>
                                                    {isSelected && <Plus size={12} className="text-white rotate-45 scale-75" />}
                                                </div>
                                                <span className="text-xs font-bold truncate">{member.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || expenseData.participants.length === 0}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <DollarSign size={20} />}
                                {editingId ? 'Update Expense' : 'Save Expense'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default ExpenseModal;

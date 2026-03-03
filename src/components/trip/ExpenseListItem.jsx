import React from 'react';
import { Receipt, Edit2, Trash2 } from 'lucide-react';

const ExpenseListItem = ({ expense, trip, isAdmin, onEdit, onDelete }) => {
    return (
        <div className="group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.08] transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Receipt size={24} />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{expense.description}</h4>
                <p className="text-xs text-slate-500 font-medium">
                    Paid by {expense.payer?.name} • {expense.category}
                </p>
            </div>

            <div className="text-right">
                <div className="font-black text-white">
                    {expense.amount.toLocaleString()} {expense.currency}
                </div>
                {expense.currency !== trip.baseCurrency && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        ≈ {expense.convertedAmount?.toLocaleString()} {trip.baseCurrency}
                    </div>
                )}
            </div>

            {isAdmin && trip.status === 'active' && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => onEdit(expense)}
                        className="p-2 text-slate-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(expense._id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpenseListItem;

import React from 'react';
import { ArrowRightLeft, ChevronRight, AlertCircle, Plus } from 'lucide-react';

const SettlementView = ({ trip, analytics, onSimplifyDebts }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold italic underline decoration-purple-500/50 underline-offset-8">Settlement</h2>

            {trip.status === 'completed' ? (
                <>
                    {/* Suggested Transactions */}
                    {analytics?.suggestedSettlements?.length > 0 && (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                <ArrowRightLeft size={16} />
                                Suggested Payments
                            </h3>
                            <div className="space-y-3">
                                {analytics.suggestedSettlements.map((s, i) => {
                                    const fromMember = trip.members.find(m => m._id === s.from);
                                    const toMember = trip.members.find(m => m._id === s.to);
                                    return (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                            <span className="font-bold text-xs text-indigo-200 truncate max-w-[80px]">{fromMember?.name}</span>
                                            <ChevronRight size={14} className="text-indigo-500 shrink-0" />
                                            <span className="font-bold text-xs text-indigo-200 truncate max-w-[80px]">{toMember?.name}</span>
                                            <div className="ml-auto font-black text-indigo-100 text-sm whitespace-nowrap">
                                                {s.amount.toLocaleString()} <span className="text-[10px] opacity-60">{trip.baseCurrency}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-start gap-2 text-[10px] text-indigo-400 font-medium">
                                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                                <span>This is the most efficient way to settle all debts in {analytics.suggestedSettlements.length} moves.</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Balances</h3>

                        <div className="space-y-4">
                            {trip.members.map((member) => {
                                const balance = analytics?.balances?.[member._id] || 0;
                                const isPositive = balance >= 0;

                                return (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-sm">{member.name}</span>
                                        </div>
                                        <div className={`text-right ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <div className="text-sm font-black">
                                                {isPositive ? '+' : ''}{balance.toLocaleString()}
                                            </div>
                                            <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                                                {isPositive ? 'Owed to' : 'Owes'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {onSimplifyDebts && (
                            <div className="pt-4 border-t border-white/5">
                                <button
                                    onClick={onSimplifyDebts}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 transition-all border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} />
                                    Simplify Debts
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="font-black text-xl">Trip is Live</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Settlement suggestions will be available once the trip is marked as completed by the admin.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SettlementView;

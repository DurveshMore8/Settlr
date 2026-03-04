import { useState } from 'react';
import {
    ArrowRightLeft, ChevronRight, AlertCircle,
    CheckCircle2, Clock, CreditCard, Banknote,
    Loader2, Check, DollarSign
} from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const METHODS = ['Cash', 'Venmo', 'PayPal', 'Bank Transfer', 'UPI', 'Other'];

const METHOD_ICONS = {
    Cash: '💵',
    Venmo: '💜',
    PayPal: '🅿️',
    'Bank Transfer': '🏦',
    UPI: '📱',
    Other: '💳',
};

const SettlementView = ({ trip, analytics, user, onRefresh }) => {
    const [markingId, setMarkingId] = useState(null); // which suggested settlement is being marked
    const [selectedMethod, setSelectedMethod] = useState('Cash');
    const [isSending, setIsSending] = useState(false);
    const [confirmingId, setConfirmingId] = useState(null);

    const settlements = analytics?.settlements || [];
    const confirmedCount = settlements.filter(s => s.status === 'confirmed').length;
    const pendingCount = settlements.filter(s => s.status === 'pending').length;
    const suggestedCount = analytics?.suggestedSettlements?.length || 0;

    const handleMarkAsPaid = async (settlement) => {
        setIsSending(true);
        try {
            await API.post(`/trips/${trip._id}/expenses/settlements`, {
                to: settlement.to,
                amount: settlement.amount,
                method: selectedMethod,
            });
            toast.success('Payment recorded! Waiting for confirmation.');
            setMarkingId(null);
            setSelectedMethod('Cash');
            if (onRefresh) onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment');
        } finally {
            setIsSending(false);
        }
    };

    const handleConfirm = async (settlementId) => {
        setConfirmingId(settlementId);
        try {
            await API.put(`/settlements/${settlementId}/confirm`);
            toast.success('Payment confirmed! ✅');
            if (onRefresh) onRefresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to confirm payment');
        } finally {
            setConfirmingId(null);
        }
    };

    // Check if a suggested settlement already has a matching pending/confirmed record
    const isAlreadySettled = (suggested) => {
        return settlements.some(s =>
            s.from._id === suggested.from &&
            s.to._id === suggested.to &&
            Math.abs(s.amount - suggested.amount) < 0.01
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold italic underline decoration-purple-500/50 underline-offset-8 text-white">Settlement</h2>

            {trip.status === 'completed' ? (
                <>
                    {/* Progress */}
                    {suggestedCount > 0 && (
                        <div className="glass-card rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Settlement Progress</span>
                                <span className="text-xs font-bold text-slate-300">
                                    {confirmedCount} / {suggestedCount} settled
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                                    style={{ width: `${suggestedCount > 0 ? (confirmedCount / suggestedCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Suggested Payments with Actions */}
                    {analytics?.suggestedSettlements?.length > 0 && (
                        <div className="bg-indigo-500/[0.06] border border-indigo-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                <ArrowRightLeft size={16} />
                                Suggested Payments
                            </h3>
                            <div className="space-y-3">
                                {analytics.suggestedSettlements.map((s, i) => {
                                    const fromMember = trip.members.find(m => m._id === s.from);
                                    const toMember = trip.members.find(m => m._id === s.to);
                                    const alreadySettled = isAlreadySettled(s);
                                    const matchingSettlement = settlements.find(
                                        st => st.from._id === s.from && st.to._id === s.to && Math.abs(st.amount - s.amount) < 0.01
                                    );
                                    const isCurrentUserDebtor = user?._id === s.from;
                                    const isCurrentUserCreditor = user?._id === s.to;
                                    const isMarkingThis = markingId === i;

                                    return (
                                        <div key={i} className="rounded-2xl border border-indigo-500/10 overflow-hidden">
                                            {/* Main row */}
                                            <div className="flex items-center gap-3 p-3 bg-indigo-500/[0.04]">
                                                <span className="font-bold text-xs text-indigo-200 truncate max-w-[80px]">{fromMember?.name}</span>
                                                <ChevronRight size={14} className="text-indigo-500 shrink-0" />
                                                <span className="font-bold text-xs text-indigo-200 truncate max-w-[80px]">{toMember?.name}</span>
                                                <div className="ml-auto flex items-center gap-3">
                                                    <div className="font-black text-indigo-100 text-sm whitespace-nowrap">
                                                        {s.amount.toLocaleString()} <span className="text-[10px] opacity-60">{trip.baseCurrency}</span>
                                                    </div>

                                                    {/* Status / Action badges */}
                                                    {alreadySettled && matchingSettlement ? (
                                                        matchingSettlement.status === 'confirmed' ? (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/15">
                                                                <CheckCircle2 size={12} /> Settled
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
                                                                <Clock size={12} /> Pending
                                                            </span>
                                                        )
                                                    ) : isCurrentUserDebtor ? (
                                                        <button
                                                            onClick={() => setMarkingId(isMarkingThis ? null : i)}
                                                            className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/15 hover:bg-purple-500/20 transition-all"
                                                        >
                                                            💸 Mark as Paid
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Expanded: Payment Method Selector */}
                                            {isMarkingThis && (
                                                <div className="p-4 bg-indigo-500/[0.02] border-t border-indigo-500/10 animate-fade-in">
                                                    <p className="text-xs text-slate-400 font-medium mb-3">How did you pay?</p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {METHODS.map(m => (
                                                            <button
                                                                key={m}
                                                                onClick={() => setSelectedMethod(m)}
                                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${selectedMethod === m
                                                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                                                        : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                                                                    }`}
                                                            >
                                                                {METHOD_ICONS[m]} {m}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => handleMarkAsPaid(s)}
                                                        disabled={isSending}
                                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {isSending ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                                                        Confirm Payment of {s.amount.toLocaleString()} {trip.baseCurrency}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Expanded: Creditor Confirm */}
                                            {alreadySettled && matchingSettlement?.status === 'pending' && isCurrentUserCreditor && (
                                                <div className="p-4 bg-amber-500/[0.03] border-t border-amber-500/10 animate-fade-in">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs text-amber-300 font-bold">
                                                                {fromMember?.name} says they paid via {METHOD_ICONS[matchingSettlement.method]} {matchingSettlement.method}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">
                                                                Recorded {new Date(matchingSettlement.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleConfirm(matchingSettlement._id)}
                                                            disabled={confirmingId === matchingSettlement._id}
                                                            className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold px-4 py-2 rounded-xl text-xs border border-emerald-500/20 transition-all"
                                                        >
                                                            {confirmingId === matchingSettlement._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Check size={14} />
                                                            )}
                                                            Confirm Received
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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

                    {/* Settlement History */}
                    {settlements.length > 0 && (
                        <div className="glass-card rounded-3xl p-6 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <CreditCard size={14} />
                                Payment History ({settlements.length})
                            </h3>
                            <div className="space-y-2">
                                {settlements.map((s) => (
                                    <div key={s._id} className="flex items-center justify-between p-3 rounded-2xl glass">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.status === 'confirmed'
                                                    ? 'bg-emerald-500/10'
                                                    : 'bg-amber-500/10'
                                                }`}>
                                                {s.status === 'confirmed' ? (
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                ) : (
                                                    <Clock size={14} className="text-amber-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-slate-200 truncate">
                                                    {s.from.name} → {s.to.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                    <span>{METHOD_ICONS[s.method]} {s.method}</span>
                                                    <span>•</span>
                                                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <div className="text-sm font-black text-white">
                                                {s.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{trip.baseCurrency}</span>
                                            </div>
                                            {s.status === 'confirmed' ? (
                                                <span className="text-[9px] font-bold text-emerald-400 uppercase">Settled</span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-amber-400 uppercase">Awaiting</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Balances */}
                    <div className="glass-card rounded-3xl p-6 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            {confirmedCount > 0 ? 'Remaining Balances' : 'Balances'}
                        </h3>

                        <div className="space-y-4">
                            {trip.members.map((member) => {
                                const balance = confirmedCount > 0
                                    ? (analytics?.remainingBalances?.[member._id] || 0)
                                    : (analytics?.balances?.[member._id] || 0);
                                const isPositive = balance >= 0;
                                const isSettled = Math.abs(balance) < 0.01;

                                return (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-2xl glass">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-xs font-bold text-slate-300 border border-white/[0.06]">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-sm text-slate-200">{member.name}</span>
                                        </div>
                                        <div className={`text-right ${isSettled ? 'text-slate-500' : isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <div className="text-sm font-black">
                                                {isSettled ? '0.00' : `${isPositive ? '+' : ''}${balance.toFixed(2)}`}
                                            </div>
                                            <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                                                {isSettled ? 'Settled' : isPositive ? 'Owed to' : 'Owes'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-slate-500 mb-2">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="font-black text-xl text-white">Trip is Live</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Settlement suggestions will be available once the trip is marked as completed by the admin.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SettlementView;

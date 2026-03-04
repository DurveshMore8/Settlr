import { useState, useEffect } from 'react';
import { X, Copy, Send, Mail, Check, Clock, Loader2, UserCheck, Link2, RotateCw } from 'lucide-react';
import ModalPortal from '../common/ModalPortal';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const InviteModal = ({ isOpen, onClose, trip }) => {
    const [emailInput, setEmailInput] = useState('');
    const [invitations, setInvitations] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(null);

    const inviteLink = `${window.location.origin}/join/${trip?.inviteCode}`;

    // Fetch invitations on open
    useEffect(() => {
        if (isOpen && trip?._id) {
            fetchInvitations();
        }
    }, [isOpen, trip?._id]);

    const fetchInvitations = async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get(`/trips/${trip._id}/invitations`);
            setInvitations(data);
        } catch (err) {
            // silently fail — invitations list is non-critical
        } finally {
            setIsLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success('Invite link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendInvites = async () => {
        const emails = emailInput
            .split(/[,;\s]+/)
            .map(e => e.trim())
            .filter(e => e && e.includes('@'));

        if (emails.length === 0) {
            toast.error('Please enter at least one valid email');
            return;
        }

        setIsSending(true);
        try {
            const { data } = await API.post(`/trips/${trip._id}/invitations`, { emails });
            setInvitations(data.invitations);
            setEmailInput('');

            const sentCount = data.results.filter(r => r.status === 'pending').length;
            const alreadyCount = data.results.filter(r => r.status === 'already_member').length;

            if (sentCount > 0) toast.success(`Invited ${sentCount} person(s)!`);
            if (alreadyCount > 0) toast('Some emails are already members', { icon: 'ℹ️' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send invitations');
        } finally {
            setIsSending(false);
        }
    };

    const handleResend = async (email) => {
        setResendingEmail(email);
        try {
            const { data } = await API.post(`/trips/${trip._id}/invitations/resend`, { email });
            setInvitations(data.invitations);
            if (data.success) {
                toast.success(`Invitation resent to ${email}`);
            } else {
                toast.error(data.message || 'Failed to resend email');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend invitation');
        } finally {
            setResendingEmail(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendInvites();
        }
    };

    if (!isOpen) return null;

    const pendingInvites = invitations.filter(inv => inv.status === 'pending');
    const acceptedInvites = invitations.filter(inv => inv.status === 'accepted');

    return (
        <ModalPortal>
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(5, 10, 24, 0.92)' }}
                className="animate-fade-in"
            >
                <div className="glass-modal rounded-3xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white">Invite Friends</h2>
                                <p className="text-sm text-slate-500 mt-1">Share a link or send email invites</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/[0.06] rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* ═══ Section 1: Share Link ═══ */}
                        <div className="mb-8">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <Link2 size={14} className="text-purple-400" />
                                Share Link
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300 font-mono truncate select-all">
                                    {inviteLink}
                                </div>
                                <button
                                    onClick={copyLink}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${copied
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-purple-600/20 text-purple-300 border border-purple-500/20 hover:bg-purple-600/30'
                                        }`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* ═══ Section 2: Email Invite ═══ */}
                        <div className="mb-8">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <Mail size={14} className="text-indigo-400" />
                                Send Email Invites
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter emails (comma separated)"
                                    className="flex-1 input-field text-sm"
                                />
                                <button
                                    onClick={handleSendInvites}
                                    disabled={isSending || !emailInput.trim()}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                >
                                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Send
                                </button>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">Separate multiple emails with commas</p>
                        </div>

                        {/* ═══ Section 3: Invitation Status ═══ */}
                        {(isLoading || invitations.length > 0) && (
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    <UserCheck size={14} className="text-emerald-400" />
                                    Invitations ({invitations.length})
                                </label>

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 size={20} className="animate-spin text-slate-500" />
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                        {pendingInvites.map((inv, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl glass">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                                        <Clock size={14} className="text-amber-400" />
                                                    </div>
                                                    <span className="text-sm text-slate-300 truncate">{inv.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    <button
                                                        onClick={() => handleResend(inv.email)}
                                                        disabled={resendingEmail === inv.email}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Resend invitation"
                                                    >
                                                        {resendingEmail === inv.email ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <RotateCw size={12} />
                                                        )}
                                                        Resend
                                                    </button>
                                                    <span className="text-xs font-bold text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
                                                        Pending
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {acceptedInvites.map((inv, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl glass">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                        <Check size={14} className="text-emerald-400" />
                                                    </div>
                                                    <span className="text-sm text-slate-300 truncate">{inv.email}</span>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/15 shrink-0 ml-2">
                                                    Accepted
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default InviteModal;

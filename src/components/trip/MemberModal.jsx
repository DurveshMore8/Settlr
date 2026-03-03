import React from 'react';
import { X, UserMinus } from 'lucide-react';
import ModalPortal from '../common/ModalPortal';

const MemberModal = ({
    isOpen,
    onClose,
    members,
    adminId,
    currentUserId,
    onRemoveMember
}) => {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(5, 10, 24, 0.92)' }} className="animate-fade-in">
                <div className="glass-modal rounded-3xl w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">Trip Members</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/[0.06] rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {members.map((member) => {
                                const isMemberAdmin = adminId === member._id;
                                const canRemove = adminId === currentUserId && !isMemberAdmin;

                                return (
                                    <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl glass group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center font-bold text-slate-300 border border-white/[0.06]">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold flex items-center gap-2 text-white">
                                                    {member.name}
                                                    {isMemberAdmin && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-purple-500/20">Admin</span>}
                                                </div>
                                                <div className="text-xs text-slate-500">{member.email}</div>
                                            </div>
                                        </div>
                                        {canRemove && (
                                            <button
                                                onClick={() => onRemoveMember(member._id)}
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Remove Member"
                                            >
                                                <UserMinus size={20} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default MemberModal;

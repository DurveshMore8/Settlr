import React from 'react';
import { X, UserMinus } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/60 transition-all">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">Trip Members</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {members.map((member) => {
                            const isMemberAdmin = adminId === member._id;
                            const canRemove = adminId === currentUserId && !isMemberAdmin;

                            return (
                                <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {member.name}
                                                {isMemberAdmin && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>}
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
    );
};

export default MemberModal;

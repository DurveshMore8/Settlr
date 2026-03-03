import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/80 transition-all">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
                <div className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border ${type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                        {type === 'danger' ? <Trash2 size={32} /> : <AlertCircle size={32} />}
                    </div>
                    <h2 className="text-2xl font-black mb-2 text-white">{title}</h2>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                        {message}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-black transition-all active:scale-[0.98] shadow-lg ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'} text-white`}
                        >
                            Confirm Action
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-black text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

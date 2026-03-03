import React from 'react';

const StatCard = ({ icon: Icon, title, children, topRight, iconColor = "purple" }) => {
    const colorClasses = {
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
        indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border ${colorClasses[iconColor] || colorClasses.purple}`}>
                    <Icon size={24} />
                </div>
                {topRight && (
                    <div className="flex items-center">
                        {topRight}
                    </div>
                )}
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default StatCard;

import React from 'react';

const StatCard = ({ icon: Icon, title, children, topRight, iconColor = "purple" }) => {
    const colorClasses = {
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
        indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    };

    return (
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border ${colorClasses[iconColor] || colorClasses.purple} transition-transform duration-300 group-hover:scale-110`}>
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
            {/* Subtle glow */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/[0.03] blur-2xl rounded-full -z-10 group-hover:bg-purple-500/[0.06] transition-colors" />
        </div>
    );
};

export default StatCard;

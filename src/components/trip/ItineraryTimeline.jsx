import React from 'react';
import { Plane, Train, Bus, Home, Activity, MapPin, Clock, Edit2, Trash2, Navigation, Calendar } from 'lucide-react';

const ItineraryTimeline = ({ itinerary, isAdmin, tripStatus, onEdit, onDelete, onAddClick }) => {
    const getIcon = (type) => {
        const icons = {
            Flight: Plane,
            Train: Train,
            Bus: Bus,
            Hotel: Home,
            Activity: Activity,
            Other: MapPin
        };
        return icons[type] || MapPin;
    };

    if (!itinerary || itinerary.length === 0) {
        return (
            <div className="glass-card rounded-[2.5rem] p-16 text-center">
                <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <Calendar size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No plans yet</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                    Add flights, hotels, and activities to keep the whole group on the same page.
                </p>
                {isAdmin && tripStatus === 'active' && (
                    <button
                        onClick={onAddClick}
                        className="mt-4 text-purple-400 font-bold text-sm hover:underline"
                    >
                        Start planning the trip
                    </button>
                )}
            </div>
        );
    }

    const sortedItinerary = [...itinerary].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    return (
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-indigo-500/20 before:to-transparent">
            {sortedItinerary.map((item) => {
                const ItemIcon = getIcon(item.type);

                return (
                    <div key={item._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] bg-navy-900 group-hover:border-purple-500/50 transition-all md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                            <ItemIcon size={18} className="text-purple-400" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card glass-card-hover p-6 rounded-3xl">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-purple-500/10">{item.type}</span>
                                    {item.dateTime && (
                                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                                            <Clock size={10} />
                                            {new Date(item.dateTime).toLocaleString('en-US', s => ({ day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}
                                        </div>
                                    )}
                                </div>
                                {isAdmin && tripStatus === 'active' && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-1.5 text-slate-500 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item._id)}
                                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-black text-white text-lg mb-1">{item.title}</h4>
                            {item.details && <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5 italic"><Navigation size={12} className="shrink-0 text-slate-600" />{item.details}</p>}
                            {item.address && <p className="text-slate-500 text-xs font-medium mt-2 flex items-start gap-1.5"><MapPin size={12} className="shrink-0 mt-0.5 text-slate-600" />{item.address}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ItineraryTimeline;

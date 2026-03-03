import React from 'react';
import { Plus, Plane, Train, Bus, Home, Activity, MapPin, Calendar, Loader2 } from 'lucide-react';

const ItineraryModal = ({
    isOpen,
    onClose,
    onSubmit,
    itemData,
    setItemData,
    types,
    isSubmitting,
    editingId
}) => {
    if (!isOpen) return null;

    const getIcon = (type) => {
        const icons = {
            Flight: Plane,
            Train: Train,
            Bus: Bus,
            Hotel: Home,
            Activity: Activity,
            Other: MapPin
        };
        const Icon = icons[type] || MapPin;
        return <Icon size={14} />;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/60 transition-all">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black">{editingId ? 'Edit Plan' : 'Add to Itinerary'}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Type</label>
                            <div className="flex flex-wrap gap-2">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setItemData({ ...itemData, type })}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${itemData.type === type ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                                    >
                                        {getIcon(type)}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Title</label>
                            <input
                                type="text"
                                required
                                value={itemData.title}
                                onChange={(e) => setItemData({ ...itemData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                placeholder="e.g. Flight to Tokyo, Stay at Marriott"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Details / Ref #</label>
                                <input
                                    type="text"
                                    value={itemData.details}
                                    onChange={(e) => setItemData({ ...itemData, details: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                    placeholder="e.g. AF123, Room 402"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={itemData.dateTime}
                                    onChange={(e) => setItemData({ ...itemData, dateTime: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Address / Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={itemData.address}
                                    onChange={(e) => setItemData({ ...itemData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                    placeholder="e.g. 123 Main St, Central Park"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !itemData.title}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
                            {editingId ? 'Update Plan' : 'Save to Itinerary'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItineraryModal;

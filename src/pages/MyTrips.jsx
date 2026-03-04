import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Plus, Users, Calendar, ArrowRight, Loader2, Wallet, Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateTripModal from '../components/trip/CreateTripModal';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTrips = async () => {
        try {
            const { data } = await API.get('/trips');
            setTrips(data);
        } catch (error) {
            toast.error('Failed to load trips');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const filteredTrips = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeTrips = filteredTrips.filter(t => t.status === 'active');
    const completedTrips = filteredTrips.filter(t => t.status === 'completed');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse-glow" />
                    <Loader2 className="animate-spin text-purple-400 relative" size={40} />
                </div>
                <p className="text-slate-400 font-medium tracking-wide">Loading your trips...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 text-white">My Trips</h1>
                    <p className="text-slate-400 font-medium">Manage and track all your shared adventures.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Create New Trip
                </button>
            </div>

            {/* Search */}
            {trips.length > 0 && (
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search trips..."
                        className="w-full glass-input py-3 !rounded-xl font-medium"
                        style={{ paddingLeft: '44px' }}
                    />
                </div>
            )}

            {trips.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center border-dashed !border-white/[0.06]">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
                        <MapPin className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">No trips yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                        Ready for your next journey? Create your first trip to start tracking expenses with friends.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-purple-400 font-bold border-b-2 border-purple-400/30 hover:border-purple-400 transition-all pb-1"
                    >
                        Create your first trip
                    </button>
                </div>
            ) : (
                <>
                    {/* Active Trips */}
                    {activeTrips.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Active Trips ({activeTrips.length})
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeTrips.map((trip, i) => (
                                    <TripCard key={trip._id} trip={trip} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Trips */}
                    {completedTrips.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-500" />
                                Completed ({completedTrips.length})
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedTrips.map((trip, i) => (
                                    <TripCard key={trip._id} trip={trip} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredTrips.length === 0 && searchQuery && (
                        <div className="text-center py-12 text-slate-500 font-medium">
                            No trips matching "{searchQuery}"
                        </div>
                    )}
                </>
            )}

            <CreateTripModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={(newTrip) => setTrips(prev => [newTrip, ...prev])}
            />
        </div>
    );
};

const TripCard = ({ trip, index }) => (
    <Link
        to={`/trips/${trip._id}`}
        className="group glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col h-full animate-slide-up"
        style={{ opacity: 0, animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/[0.06] group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl font-bold text-white leading-none">
                    {trip.name.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${trip.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-purple-300 transition-colors uppercase">
                    {trip.baseCurrency}
                </div>
            </div>
        </div>

        <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors truncate text-white">
                {trip.name}
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                    <Users size={16} className="text-slate-500" />
                    <span>{trip.members.length} {trip.members.length === 1 ? 'Member' : 'Members'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                    <Wallet size={16} className="text-slate-500" />
                    <span>{trip.budgetPerPerson.toLocaleString()} {trip.baseCurrency} / person</span>
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} />
                Created {new Date(trip.createdAt).toLocaleDateString()}
            </div>
            <div className="w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowRight size={16} className="text-purple-400" />
            </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/[0.04] blur-3xl -z-10 group-hover:bg-purple-500/[0.08] transition-colors" />
    </Link>
);

export default MyTrips;

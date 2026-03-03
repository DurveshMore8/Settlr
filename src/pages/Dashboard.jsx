import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Plus, Users, Calendar, ArrowRight, Loader2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
        fetchTrips();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-purple-500" size={40} />
                <p className="text-slate-400 font-medium tracking-wide">Fetching your adventures...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">Your Trips</h1>
                    <p className="text-slate-400 font-medium">Manage and track all your shared adventures.</p>
                </div>
                <Link
                    to="/trips/new"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Create New Trip
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center border-dashed">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No trips yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                        Ready for your next journey? Create your first trip to start tracking expenses with friends.
                    </p>
                    <Link
                        to="/trips/new"
                        className="text-purple-400 font-bold border-b-2 border-purple-400/30 hover:border-purple-400 transition-all pb-1"
                    >
                        Create your first trip
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Link
                            key={trip._id}
                            to={`/trips/${trip._id}`}
                            className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <span className="text-xl font-bold text-white leading-none">
                                        {trip.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-purple-300 transition-colors uppercase">
                                    {trip.baseCurrency}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors truncate">
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

                            {/* Card Footer */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                    <Calendar size={12} />
                                    Created {new Date(trip.createdAt).toLocaleDateString()}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    <ArrowRight size={16} className="text-purple-400" />
                                </div>
                            </div>

                            {/* Decorative gradient */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/5 blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

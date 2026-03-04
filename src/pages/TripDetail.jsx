import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import {
    Users, Wallet, Plus, UserPlus,
    Loader2, PieChart as PieChartIcon,
    TrendingUp, Filter, CheckCircle2, Flag
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';

// Modular Components
import StatCard from '../components/trip/StatCard';
import ExpenseList from '../components/trip/ExpenseList';
import ItineraryTimeline from '../components/trip/ItineraryTimeline';
import ExpenseModal from '../components/trip/ExpenseModal';
import ItineraryModal from '../components/trip/ItineraryModal';
import MemberModal from '../components/trip/MemberModal';
import InviteModal from '../components/trip/InviteModal';
import SettlementView from '../components/trip/SettlementView';
import ConfirmationModal from '../components/common/ConfirmationModal';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    // Modal states
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        currency: '',
        category: 'General',
        participants: [],
        payer: ''
    });
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [activeTab, setActiveTab] = useState('expenses');
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [editingItineraryId, setEditingItineraryId] = useState(null);
    const [newItineraryItem, setNewItineraryItem] = useState({
        type: 'Flight',
        title: '',
        details: '',
        address: '',
        dateTime: ''
    });

    const itineraryTypes = ['Flight', 'Train', 'Bus', 'Hotel', 'Activity', 'Other'];

    // Custom Confirm State
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger'
    });

    const triggerConfirm = (title, message, onConfirm, type = 'danger') => {
        setConfirmState({
            isOpen: true,
            title,
            message,
            onConfirm,
            type
        });
    };

    const handleConfirmClose = () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmAction = () => {
        if (confirmState.onConfirm) confirmState.onConfirm();
        handleConfirmClose();
    };

    const handleAddItinerary = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingItineraryId) {
                await API.put(`/trips/${id}/itinerary/${editingItineraryId}`, newItineraryItem);
                toast.success('Itinerary updated');
            } else {
                await API.post(`/trips/${id}/itinerary`, newItineraryItem);
                toast.success('Itinerary added');
            }
            setShowItineraryModal(false);
            fetchTripData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save itinerary');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteItinerary = async (itemId) => {
        triggerConfirm(
            'Delete Itinerary Item',
            'Are you sure you want to remove this item from the itinerary?',
            async () => {
                try {
                    await API.delete(`/trips/${id}/itinerary/${itemId}`);
                    toast.success('Item removed');
                    fetchTripData();
                } catch (error) {
                    toast.error('Failed to remove item');
                }
            }
        );
    };

    const handleEditItineraryClick = (item) => {
        setNewItineraryItem({
            type: item.type,
            title: item.title,
            details: item.details || '',
            address: item.address || '',
            dateTime: item.dateTime ? new Date(item.dateTime).toISOString().slice(0, 16) : ''
        });
        setEditingItineraryId(item._id);
        setShowItineraryModal(true);
    };

    const resetItineraryForm = () => {
        setNewItineraryItem({
            type: 'Flight',
            title: '',
            details: '',
            address: '',
            dateTime: ''
        });
        setEditingItineraryId(null);
    };

    const isAdmin = trip?.admin?._id === user?._id || trip?.admin === user?._id;

    const fetchTripData = useCallback(async () => {
        try {
            const [tripRes, expenseRes, analyticsRes] = await Promise.all([
                API.get(`/trips/${id}`),
                API.get(`/trips/${id}/expenses`),
                API.get(`/trips/${id}/expenses/analytics`)
            ]);

            setTrip(tripRes.data);
            setExpenses(expenseRes.data);
            setAnalytics(analyticsRes.data);

            setNewExpense(prev => ({
                ...prev,
                currency: tripRes.data.baseCurrency,
                participants: tripRes.data.members.map(m => m._id),
                payer: user?._id
            }));

        } catch (error) {
            toast.error('Failed to load trip details');
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchTripData();
    }, [fetchTripData]);

    // copyInviteLink replaced by InviteModal

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingExpenseId) {
                await API.put(`/expenses/${editingExpenseId}`, newExpense);
                toast.success('Expense updated!');
            } else {
                await API.post(`/trips/${id}/expenses`, newExpense);
                toast.success('Expense added!');
            }
            setShowExpenseModal(false);
            resetExpenseForm();
            fetchTripData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetExpenseForm = () => {
        setNewExpense({
            description: '',
            amount: '',
            currency: trip?.baseCurrency || 'USD',
            category: 'General',
            participants: trip?.members.map(m => m._id) || [],
            payer: user?._id
        });
        setEditingExpenseId(null);
    };

    const handleEditClick = (expense) => {
        setNewExpense({
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            category: expense.category,
            participants: expense.participants.map(p => typeof p === 'object' ? p._id : p),
            payer: typeof expense.payer === 'object' ? expense.payer._id : expense.payer
        });
        setEditingExpenseId(expense._id);
        setShowExpenseModal(true);
    };

    const handleDeleteExpense = async (expenseId) => {
        triggerConfirm(
            'Delete Expense',
            'Are you sure you want to delete this expense? This action cannot be undone.',
            async () => {
                try {
                    await API.delete(`/expenses/${expenseId}`);
                    toast.success('Expense deleted');
                    fetchTripData();
                } catch (error) {
                    toast.error('Failed to delete expense');
                }
            }
        );
    };

    const handleRemoveMember = async (userId) => {
        triggerConfirm(
            'Remove Member',
            'Are you sure you want to remove this member from the trip?',
            async () => {
                try {
                    await API.delete(`/trips/${id}/members/${userId}`);
                    toast.success('Member removed');
                    fetchTripData();
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to remove member');
                }
            }
        );
    };

    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const handleEndTrip = async () => {
        triggerConfirm(
            'End Trip',
            'Are you sure you want to end this trip? This will lock all expenses and finalize settlements.',
            async () => {
                setIsSubmitting(true);
                try {
                    await API.patch(`/trips/${id}/complete`);
                    toast.success('Trip completed! Settlement is now available.');
                    fetchTripData();
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to end trip');
                } finally {
                    setIsSubmitting(false);
                }
            },
            'warning'
        );
    };

    const expenseCategories = useMemo(() => [
        'Food', 'Transport', 'Lodging', 'Activities', 'Shopping', 'General', 'Other'
    ], []);

    const COLORS = ['#A855F7', '#818CF8', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

    const chartData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
            name,
            value
        }));
    }, [analytics]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse-glow" />
                    <Loader2 className="animate-spin text-purple-400 relative" size={40} />
                </div>
                <p className="text-slate-400 font-medium">Loading workspace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white">{trip.name}</h1>
                        {trip.status === 'completed' && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                <CheckCircle2 size={12} />
                                Completed
                            </span>
                        )}
                        <span className="px-3 py-1 glass rounded-full text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                            {trip.baseCurrency}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-purple-400" />
                            <span>{trip.members.length} Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wallet size={16} className="text-indigo-400" />
                            <span>{trip.budgetPerPerson.toLocaleString()} {trip.baseCurrency} budget / person</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isAdmin && trip.status === 'active' && (
                        <button
                            onClick={handleEndTrip}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 btn-ghost px-5 py-2.5 !rounded-xl text-sm"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Flag size={18} />}
                            End Trip
                        </button>
                    )}
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 btn-ghost px-5 py-2.5 !rounded-xl text-sm"
                    >
                        <UserPlus size={18} />
                        Invite Friends
                    </button>
                    {isAdmin && trip.status === 'active' && (
                        <button
                            onClick={() => {
                                if (activeTab === 'expenses') {
                                    resetExpenseForm();
                                    setShowExpenseModal(true);
                                } else {
                                    resetItineraryForm();
                                    setShowItineraryModal(true);
                                }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 text-sm"
                        >
                            <Plus size={20} />
                            {activeTab === 'expenses' ? 'Add Expense' : 'Add Item'}
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 glass rounded-2xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('expenses')}
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'expenses' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActiveTab('itinerary')}
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'itinerary' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Itinerary
                </button>
            </div>

            {/* Analytics Summary */}
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                    icon={TrendingUp}
                    title="Total Spent"
                    topRight={analytics && (
                        <span className={`text-xs font-bold uppercase tracking-widest ${analytics.totalSpent > analytics.totalBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                            {Math.round((analytics.totalSpent / analytics.totalBudget) * 100)}% Utilized
                        </span>
                    )}
                >
                    <h3 className="text-3xl font-black text-white">
                        {analytics?.totalSpent.toLocaleString()} <span className="text-sm font-medium text-slate-500">{trip.baseCurrency}</span>
                    </h3>
                    <div className="mt-4 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 rounded-full ${analytics?.totalSpent > analytics?.totalBudget ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                            style={{ width: `${Math.min((analytics?.totalSpent / analytics?.totalBudget) * 100, 100)}%` }}
                        />
                    </div>
                </StatCard>

                <StatCard icon={PieChartIcon} title="Categories" iconColor="indigo">
                    <div className="h-[150px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#080d24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600 text-xs font-bold uppercase">No data</div>
                        )}
                    </div>
                </StatCard>

                <StatCard
                    icon={Users}
                    title="Members"
                    iconColor="violet"
                    topRight={isAdmin && (
                        <button
                            onClick={() => setShowMembersModal(true)}
                            className="text-[10px] font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Manage
                        </button>
                    )}
                >
                    <div className="mt-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-white">{trip.members.length}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                        </div>
                        <div className="flex -space-x-2">
                            {trip.members.slice(0, 5).map((member, i) => (
                                <div key={member._id} className="w-8 h-8 rounded-full border-2 border-navy-950 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {trip.members.length > 5 && (
                                <div className="w-8 h-8 rounded-full border-2 border-navy-950 bg-navy-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    +{trip.members.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                </StatCard>
            </div>

            {/* Main Content Grid */}
            {activeTab === 'expenses' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold italic underline decoration-purple-500/50 underline-offset-8 text-white">Expenses</h2>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-lg transition-all border ${showFilters || activeCategory !== 'All' ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' : 'glass text-slate-400 hover:bg-white/[0.06]'}`}
                            >
                                <Filter size={18} />
                            </button>
                        </div>

                        {showFilters && (
                            <div className="flex flex-wrap gap-2 p-4 glass-card rounded-2xl animate-slide-down">
                                {['All', ...expenseCategories].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20' : 'glass text-slate-400 hover:bg-white/[0.06]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        <ExpenseList
                            expenses={expenses}
                            trip={trip}
                            isAdmin={isAdmin}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteExpense}
                            activeCategory={activeCategory}
                            onAddClick={() => setShowExpenseModal(true)}
                        />
                    </div>

                    {/* Member Balances & Settlements */}
                    <SettlementView trip={trip} analytics={analytics} user={user} onRefresh={fetchTripData} />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold italic underline decoration-purple-500/50 underline-offset-8 text-white">Shared Itinerary</h2>
                    </div>

                    <ItineraryTimeline
                        itinerary={trip.itinerary}
                        isAdmin={isAdmin}
                        tripStatus={trip.status}
                        onEdit={handleEditItineraryClick}
                        onDelete={handleDeleteItinerary}
                        onAddClick={() => setShowItineraryModal(true)}
                    />
                </div>
            )}

            <ExpenseModal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                onSubmit={handleAddExpense}
                expenseData={newExpense}
                setExpenseData={setNewExpense}
                tripMembers={trip.members}
                userId={user?._id}
                categories={expenseCategories}
                isSubmitting={isSubmitting}
                editingId={editingExpenseId}
            />

            <MemberModal
                isOpen={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                members={trip.members}
                adminId={trip.admin._id}
                currentUserId={user?._id}
                onRemoveMember={handleRemoveMember}
            />

            <ItineraryModal
                isOpen={showItineraryModal}
                onClose={() => setShowItineraryModal(false)}
                onSubmit={handleAddItinerary}
                itemData={newItineraryItem}
                setItemData={setNewItineraryItem}
                types={itineraryTypes}
                isSubmitting={isSubmitting}
                editingId={editingItineraryId}
            />

            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                trip={trip}
            />

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                onConfirm={handleConfirmAction}
                onClose={handleConfirmClose}
            />
        </div >
    );
};

export default TripDetail;

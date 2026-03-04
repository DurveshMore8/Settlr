import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
    Loader2, TrendingUp, Wallet, BarChart3,
    PieChart as PieChartIcon, MapPin, Users, ArrowRight,
    Activity, DollarSign, CreditCard
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const CATEGORY_COLORS = {
    Food: '#f59e0b',
    Transport: '#3b82f6',
    Lodging: '#8b5cf6',
    Activities: '#10b981',
    Shopping: '#f43f5e',
    General: '#6366f1',
    Other: '#64748b',
};

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await API.get('/expenses/dashboard');
                setAnalytics(data);
            } catch (error) {
                toast.error('Failed to load dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse-glow" />
                    <Loader2 className="animate-spin text-purple-400 relative" size={40} />
                </div>
                <p className="text-slate-400 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    if (!analytics) return null;

    // Prepare chart data
    const categoryData = Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        color: CATEGORY_COLORS[name] || '#64748b',
    }));

    const dailyData = Object.entries(analytics.dailySpending).map(([date, value]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.round(value * 100) / 100,
    }));

    const activeTrips = analytics.perTripSpending.filter(t => t.status === 'active');

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-1">
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-slate-400 font-medium">Your spending overview for {analytics.monthName}</p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={DollarSign}
                    label="This Month"
                    value={`${analytics.monthlyTotal.toFixed(2)}`}
                    sublabel={user?.homeCurrency}
                    color="purple"
                />
                <StatCard
                    icon={MapPin}
                    label="Active Trips"
                    value={analytics.activeTrips}
                    sublabel={`of ${analytics.totalTrips} total`}
                    color="emerald"
                />
                <StatCard
                    icon={CreditCard}
                    label="Total Expenses"
                    value={analytics.totalExpenses}
                    sublabel="all time"
                    color="indigo"
                />
                <StatCard
                    icon={Activity}
                    label="Categories"
                    value={categoryData.length}
                    sublabel="this month"
                    color="amber"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Spending Trend (larger) */}
                <div className="lg:col-span-3 glass-card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 size={18} className="text-purple-400" />
                                Spending Trend
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Last 30 days</p>
                        </div>
                    </div>
                    {dailyData.some(d => d.amount > 0) ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={Math.floor(dailyData.length / 6)}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(15, 23, 42, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        color: '#e2e8f0',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}
                                    formatter={(v) => [`${v.toFixed(2)} ${user?.homeCurrency || ''}`, 'Spent']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    fill="url(#spendGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[220px] text-slate-600">
                            <BarChart3 size={32} className="mb-2 text-slate-700" />
                            <p className="text-sm font-medium">No spending data this month</p>
                        </div>
                    )}
                </div>

                {/* Category Breakdown (smaller) */}
                <div className="lg:col-span-2 glass-card rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <PieChartIcon size={18} className="text-indigo-400" />
                        By Category
                    </h3>
                    {categoryData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} opacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(15, 23, 42, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '12px',
                                            color: '#e2e8f0',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                        }}
                                        formatter={(v) => [`${v.toFixed(2)}`, '']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {categoryData.sort((a, b) => b.value - a.value).map(cat => (
                                    <div key={cat.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-slate-400 font-medium">{cat.name}</span>
                                        </div>
                                        <span className="text-slate-300 font-bold">{cat.value.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[220px] text-slate-600">
                            <PieChartIcon size={32} className="mb-2 text-slate-700" />
                            <p className="text-sm font-medium">No expenses yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Trips */}
            {activeTrips.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin size={18} className="text-emerald-400" />
                            Active Trips
                        </h3>
                        <Link to="/trips" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeTrips.map((trip) => {
                            const usage = trip.budgetPerPerson > 0
                                ? Math.min((trip.userShare / trip.budgetPerPerson) * 100, 100)
                                : 0;
                            return (
                                <Link
                                    key={trip.tripId}
                                    to={`/trips/${trip.tripId}`}
                                    className="group glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate flex-1">
                                            {trip.tripName}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2 shrink-0">
                                            {trip.baseCurrency}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Users size={12} /> {trip.memberCount}
                                        </span>
                                        <span>•</span>
                                        <span>Your share: {trip.userShare.toFixed(2)} {trip.baseCurrency}</span>
                                    </div>

                                    {/* Budget bar */}
                                    {trip.budgetPerPerson > 0 && (
                                        <div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                                <span>Budget usage</span>
                                                <span>{usage.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${usage > 90 ? 'bg-red-500' : usage > 70 ? 'bg-amber-500' : 'bg-purple-500'}`}
                                                    style={{ width: `${usage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/[0.04] blur-2xl -z-10 group-hover:bg-purple-500/[0.08] transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty state when no data */}
            {analytics.totalTrips === 0 && (
                <div className="glass-card rounded-3xl p-12 text-center border-dashed !border-white/[0.06]">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/[0.06]">
                        <TrendingUp className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">No data yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Create your first trip and add expenses to see your analytics here.
                    </p>
                    <Link
                        to="/trips"
                        className="text-purple-400 font-bold border-b-2 border-purple-400/30 hover:border-purple-400 transition-all pb-1"
                    >
                        Go to My Trips
                    </Link>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, sublabel, color }) => {
    const colorMap = {
        purple: { bg: 'from-purple-500/10 to-purple-600/5', icon: 'text-purple-400', border: 'border-purple-500/10' },
        emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', icon: 'text-emerald-400', border: 'border-emerald-500/10' },
        indigo: { bg: 'from-indigo-500/10 to-indigo-600/5', icon: 'text-indigo-400', border: 'border-indigo-500/10' },
        amber: { bg: 'from-amber-500/10 to-amber-600/5', icon: 'text-amber-400', border: 'border-amber-500/10' },
    };
    const c = colorMap[color] || colorMap.purple;

    return (
        <div className={`glass-card rounded-2xl p-5 border ${c.border}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center`}>
                    <Icon size={16} className={c.icon} />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            {sublabel && <p className="text-[11px] text-slate-600 font-bold mt-1 uppercase tracking-tight">{sublabel}</p>}
        </div>
    );
};

export default Dashboard;

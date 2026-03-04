import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, MapPin, Settings, User as UserIcon } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/trips', label: 'My Trips', icon: MapPin },
        { to: '/settings', label: 'Settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[120px] animate-float-slow" />
                <div className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '-7s' }} />
                <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-violet-600/[0.05] rounded-full blur-[80px] animate-float-slow" style={{ animationDelay: '-14s' }} />
            </div>

            {/* Navbar */}
            <nav className="border-b border-white/[0.06] bg-navy-950/60 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link to="/dashboard" className="text-2xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] hover:scale-105 transition-transform">
                                Settlr
                            </Link>
                            <div className="hidden md:flex gap-1">
                                {navLinks.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${isActive(to)
                                                ? 'text-white bg-white/[0.06]'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                                    <UserIcon size={12} className="text-white" />
                                </div>
                                <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">({user?.homeCurrency})</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-500 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-navy-950/80 backdrop-blur-2xl">
                <div className="flex justify-around py-2">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${isActive(to)
                                    ? 'text-purple-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                <Outlet />
            </main>

            {/* Footer (desktop only) */}
            <footer className="hidden md:block border-t border-white/[0.04] py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="text-sm font-medium bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
                        &copy; {new Date().getFullYear()} Settlr &bull; Collaborative Expense Manager
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

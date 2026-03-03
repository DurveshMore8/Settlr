import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, User as UserIcon } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                                <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/[0.04] font-medium text-sm">
                                    <Home size={16} />
                                    Dashboard
                                </Link>
                                <Link to="/trips/new" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/[0.04] font-medium text-sm">
                                    <PlusCircle size={16} />
                                    New Trip
                                </Link>
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

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.04] py-8 mt-auto">
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

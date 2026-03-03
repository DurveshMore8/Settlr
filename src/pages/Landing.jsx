import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, PieChart, Users, Globe } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl -z-10" />

            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Settlr
                </div>
                <div className="flex items-center gap-6">
                    {user ? (
                        <Link to="/dashboard" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all shadow-lg shadow-purple-500/20">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
                                Log in
                            </Link>
                            <Link to="/register" className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-semibold transition-all">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm font-medium mb-8 animate-fade-in">
                    <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    Simplifying group expenses since 2026
                </div>

                <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight mb-8">
                    Settle up with <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                        zero awkwardness
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
                    The collaborative expense manager for travelers, roommates, and friends.
                    Track spending, convert currencies, and split bills fairly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to={user ? "/dashboard" : "/register"}
                        className="w-full sm:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 group"
                    >
                        Start a Trip <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all">
                        See how it works
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: <Globe className="text-purple-400" />,
                            title: "Multi-Currency",
                            desc: "Real-time exchange rates. Spend in Yen, settle in Dollars."
                        },
                        {
                            icon: <Users className="text-pink-400" />,
                            title: "Granular Splitting",
                            desc: "Exclude people from specific expenses with a single click."
                        },
                        {
                            icon: <PieChart className="text-indigo-400" />,
                            title: "Insightful Analytics",
                            desc: "Visual budget tracking and spending category breakdowns."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;

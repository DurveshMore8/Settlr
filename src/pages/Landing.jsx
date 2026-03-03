import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, PieChart, Users, Globe, Sparkles } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-navy-950 text-white overflow-hidden relative scroll-smooth">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-purple-600/[0.08] rounded-full blur-[150px] animate-float-slow" />
                <div className="absolute top-[20%] right-[-20%] w-[700px] h-[700px] bg-indigo-600/[0.07] rounded-full blur-[130px] animate-float-slow" style={{ animationDelay: '-7s' }} />
                <div className="absolute bottom-[-30%] left-[20%] w-[600px] h-[600px] bg-violet-500/[0.06] rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '-14s' }} />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* Navbar */}
            <nav className="relative max-w-7xl mx-auto px-6 h-24 flex items-center justify-between z-10">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Settlr
                </div>
                <div className="flex items-center gap-6">
                    {user ? (
                        <Link to="/dashboard" className="btn-primary text-sm flex items-center gap-2">
                            Go to Dashboard <ArrowRight size={16} />
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-primary text-sm">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-purple-300 text-sm font-medium mb-8 animate-slide-down">
                    <Sparkles size={14} className="text-purple-400" />
                    Simplifying group expenses since 2026
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.05] tracking-tight mb-8 animate-slide-up">
                    Settle up with <br />
                    <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                        zero awkwardness
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed animate-slide-up stagger-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                    The collaborative expense manager for travelers, roommates, and friends.
                    Track spending, convert currencies, and split bills fairly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                    <Link
                        to={user ? "/dashboard" : "/register"}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 group active:scale-[0.98]"
                    >
                        Start a Trip <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="#features" className="w-full sm:w-auto btn-ghost text-lg px-10 py-4 inline-block text-center">
                        See how it works
                    </a>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="relative max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04] z-10 scroll-mt-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Globe className="text-purple-400" />,
                            title: "Multi-Currency",
                            desc: "Real-time exchange rates. Spend in Yen, settle in Dollars.",
                            gradient: "from-purple-500/20 to-violet-500/10"
                        },
                        {
                            icon: <Users className="text-indigo-400" />,
                            title: "Granular Splitting",
                            desc: "Exclude people from specific expenses with a single click.",
                            gradient: "from-indigo-500/20 to-blue-500/10"
                        },
                        {
                            icon: <PieChart className="text-violet-400" />,
                            title: "Insightful Analytics",
                            desc: "Visual budget tracking and spending category breakdowns.",
                            gradient: "from-violet-500/20 to-purple-500/10"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card glass-card-hover rounded-3xl p-8 group animate-slide-up" style={{ opacity: 0, animationDelay: `${i * 0.1 + 0.2}s`, animationFillMode: 'forwards' }}>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 border border-white/[0.06] group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight, CheckCircle2, PieChart, Users, Globe, Sparkles,
    Zap, Shield, Map, Wallet, ChevronDown, TrendingUp,
    CreditCard, BarChart3, Target, ArrowUpRight, Star, Quote,
    Github, Mail, Heart
} from 'lucide-react';

/* ── Scroll reveal hook ── */
const useScrollReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
        );

        // Delay observation to ensure DOM is fully rendered
        const raf = requestAnimationFrame(() => {
            const elements = ref.current?.querySelectorAll('.scroll-hidden');
            elements?.forEach(el => observer.observe(el));
        });

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, []);
    return ref;
};

/* ── Animated counter ── */
const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !counted.current) {
                counted.current = true;
                let start = 0;
                const duration = 2000;
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── FAQ Item ── */
const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/20">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-6 text-left"
        >
            <span className="text-white font-semibold pr-4">{question}</span>
            <ChevronDown
                size={20}
                className={`text-purple-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
        <div className={`faq-content ${isOpen ? 'open' : ''}`}>
            <p className="px-6 pb-6 text-slate-400 leading-relaxed text-sm">{answer}</p>
        </div>
    </div>
);

const Landing = () => {
    const { user } = useAuth();
    const [openFAQ, setOpenFAQ] = useState(null);
    const scrollRef = useScrollReveal();

    const features = [
        {
            icon: <Globe className="text-purple-400" />,
            title: "Multi-Currency Support",
            desc: "Real-time exchange rates across 50+ currencies. Spend in Yen, settle in Dollars — we handle the math.",
            gradient: "from-purple-500/20 to-violet-500/10"
        },
        {
            icon: <Users className="text-indigo-400" />,
            title: "Granular Splitting",
            desc: "Exclude members from specific expenses with a single click. Not everyone had the lobster.",
            gradient: "from-indigo-500/20 to-blue-500/10"
        },
        {
            icon: <PieChart className="text-violet-400" />,
            title: "Insightful Analytics",
            desc: "Visual budget tracking with interactive charts and category breakdowns at a glance.",
            gradient: "from-violet-500/20 to-purple-500/10"
        },
        {
            icon: <Target className="text-cyan-400" />,
            title: "Budget Tracking",
            desc: "Set per-person budgets and watch spending in real-time. Get alerts before you blow the budget.",
            gradient: "from-cyan-500/20 to-teal-500/10"
        },
        {
            icon: <Zap className="text-amber-400" />,
            title: "Smart Settlements",
            desc: "Our algorithm minimizes the total number of transactions needed to settle all debts.",
            gradient: "from-amber-500/20 to-orange-500/10"
        },
        {
            icon: <Map className="text-emerald-400" />,
            title: "Itinerary Planning",
            desc: "Plan your day-by-day itinerary right alongside your expenses. Everything in one place.",
            gradient: "from-emerald-500/20 to-green-500/10"
        }
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Create a Trip",
            desc: "Set up your trip with a name, base currency, and budget. Invite friends via a simple share code.",
            icon: <CreditCard size={28} />
        },
        {
            step: "02",
            title: "Log Expenses",
            desc: "Add expenses as you go. Tag who paid, who's included, and in which currency. It all syncs instantly.",
            icon: <BarChart3 size={28} />
        },
        {
            step: "03",
            title: "Settle Up",
            desc: "At the end, see exactly who owes whom. Minimum transactions, zero confusion, no awkwardness.",
            icon: <TrendingUp size={28} />
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Backpacker, SEA Trip",
            quote: "We used to fight about who paid for what. Now we just add it to Settlr and move on. Game changer!",
            stars: 5
        },
        {
            name: "Alex Johnson",
            role: "Roommate Group",
            quote: "Splitting rent, groceries, and utilities across 4 people was a nightmare. Settlr made it painless.",
            stars: 5
        },
        {
            name: "Maria Santos",
            role: "Euro Trip Organizer",
            quote: "The multi-currency feature is incredible. We traveled 5 countries and every expense was tracked perfectly.",
            stars: 5
        }
    ];

    const faqs = [
        {
            q: "Is Settlr free to use?",
            a: "Yes! Settlr is completely free. Create unlimited trips, add unlimited members, and track unlimited expenses."
        },
        {
            q: "How does multi-currency conversion work?",
            a: "When you add an expense in a foreign currency, Settlr automatically converts it to your trip's base currency using real-time exchange rates for accurate settlement."
        },
        {
            q: "Can I exclude someone from a specific expense?",
            a: "Absolutely. When logging an expense, simply uncheck the members who shouldn't be included. The cost splits only among the remaining members."
        },
        {
            q: "How does the smart settlement algorithm work?",
            a: "Instead of everyone paying everyone else, our algorithm calculates the minimum number of transactions needed to settle all debts — saving time and reducing confusion."
        },
        {
            q: "Is my financial data secure?",
            a: "Your data is encrypted and stored securely. We use industry-standard authentication and never share your information with third parties."
        }
    ];

    return (
        <div className="min-h-screen bg-navy-950 text-white overflow-hidden relative scroll-smooth" ref={scrollRef}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-purple-600/[0.08] rounded-full blur-[150px] animate-float-slow" />
                <div className="absolute top-[20%] right-[-20%] w-[700px] h-[700px] bg-indigo-600/[0.07] rounded-full blur-[130px] animate-float-slow" style={{ animationDelay: '-7s' }} />
                <div className="absolute bottom-[-30%] left-[20%] w-[600px] h-[600px] bg-violet-500/[0.06] rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '-14s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* ═══ Navbar ═══ */}
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

            {/* ═══ 1. Hero Section ═══ */}
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
                    Track spending, convert currencies, and split bills fairly — all in one beautiful app.
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

                {/* Stats Bar */}
                <div className="mt-20 grid grid-cols-3 max-w-xl mx-auto gap-8 animate-slide-up stagger-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                    {[
                        { value: 10000, suffix: '+', label: 'Expenses Tracked' },
                        { value: 50, suffix: '+', label: 'Currencies Supported' },
                        { value: 0, suffix: '', label: 'Arguments Caused', display: 'Zero' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                {stat.display || <Counter target={stat.value} suffix={stat.suffix} />}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 2. How It Works ═══ */}
            <section className="relative max-w-5xl mx-auto px-6 py-24 z-10">
                <div className="text-center mb-16">
                    <span className="scroll-hidden text-purple-400 text-sm font-bold uppercase tracking-widest inline-block">Simple Process</span>
                    <h2 className="scroll-hidden text-4xl sm:text-5xl font-black mt-3 text-white" style={{ transitionDelay: '0.1s' }}>How It Works</h2>
                    <p className="scroll-hidden text-slate-400 mt-4 max-w-lg mx-auto" style={{ transitionDelay: '0.2s' }}>Three simple steps to expense-free travels and stress-free settlements.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* connector line (desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-purple-500/40 via-indigo-500/40 to-violet-500/40" />

                    {howItWorks.map((item, i) => (
                        <div key={i} className="scroll-hidden relative text-center" style={{ transitionDelay: `${i * 0.15}s` }}>
                            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/20 text-purple-300 mb-6 mx-auto z-10">
                                {item.icon}
                            </div>
                            <div className="text-xs font-black text-purple-500 tracking-widest mb-2">{item.step}</div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 3. Features Grid ═══ */}
            <section id="features" className="relative max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04] z-10 scroll-mt-8">
                <div className="text-center mb-16">
                    <span className="scroll-hidden text-purple-400 text-sm font-bold uppercase tracking-widest inline-block">Packed With Features</span>
                    <h2 className="scroll-hidden text-4xl sm:text-5xl font-black mt-3 text-white" style={{ transitionDelay: '0.1s' }}>Everything You Need</h2>
                    <p className="scroll-hidden text-slate-400 mt-4 max-w-lg mx-auto" style={{ transitionDelay: '0.2s' }}>Built for real-world group expense scenarios other apps overlook.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="scroll-hidden glass-card glass-card-hover rounded-3xl p-8 group"
                            style={{ transitionDelay: `${i * 0.08}s` }}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 border border-white/[0.06] group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 4. Why Settlr ═══ */}
            <section className="relative max-w-7xl mx-auto px-6 py-24 z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <div>
                        <span className="scroll-hidden text-purple-400 text-sm font-bold uppercase tracking-widest inline-block">Why Settlr?</span>
                        <h2 className="scroll-hidden text-4xl sm:text-5xl font-black mt-3 mb-6 text-white leading-tight" style={{ transitionDelay: '0.1s' }}>
                            Built for the way <br />
                            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">real groups</span> travel
                        </h2>
                        <p className="scroll-hidden text-slate-400 leading-relaxed mb-8" style={{ transitionDelay: '0.2s' }}>
                            Most expense splitters are glorified calculators. Settlr understands that group trips are messy — different currencies, uneven splits, budget limits, and last-minute changes. We handle it all.
                        </p>
                        <div className="space-y-4">
                            {[
                                'No signup hassle — get started in seconds',
                                'Works across any currency seamlessly',
                                'Minimized settlements — fewer transactions',
                                'Built-in itinerary and budget tracking',
                                'Beautiful analytics and spending insights'
                            ].map((item, i) => (
                                <div key={i} className="scroll-hidden flex items-start gap-3" style={{ transitionDelay: `${0.3 + i * 0.08}s` }}>
                                    <CheckCircle2 size={20} className="text-purple-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Abstract Visual */}
                    <div className="scroll-hidden relative" style={{ transitionDelay: '0.2s' }}>
                        <div className="relative glass-card rounded-3xl p-8 overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10 pointer-events-none" />

                            {/* Mock UI elements */}
                            <div className="relative space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex items-center justify-center">
                                            <Wallet size={18} className="text-purple-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Tokyo Dinner</div>
                                            <div className="text-xs text-slate-500">Paid by Alex • ¥8,500</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-400">$56.20</div>
                                        <div className="text-xs text-slate-500">Split 4 ways</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-blue-500/30 flex items-center justify-center">
                                            <CreditCard size={18} className="text-indigo-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Bullet Train</div>
                                            <div className="text-xs text-slate-500">Paid by Priya • ¥29,110</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-400">$192.40</div>
                                        <div className="text-xs text-slate-500">Split 3 ways</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center">
                                            <Map size={18} className="text-violet-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Airbnb Osaka</div>
                                            <div className="text-xs text-slate-500">Paid by Maria • ¥45,000</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-emerald-400">$297.50</div>
                                        <div className="text-xs text-slate-500">Split 4 ways</div>
                                    </div>
                                </div>

                                {/* Summary bar */}
                                <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-purple-600/15 to-indigo-600/15 border border-purple-500/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-300 font-medium">Total Trip Expenses</span>
                                        <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">$546.10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ 5. Testimonials ═══ */}
            <section className="relative max-w-7xl mx-auto px-6 py-24 border-t border-white/[0.04] z-10">
                <div className="text-center mb-16">
                    <span className="scroll-hidden text-purple-400 text-sm font-bold uppercase tracking-widest inline-block">Loved by Groups</span>
                    <h2 className="scroll-hidden text-4xl sm:text-5xl font-black mt-3 text-white" style={{ transitionDelay: '0.1s' }}>What People Say</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="scroll-hidden glass-card glass-card-hover rounded-3xl p-8 relative overflow-hidden"
                            style={{ transitionDelay: `${i * 0.12}s` }}
                        >
                            <Quote size={40} className="text-purple-500/10 absolute top-6 right-6" />

                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.stars }).map((_, j) => (
                                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-500/40 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t.name}</div>
                                    <div className="text-xs text-slate-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 6. FAQ ═══ */}
            <section className="relative max-w-3xl mx-auto px-6 py-24 z-10">
                <div className="text-center mb-16">
                    <span className="scroll-hidden text-purple-400 text-sm font-bold uppercase tracking-widest inline-block">FAQ</span>
                    <h2 className="scroll-hidden text-4xl sm:text-5xl font-black mt-3 text-white" style={{ transitionDelay: '0.1s' }}>Common Questions</h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="scroll-hidden" style={{ transitionDelay: `${i * 0.08}s` }}>
                            <FAQItem
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openFAQ === i}
                                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 7. CTA Banner ═══ */}
            <section className="relative max-w-5xl mx-auto px-6 py-24 z-10">
                <div className="scroll-hidden relative rounded-3xl overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-violet-600/30" />
                    <div className="absolute inset-0 glass" />

                    <div className="relative text-center py-16 px-8">
                        <h2 className="text-3xl sm:text-5xl font-black mb-4 text-white">
                            Ready to ditch the spreadsheets?
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-md mx-auto">
                            Join thousands of groups already managing expenses the smart way. It's free, forever.
                        </p>
                        <Link
                            to={user ? "/dashboard" : "/register"}
                            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-navy-950 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xl"
                        >
                            Get Started Free <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ 8. Footer ═══ */}
            <footer className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/[0.04] z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        Settlr
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="https://github.com/DurveshMore8/Settlr" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                            <Github size={16} /> GitHub
                        </a>
                        <a href="mailto:contact@settlr.app" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                            <Mail size={16} /> Contact
                        </a>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1">
                        Built with <Heart size={12} className="text-purple-500 fill-purple-500" /> by Durvesh
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

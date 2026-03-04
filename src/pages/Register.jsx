import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Coins, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import Select from '../components/common/Select';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        homeCurrency: 'USD'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password, formData.homeCurrency);
            toast.success('Account created successfully!');
            // Check for pending invite redirect
            const pendingInvite = localStorage.getItem('pendingInviteCode');
            if (pendingInvite) {
                localStorage.removeItem('pendingInviteCode');
                navigate(`/join/${pendingInvite}`);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-indigo-600/[0.08] blur-[150px] rounded-full animate-float-slow" />
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/[0.07] blur-[120px] rounded-full animate-float-slow" style={{ animationDelay: '-10s' }} />

            <div className="w-full max-w-md animate-slide-up relative z-10">
                <Link to="/" className="inline-block mb-10 text-3xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Settlr
                </Link>

                <div className="glass-card rounded-3xl p-8">
                    <h2 className="text-3xl font-bold mb-2 text-white">Create account</h2>
                    <p className="text-slate-400 mb-8 font-medium">Start managing your group expenses today.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full glass-input py-3"
                                    style={{ paddingLeft: '48px' }}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass-input py-3"
                                    style={{ paddingLeft: '48px' }}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full glass-input py-3 pr-12"
                                    style={{ paddingLeft: '48px' }}
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Home Currency</label>
                            <div className="relative group">
                                <Select
                                    options={currencies}
                                    value={formData.homeCurrency}
                                    onChange={(e) => setFormData({ ...formData, homeCurrency: e.target.value })}
                                    className="w-full glass-input py-3 style-padding-fix"
                                    icon={Coins}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.08] blur-[150px] rounded-full animate-float-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/[0.07] blur-[120px] rounded-full animate-float-slow" style={{ animationDelay: '-10s' }} />

            <div className="w-full max-w-md animate-slide-up relative z-10">
                <Link to="/" className="inline-block mb-12 text-3xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Settlr
                </Link>

                <div className="glass-card rounded-3xl p-8">
                    <h2 className="text-3xl font-bold mb-2 text-white">Welcome back</h2>
                    <p className="text-slate-400 mb-8 font-medium">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full glass-input py-3"
                                    style={{ paddingLeft: '48px' }}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-300">Password</label>
                                <a href="#" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full glass-input py-3 pr-12"
                                    style={{ paddingLeft: '48px' }}
                                    placeholder="••••••••"
                                    required
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                            Sign in
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-400 font-medium">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                                Register for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

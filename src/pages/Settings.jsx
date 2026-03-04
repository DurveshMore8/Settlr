import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Coins, Lock, Save, Loader2, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import Select from '../components/common/Select';

const Settings = () => {
    const { user, updateUser } = useAuth();

    // Profile state
    const [profile, setProfile] = useState({
        name: user?.name || '',
        homeCurrency: user?.homeCurrency || 'USD',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const { data } = await API.put('/auth/profile', profile);
            updateUser(data);
            toast.success('Profile updated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSavingPassword(true);
        try {
            await API.put('/auth/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            toast.success('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black mb-2 text-white">Settings</h1>
                <p className="text-slate-400 font-medium">Manage your account preferences.</p>
            </div>

            {/* ═══ Profile Section ═══ */}
            <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/[0.06]">
                        <User size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Profile</h2>
                        <p className="text-xs text-slate-500 font-medium">Update your personal details</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <div className="w-full glass-input py-3 px-5 !rounded-xl text-slate-500 font-medium cursor-not-allowed">
                            {user?.email}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <User size={12} className="text-purple-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full glass-input py-3 px-5 font-semibold !rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Coins size={12} className="text-violet-400" />
                                Home Currency
                            </label>
                            <Select
                                options={currencies}
                                value={profile.homeCurrency}
                                onChange={(e) => setProfile({ ...profile, homeCurrency: e.target.value })}
                                className="w-full glass-input py-3 px-5 font-semibold !rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
                        >
                            {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* ═══ Password Section ═══ */}
            <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/[0.06]">
                        <ShieldCheck size={18} className="text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Security</h2>
                        <p className="text-xs text-slate-500 font-medium">Change your password</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Lock size={12} className="text-amber-400" />
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                className="w-full glass-input py-3 px-5 pr-12 font-medium !rounded-xl"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <KeyRound size={12} className="text-amber-400" />
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full glass-input py-3 px-5 pr-12 font-medium !rounded-xl"
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                className="w-full glass-input py-3 px-5 font-medium !rounded-xl"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98]"
                        >
                            {isSavingPassword ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;

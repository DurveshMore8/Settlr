import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, ShipWheel, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const JoinTrip = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [isJoining, setIsJoining] = useState(false);
    const [joinComplete, setJoinComplete] = useState(false);

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) return;

        if (user) {
            // Authenticated user → join immediately
            joinTrip();
        }
        // If not logged in, show login/register prompt (rendered below)
    }, [user, loading, inviteCode]);

    const joinTrip = async () => {
        setIsJoining(true);
        try {
            const { data } = await API.post(`/trips/join/${inviteCode}`);
            toast.success(`Joined "${data.name}"!`);
            // Clear any stored invite code
            localStorage.removeItem('pendingInviteCode');
            navigate(`/trips/${data._id}`);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to join trip';
            if (msg === 'Already a member of this trip') {
                toast('You\'re already a member!', { icon: 'ℹ️' });
                // Try to find the trip and navigate to it
                try {
                    const { data: trips } = await API.get('/trips');
                    const match = trips.find(t => t.inviteCode === inviteCode);
                    if (match) {
                        navigate(`/trips/${match._id}`);
                        return;
                    }
                } catch { }
            } else {
                toast.error(msg);
            }
            navigate('/dashboard');
        } finally {
            setIsJoining(false);
        }
    };

    // Show loading while auth is being determined
    if (loading) {
        return (
            <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-purple-400" size={40} />
                <p className="text-slate-400 font-medium">Loading...</p>
            </div>
        );
    }

    // Not logged in → show prompt to login/register
    if (!user) {
        // Save invite code so login/register can redirect back
        localStorage.setItem('pendingInviteCode', inviteCode);

        return (
            <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-8 px-6 relative overflow-hidden">
                {/* Background blurs */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/[0.06] rounded-full blur-[100px]" />

                <div className="relative text-center max-w-md">
                    <div className="relative mb-8 inline-block">
                        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                        <div className="glass-card p-6 rounded-full relative">
                            <ShipWheel className="text-purple-400 animate-[spin_4s_linear_infinite]" size={48} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white mb-3">You're Invited!</h1>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                        Someone invited you to track expenses together on <span className="text-purple-400 font-bold">Settlr</span>.
                        Sign in or create an account to join the trip.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20"
                        >
                            <LogIn size={18} />
                            Log In to Join
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 btn-ghost !rounded-2xl font-bold"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Logged in → joining in progress
    return (
        <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-6 animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse-glow" />
                <div className="glass-card p-6 rounded-full relative">
                    <ShipWheel className="text-purple-400 animate-[spin_3s_linear_infinite]" size={48} />
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 text-white">Joining Trip...</h2>
                <p className="text-slate-400 font-medium">Please wait while we set up your seat.</p>
            </div>
            <Loader2 className="animate-spin text-slate-600" size={24} />
        </div>
    );
};

export default JoinTrip;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, ShipWheel } from 'lucide-react';

const JoinTrip = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [isJoining, setIsJoining] = useState(true);

    useEffect(() => {
        const join = async () => {
            try {
                const { data } = await API.post(`/trips/join/${inviteCode}`);
                toast.success(`Joined ${data.name}!`);
                navigate(`/trips/${data._id}`);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to join trip');
                navigate('/dashboard');
            } finally {
                setIsJoining(false);
            }
        };

        if (inviteCode) {
            join();
        }
    }, [inviteCode, navigate]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 animate-fade-in">
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

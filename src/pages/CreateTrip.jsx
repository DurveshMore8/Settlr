import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Map, Wallet, Coins, Plus, Loader2 } from 'lucide-react';

const CreateTrip = () => {
    const [formData, setFormData] = useState({
        name: '',
        baseCurrency: 'USD',
        budgetPerPerson: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await API.post('/trips', {
                ...formData,
                budgetPerPerson: Number(formData.budgetPerPerson) || 0
            });
            toast.success('Trip created! Time to add members.');
            navigate(`/trips/${data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create trip');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2">Create New Trip</h1>
                <p className="text-slate-400 font-medium">Set the foundation for your group adventure.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Map size={14} className="text-purple-400" />
                            Trip Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-semibold"
                            placeholder="Summer Vacation 2026"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Coins size={14} className="text-pink-400" />
                                Base Currency
                            </label>
                            <div className="relative group">
                                <select
                                    value={formData.baseCurrency}
                                    onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-semibold appearance-none"
                                >
                                    {currencies.map(c => (
                                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <Plus size={20} className="rotate-45" />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold ml-1 uppercase tracking-tight">
                                All expenses convert to this for analytics
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Wallet size={14} className="text-indigo-400" />
                                Budget per person
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.budgetPerPerson}
                                    onChange={(e) => setFormData({ ...formData, budgetPerPerson: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-semibold"
                                    placeholder="0.00"
                                    required
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                    {formData.baseCurrency}
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold ml-1 uppercase tracking-tight">
                                Total trip limit: {(Number(formData.budgetPerPerson) || 0).toLocaleString()} {formData.baseCurrency} / person
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-lg uppercase tracking-widest mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                        Create Trip
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTrip;

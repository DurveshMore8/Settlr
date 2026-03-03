import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Map, Wallet, Plus, Coins, Loader2, ArrowLeft } from 'lucide-react';
import Select from '../components/common/Select';

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
                <h1 className="text-4xl font-black mb-2 text-white">Create New Trip</h1>
                <p className="text-slate-400 font-medium">Set the foundation for your group adventure.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-10 relative">
                {/* Background gradient */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/[0.06] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Map size={14} className="text-purple-400" />
                            Trip Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full glass-input py-4 px-6 text-lg font-semibold !rounded-2xl"
                            placeholder="Summer Vacation 2026"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Coins size={14} className="text-violet-400" />
                                Base Currency
                            </label>
                            <div className="relative group">
                                <Select
                                    options={currencies}
                                    value={formData.baseCurrency}
                                    onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                                    className="w-full glass-input py-4 px-6 text-lg font-semibold !rounded-2xl"
                                />
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
                                    className="w-full glass-input py-4 px-6 text-lg font-semibold !rounded-2xl"
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
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-lg uppercase tracking-widest mt-4"
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

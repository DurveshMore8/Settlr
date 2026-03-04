import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Map, Wallet, Plus, Coins, Loader2 } from 'lucide-react';
import ModalPortal from '../common/ModalPortal';
import Select from '../common/Select';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CreateTripModal = ({ isOpen, onClose, onCreated }) => {
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
            setFormData({ name: '', baseCurrency: 'USD', budgetPerPerson: '' });
            onClose();
            if (onCreated) onCreated(data);
            navigate(`/trips/${data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create trip');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(5, 10, 24, 0.92)' }}
                className="animate-fade-in"
            >
                <div className="glass-modal rounded-3xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white">Create New Trip</h2>
                                <p className="text-sm text-slate-500 mt-1">Set the foundation for your group adventure</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/[0.06] rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Map size={13} className="text-purple-400" />
                                    Trip Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full glass-input py-3 px-5 font-semibold !rounded-xl"
                                    placeholder="Summer Vacation 2026"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Coins size={13} className="text-violet-400" />
                                        Currency
                                    </label>
                                    <Select
                                        options={currencies}
                                        value={formData.baseCurrency}
                                        onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                                        className="w-full glass-input py-3 px-5 font-semibold !rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Wallet size={13} className="text-indigo-400" />
                                        Budget / person
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.budgetPerPerson}
                                            onChange={(e) => setFormData({ ...formData, budgetPerPerson: e.target.value })}
                                            className="w-full glass-input py-3 px-5 font-semibold !rounded-xl"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-sm uppercase tracking-widest mt-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Create Trip
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default CreateTripModal;

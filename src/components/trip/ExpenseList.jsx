import React from 'react';
import { Receipt } from 'lucide-react';
import ExpenseListItem from './ExpenseListItem';

const ExpenseList = ({ expenses, trip, isAdmin, onEdit, onDelete, activeCategory, onAddClick }) => {
    const formatGroupDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';

        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];

        return `${day} ${month}, ${dayName}`;
    };

    const groupExpensesByDate = () => {
        const groups = {};
        const filteredExpenses = activeCategory === 'All'
            ? expenses
            : expenses.filter(e => e.category === activeCategory);

        filteredExpenses.forEach(expense => {
            const date = new Date(expense.createdAt).toISOString().split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(expense);
        });

        return Object.keys(groups).sort().reverse().map(date => ({
            date,
            expenses: groups[date]
        }));
    };

    const groupedExpenses = groupExpensesByDate();

    if (expenses.length === 0) {
        return (
            <div className="glass-card rounded-[2.5rem] p-16 text-center">
                <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <Receipt size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No expenses yet</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                    {trip.status === 'active' ? 'Keep track of your group spending and settle debts easily.' : 'This trip was completed without any recorded expenses.'}
                </p>
                {isAdmin && trip.status === 'active' && (
                    <button
                        onClick={onAddClick}
                        className="mt-4 text-purple-400 font-bold text-sm hover:underline"
                    >
                        Start tracking spendings
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {groupedExpenses.map((group) => (
                <div key={group.date} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                            {formatGroupDate(group.date)}
                        </h3>
                        <div className="h-px w-full bg-gradient-to-r from-white/[0.06] to-transparent" />
                    </div>
                    <div className="space-y-3">
                        {group.expenses.map((expense) => (
                            <ExpenseListItem
                                key={expense._id}
                                expense={expense}
                                trip={trip}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseList;

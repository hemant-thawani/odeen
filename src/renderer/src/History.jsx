import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categoryEmoji = {
    Salary: '💼', Freelance: '💻', Investment: '📈', Gift: '🎁',
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '🧾',
    Entertainment: '🎬', Health: '❤️', Other: '📦',
};

const History = () => {
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const username = JSON.parse(localStorage.getItem('user'))?.username;

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/transactions/${username}/history`);
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message);
                } else {
                    setHistory(data);
                }
            } catch (err) {
                setError('Could not connect to server');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [username]);

    // Overall totals across all months
    const overallIncome = Object.values(history).reduce((sum, m) => sum + m.totalIncome, 0);
    const overallExpense = Object.values(history).reduce((sum, m) => sum + m.totalExpense, 0);
    const overallNet = overallIncome - overallExpense;

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans text-white p-6">

            {/* Header */}
            <div className="max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent mb-1">
                    Transaction History
                </h1>
                <p className="text-gray-400 text-sm">@{username}</p>
            </div>

            {/* Overall Summary Card */}
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Overall Summary</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Total Income</p>
                        <p className="text-xl font-bold text-green-400">₹{overallIncome.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Total Expense</p>
                        <p className="text-xl font-bold text-red-400">₹{overallExpense.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Net Balance</p>
                        <p className={`text-xl font-bold ${overallNet >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                            ₹{overallNet.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto">
                {loading && (
                    <p className="text-center text-gray-400 mt-20">Loading transactions...</p>
                )}

                {error && (
                    <p className="text-center text-red-400 mt-20">{error}</p>
                )}

                {!loading && !error && Object.keys(history).length === 0 && (
                    <p className="text-center text-gray-400 mt-20">No transactions found.</p>
                )}

                {/* Month wise sections */}
                {Object.entries(history).map(([month, data]) => (
                    <div key={month} className="mb-8">

                        {/* Month Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                                {month}
                            </h2>
                            <div className="flex gap-4 text-xs">
                                <span className="text-green-400">+₹{data.totalIncome.toLocaleString()}</span>
                                <span className="text-red-400">-₹{data.totalExpense.toLocaleString()}</span>
                                <span className={`font-semibold ${data.totalIncome - data.totalExpense >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                    Net: ₹{(data.totalIncome - data.totalExpense).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="flex flex-col gap-3">
                            {data.transactions.map((t) => (
                                <div
                                    key={t._id}
                                    className="flex items-center justify-between px-5 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">
                                            {categoryEmoji[t.category] || '📦'}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-white">{t.transaction_name}</p>
                                            <p className="text-xs text-gray-400">
                                                {t.category} · {new Date(t.date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${t.transaction_type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.transaction_type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">{t.transaction_type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

const DataEntry = () => {
    const [formData, setFormData] = useState({
        amount: '',
        transaction_name: '',
        transaction: 'Income',
        category: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const username = JSON.parse(localStorage.getItem('user'))?.username;

    const handleChange = (e) => {
        if (e.target.name === 'transaction') {
            setFormData({ ...formData, transaction: e.target.value, category: '' });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.category) {
            setMessage('Error: Please select a category');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    amount: Number(formData.amount),
                    transaction_name: formData.transaction_name,
                    transaction_type: formData.transaction,
                    category: formData.category,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(`Error: ${data.message}`);
            } else {
                setMessage('Transaction saved successfully!');
                setFormData({ amount: '', transaction_name: '', transaction: 'Income', category: '' });
            }
        } catch (err) {
            setMessage('Error: Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    const categories = formData.transaction === 'Income' ? incomeCategories : expenseCategories;

    return (
        <div className="flex items-center justify-center min-w-screen min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans text-white p-4">
            <div className="w-full max-w-md p-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl text-center">
                <h1 className="font-bold mb-6 text-lg bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Enter transaction details
                </h1>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="text-left">
                        <label className="block text-xs font-medium mb-2 text-gray-300">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            placeholder="Enter your amount"
                            required
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-medium mb-2 text-gray-300">Transaction name</label>
                        <input
                            type="text"
                            name="transaction_name"
                            value={formData.transaction_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            placeholder="Enter name of Transaction"
                            required
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-medium mb-2 text-gray-300">Transaction Type</label>
                        <select
                            name="transaction"
                            value={formData.transaction}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-blue-500 transition-all">
                            <option value="Income" className="bg-[#302b63] text-white">Income</option>
                            <option value="Expense" className="bg-[#302b63] text-white">Expense</option>
                        </select>
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-medium mb-3 text-gray-300">
                            {formData.transaction} Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <label
                                    key={category}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all
                                        ${formData.category === category
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={formData.category === category}
                                        onChange={handleChange}
                                        className="accent-blue-500"
                                    />
                                    <span className="text-sm">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {message && (
                        <div className={`text-sm mt-2 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                    >
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DataEntry;
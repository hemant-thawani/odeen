import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const endpoint = isLogin ? '/login' : '/signup';
        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Success: ${data.message}`);
                if (isLogin) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => navigate('/home'), 1500);
                } else {
                    setTimeout(() => setIsLogin(true), 1500);
                }
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error: Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-w-screen min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans text-white p-4">
            <div className="w-full max-w-md p-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl animate-fade-in text-center">
                <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-sm text-gray-400 mb-8">
                    {isLogin ? 'Please enter your details' : 'Join us to get started'}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="text-left">
                        <label className="block text-xs font-medium mb-2 text-gray-300">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="text-left">
                        <label className="block text-xs font-medium mb-2 text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                            required
                        />
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
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
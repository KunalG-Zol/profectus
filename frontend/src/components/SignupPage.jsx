import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-rich-black to-[#071a2a] min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#01080e]/60 rounded-lg shadow-lg border border-orange-500/20">
                <div className="text-center">
                    <h1 className="font-k95 text-white-smoke text-4xl mb-2">Create an Account</h1>
                    <p className="font-josefin text-white-smoke/80">Start your journey with Profectus today.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-josefin font-medium text-white-smoke/90">Username</label>
                        <input type="text" name="username" id="username" className="bg-white-smoke/10 border border-orange-500/30 text-white-smoke text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5" placeholder="your_username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-josefin font-medium text-white-smoke/90">Your email</label>
                        <input type="email" name="email" id="email" className="bg-white-smoke/10 border border-orange-500/30 text-white-smoke text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-josefin font-medium text-white-smoke/90">Password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-white-smoke/10 border border-orange-500/30 text-white-smoke text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full text-white-smoke bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-josefin transition-all transform hover:scale-105">Create an account</button>
                    <p className="text-sm font-josefin text-white-smoke/80">
                        Already have an account? <Link to="/login" className="font-medium text-orange-500 hover:underline">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;

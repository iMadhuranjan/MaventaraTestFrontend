'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/app/store/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Both fields are required');
            return;
        }

        const res = await dispatch(loginUser(formData));
        console.log(res)
        if (res.payload?.success) {
            toast.success('Logged in successfully');
            router.push('/dashboard');
        } else {
            toast.error(res?.payload?.messsage || 'Login Failed');
        }
    };

    return (
        <div className="flex items-center min-h-screen justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm rounded-md bg-white p-6 shadow">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">Login Page</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                            placeholder="******"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-violet-600 py-2 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Not registered?{' '}
                    <a href="/register" className="text-violet-600 hover:underline">
                        Create an account
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

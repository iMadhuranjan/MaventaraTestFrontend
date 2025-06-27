"use client";

import { registerUser } from "@/app/store/authSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/navigation";
const RegisterPage = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            alert("All fields are required");
            return;
        }

        const res = await dispatch(registerUser(formData));
        console.log("REGISTER RESPONSE =>", res);

        if (res?.payload?.success) {
            router.push("/login");
            alert("Registered successfully");

        } else {
            alert(res?.payload?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-md bg-white p-6 shadow">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
                    Register Your Account
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-700">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            placeholder="******"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-violet-600 py-2 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-violet-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

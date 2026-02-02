"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                    </div>
                    <span className="text-2xl font-bold text-white">Bro</span>
                </Link>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-center mb-6">Sign in to continue to Study Buddy</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

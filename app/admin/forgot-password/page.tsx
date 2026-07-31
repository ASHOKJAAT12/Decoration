'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authAPI.forgotPassword(email);
            toast.success(data.message);
            setIsSent(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to send reset link';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
                    <p className="text-gray-400 mt-2">
                        {isSent
                            ? 'Check your email for the reset link'
                            : "Enter your email and we'll send you a reset link"}
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@decoration.com"
                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : 'Send Reset Link'}
                        </button>

                        <div className="text-center">
                            <Link href="/admin/login" className="text-sm text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Email Sent!</p>
                            <p className="text-gray-400 text-sm mt-2">
                                If an account exists for <strong className="text-white">{email}</strong>, you&apos;ll receive a password reset link shortly.
                            </p>
                        </div>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

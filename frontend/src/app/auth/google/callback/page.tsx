"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const TOKEN_KEY = 'studybuddy_token';
const USER_KEY = 'studybuddy_user';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError('Google sign-in was cancelled');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }

        if (!code) {
            setError('No authorization code received');
            setTimeout(() => router.push('/login'), 2000);
            return;
        }

        // Exchange code for token
        const exchangeCode = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/google/callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Google sign-in failed');
                }

                const data = await res.json();

                // Store auth data
                localStorage.setItem(TOKEN_KEY, data.token.access_token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));

                // Redirect to app
                router.push('/app');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Google sign-in failed');
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        exchangeCode();
    }, [searchParams, router]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
            <div className="text-center">
                {error ? (
                    <div className="space-y-4">
                        <div className="text-red-400 text-lg">{error}</div>
                        <p className="text-slate-500">Redirecting to login...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                        <p className="text-slate-400">Completing Google sign-in...</p>
                    </div>
                )}
            </div>
        </main>
    );
}

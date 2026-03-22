'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthErrorMessage } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        async function redirectIfAuthenticated() {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    router.replace('/dashboard');
                }
            } catch {
                // Ignore auto-session errors here; submit action shows actionable feedback.
            }
        }

        void redirectIfAuthenticated();
    }, [router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            if (!isSupabaseConfigured()) {
                setErrorMessage('Add real Supabase values in frontend/.env.local, then restart the dev server.');
                return;
            }

            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                setErrorMessage(getAuthErrorMessage(error.message));
                return;
            }

            router.replace('/dashboard');
        } catch {
            setErrorMessage('Unable to connect to Supabase. Verify env values and that the project is reachable.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="app-shell flex min-h-screen flex-col items-center justify-center p-6">
            <Card className="w-full max-w-md space-y-8 p-8 md:p-10">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-serif font-medium tracking-tight text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]">
                        Mindful
                    </Link>
                    <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Sign in to continue your journaling journey
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-[var(--color-muted)]">
                    Not a member?{' '}
                    <Link href="/signup" className="font-semibold leading-6 text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]">
                        Start your free trial
                    </Link>
                </p>
            </Card>
        </main>
    );
}

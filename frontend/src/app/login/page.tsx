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
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        async function redirectIfAuthenticated() {
            try {
                // If a session already exists, skip the login form.
                const supabase = getSupabaseBrowserClient();
                const { data } = await supabase.auth.getUser();
                if (data.user) {
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
            // Email/password sign-in creates the browser session used by protected pages.
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

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        setIsGoogleSubmitting(true);

        try {
            if (!isSupabaseConfigured()) {
                setErrorMessage('Add real Supabase values in frontend/.env.local, then restart the dev server.');
                return;
            }

            const supabase = getSupabaseBrowserClient();
            // Supabase redirects to Google, then back to /auth/callback.
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                },
            });

            if (error) {
                setErrorMessage(getAuthErrorMessage(error.message));
                return;
            }
        } catch {
            setErrorMessage('Unable to start Google sign-in. Please try again.');
        } finally {
            setIsGoogleSubmitting(false);
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
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-[var(--color-text)]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 pr-12 text-sm text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                                            <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                                            <path d="M9.9 4.2A10.9 10.9 0 0112 4c5.5 0 9.4 4.7 10 8-.2 1.2-.9 2.7-2.1 4.1" />
                                            <path d="M6.2 6.2C4.2 7.6 2.8 9.8 2 12c.6 3.3 4.5 8 10 8 1.8 0 3.4-.5 4.7-1.2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="text-right">
                                <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || isGoogleSubmitting}
                            className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div>
                        <button
                            type="button"
                            disabled={isSubmitting || isGoogleSubmitting}
                            onClick={handleGoogleSignIn}
                            className={buttonClasses({ variant: 'secondary', size: 'md', fullWidth: true })}
                        >
                            {isGoogleSubmitting ? 'Redirecting to Google...' : 'Continue with Google'}
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

'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthErrorMessage, getOAuthRedirectTo } from '@/lib/auth';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        async function redirectIfAuthenticated() {
            try {
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
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            if (!isSupabaseConfigured()) {
                setErrorMessage('Add real Supabase values in frontend/.env.local, then restart the dev server.');
                return;
            }

            const supabase = getSupabaseBrowserClient();
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: fullName.trim(),
                    },
                },
            });

            if (error) {
                setErrorMessage(getAuthErrorMessage(error.message));
                return;
            }

            if (data.session) {
                await supabase.auth.signOut();
            }

            setSuccessMessage('Account created. Check your email if confirmation is required, then sign in.');
            setTimeout(() => {
                router.replace('/login');
            }, 1200);
        } catch {
            setErrorMessage('Unable to connect to Supabase. Verify env values and that the project is reachable.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsGoogleSubmitting(true);

        try {
            if (!isSupabaseConfigured()) {
                setErrorMessage('Add real Supabase values in frontend/.env.local, then restart the dev server.');
                return;
            }

            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: getOAuthRedirectTo('/dashboard'),
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
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Start your mindful journey today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
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
                            autoComplete="new-password"
                            required
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    {successMessage && (
                        <p className="text-sm text-emerald-700">{successMessage}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || isGoogleSubmitting}
                            className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign up'}
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
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold leading-6 text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]">
                        Log in
                    </Link>
                </p>
            </Card>
        </main>
    );
}

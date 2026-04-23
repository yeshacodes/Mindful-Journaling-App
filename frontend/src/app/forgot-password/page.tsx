'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthErrorMessage } from '@/lib/auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setErrorMessage(getAuthErrorMessage(error.message));
                return;
            }

            setSuccessMessage('If an account exists for that email, a reset link has been sent.');
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
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Enter your email and we will send you a reset link
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    {successMessage && (
                        <p className="text-sm text-emerald-700">{successMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={buttonClasses({ variant: 'primary', size: 'md', fullWidth: true })}
                    >
                        {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
                    </button>
                </form>

                <p className="mt-10 text-center text-sm text-[var(--color-muted)]">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-semibold leading-6 text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]">
                        Back to login
                    </Link>
                </p>
            </Card>
        </main>
    );
}

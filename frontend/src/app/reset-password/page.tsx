'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { getAuthErrorMessage } from '@/lib/auth';

type PasswordRequirement = {
    label: string;
    message: string;
    met: boolean;
};

function getPasswordRequirements(password: string): PasswordRequirement[] {
    return [
        {
            label: 'At least 8 characters',
            message: 'Password must be at least 8 characters long.',
            met: password.length >= 8,
        },
        {
            label: 'At least 1 uppercase letter',
            message: 'Password must include at least 1 uppercase letter.',
            met: /[A-Z]/.test(password),
        },
        {
            label: 'At least 1 lowercase letter',
            message: 'Password must include at least 1 lowercase letter.',
            met: /[a-z]/.test(password),
        },
        {
            label: 'At least 1 number',
            message: 'Password must include at least 1 number.',
            met: /\d/.test(password),
        },
        {
            label: 'At least 1 special character',
            message: 'Password must include at least 1 special character.',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];
}

function getPasswordValidationMessage(password: string): string | null {
    const unmetRequirement = getPasswordRequirements(password).find((requirement) => !requirement.met);
    return unmetRequirement?.message ?? null;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordRequirements = getPasswordRequirements(newPassword);
    const passwordValidationMessage = getPasswordValidationMessage(newPassword);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (passwordValidationMessage) {
            setErrorMessage(passwordValidationMessage);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (!isSupabaseConfigured()) {
                setErrorMessage('Add real Supabase values in frontend/.env.local, then restart the dev server.');
                return;
            }

            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                setErrorMessage(getAuthErrorMessage(error.message));
                return;
            }

            setSuccessMessage('Password updated successfully. You can now sign in.');
            await supabase.auth.signOut();
            router.replace('/login');
            router.refresh();
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
                        Set a new password
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Enter and confirm your new password
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="text-sm font-medium text-[var(--color-text)]">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 pr-12 text-sm text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                >
                                    {showNewPassword ? (
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
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="text-sm font-medium text-[var(--color-text)]">
                                Confirm new password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 pr-12 text-sm text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
                                >
                                    {showConfirmPassword ? (
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
                        </div>

                        {newPassword.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-sm text-[var(--color-muted)]">Password must include:</p>
                                <ul className="space-y-1 text-sm">
                                    {passwordRequirements.map((requirement) => (
                                        <li
                                            key={requirement.label}
                                            className={requirement.met ? 'text-emerald-700' : 'text-[var(--color-muted)]'}
                                        >
                                            {requirement.met ? '[x]' : '[ ]'} {requirement.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

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
                        {isSubmitting ? 'Updating password...' : 'Update password'}
                    </button>
                </form>
            </Card>
        </main>
    );
}

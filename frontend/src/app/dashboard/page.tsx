'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { JournalCard } from '@/components/journal/journal-card';
import { Card } from '@/components/ui/card';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getJournalEntries, JournalEntry } from '@/lib/journal';

function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    // Check if it was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTimeGreeting(hours: number) {
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 18) return 'Good Afternoon';
    return 'Good Evening';
}

function toTitleCase(name: string) {
    return name
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function DashboardPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState('User');
    const [greeting, setGreeting] = useState('Good Morning');
    const router = useRouter();

    useEffect(() => {
        async function loadPageData() {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data } = await supabase.auth.getUser();
                const fullName = data.user?.user_metadata?.full_name;
                if (typeof fullName === 'string' && fullName.trim()) {
                    setDisplayName(toTitleCase(fullName.trim()));
                }

                const journalEntries = await getJournalEntries(20);
                setEntries(journalEntries);
            } catch {
                setLoadError('Unable to load your journal right now. Please refresh.');
            } finally {
                setIsHydrated(true);
            }
        }

        setGreeting(getTimeGreeting(new Date().getHours()));
        void loadPageData();
    }, []);

    const handleLogout = async () => {
        try {
            const supabase = getSupabaseBrowserClient();
            await supabase.auth.signOut();
        } catch {
            // Fall back to local redirect even if auth client is unavailable.
        }
        router.replace('/login');
    };

    return (
        <main className="app-shell">
            <nav className="app-nav">
                <div className="page-wrap">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="text-xl font-serif font-medium tracking-tight text-[var(--color-text)]">
                                    Mindful
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/journal" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
                                History
                            </Link>
                            <button type="button" onClick={handleLogout} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="page-wrap page-section max-w-5xl space-y-10 md:space-y-12">
                <div className="md:flex md:items-end md:justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Daily Reflection</p>
                        <h2 className="text-4xl font-serif leading-[1.1] sm:text-5xl">
                            {greeting}, {displayName}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
                            Pause for a moment. Write what is true today and track how your mood shifts over time.
                        </p>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <Link
                            href="/journal/new"
                            className={`${buttonClasses({ variant: 'primary', size: 'lg' })} shadow-[0_10px_24px_-14px_rgba(127,153,139,0.75)]`}
                        >
                            New Entry
                        </Link>
                    </div>
                </div>

                {!isHydrated ? (
                    <Card className="p-10 text-center">
                        <p className="text-sm text-[var(--color-muted)]">Loading your journal...</p>
                    </Card>
                ) : loadError ? (
                    <Card className="p-10 text-center">
                        <p className="text-sm text-red-600">{loadError}</p>
                    </Card>
                ) : entries.length === 0 ? (
                    <Card className="p-10 text-center">
                        <p className="text-lg font-serif text-[var(--color-text)]">Your journal is empty.</p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">Start with one short note today.</p>
                    </Card>
                ) : (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                Recent Entries
                            </h3>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            {entries.slice(0, 6).map((entry) => (
                                <JournalCard
                                    key={entry.id}
                                    title={entry.title}
                                    text={entry.text}
                                    date={formatRelativeDate(entry.createdAt)}
                                    mood={entry.mood}
                                    onClick={() => router.push(`/journal/${entry.id}`)}
                                    compact
                                />
                            ))}
                        </div>
                    </section>
                )}

                {isHydrated && entries.length > 6 && (
                    <div className="flex justify-end">
                        <Link href="/journal" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                            View all entries
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

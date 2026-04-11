'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { JournalCard } from '@/components/journal/journal-card';
import { Card } from '@/components/ui/card';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getJournalEntries, JournalEntry } from '@/lib/journal';

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export default function JournalHistoryPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadEntries() {
            try {
                const journalEntries = await getJournalEntries();
                setEntries(journalEntries);
            } catch {
                setLoadError('Unable to load your entries right now. Please refresh.');
            } finally {
                setIsHydrated(true);
            }
        }

        void loadEntries();
    }, []);

    const handleLogout = async () => {
        const supabase = getSupabaseBrowserClient();
        try {
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) throw error;
        } catch {
            // Ensure this browser session is cleared even if global revoke fails.
            await supabase.auth.signOut({ scope: 'local' });
        }
        router.replace('/login');
        router.refresh();
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
                            <Link href="/dashboard" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
                                Dashboard
                            </Link>
                            <button type="button" onClick={handleLogout} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="page-wrap page-section max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Journal Archive</p>
                        <h1 className="text-3xl font-serif tracking-tight">Journal History</h1>
                    </div>
                    <Link
                        href="/journal/new"
                        className={buttonClasses({ variant: 'primary' })}
                    >
                        New Entry
                    </Link>
                </div>

                {!isHydrated ? (
                    <Card className="p-10 text-center">
                        <p className="text-sm text-[var(--color-muted)]">Loading your entries...</p>
                    </Card>
                ) : loadError ? (
                    <Card className="p-10 text-center">
                        <p className="text-sm text-red-600">{loadError}</p>
                    </Card>
                ) : entries.length === 0 ? (
                    <Card className="p-10 text-center">
                        <p className="text-lg font-serif text-[var(--color-text)]">No entries yet.</p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">Once you start writing, your history will appear here.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {entries.map((entry) => (
                            <JournalCard
                                key={entry.id}
                                title={entry.title}
                                text={entry.text}
                                date={formatDate(entry.createdAt)}
                                mood={entry.mood}
                                onClick={() => router.push(`/journal/${entry.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

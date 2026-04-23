'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { JournalCard } from '@/components/journal/journal-card';
import { Card } from '@/components/ui/card';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getJournalEntries, JournalEntry } from '@/lib/journal';
import { getMoodTrendSummary, MoodTrendSummary } from '@/lib/moodTrends';

const FALLBACK_INSIGHT_MESSAGE =
    'There is not quite enough mood data yet to notice a clear pattern, but each entry you add will help build a fuller picture over time.';

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

function parseLocalDateKey(dateKey: string) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function formatMonthLabel(monthKey: string) {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, (month ?? 1) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [moodTrends, setMoodTrends] = useState<MoodTrendSummary | null>(null);
    const [moodInsight, setMoodInsight] = useState<string | null>(null);
    const [isLoadingMoodInsight, setIsLoadingMoodInsight] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState('User');
    const [greeting, setGreeting] = useState('Good Morning');
    const router = useRouter();

    async function loadMoodInsight(summary: MoodTrendSummary) {
        setIsLoadingMoodInsight(true);
        try {
            const res = await fetch('/api/mood-insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    totalEntries: summary.totalEntries,
                    thisMonth: summary.thisMonth,
                    recentMonths: summary.monthlyMoodCounts.slice(-3),
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch mood insight');
            }

            const data = await res.json();
            const insight = typeof data?.insight === 'string' ? data.insight.trim() : '';
            setMoodInsight(insight || FALLBACK_INSIGHT_MESSAGE);
        } catch {
            setMoodInsight(FALLBACK_INSIGHT_MESSAGE);
        } finally {
            setIsLoadingMoodInsight(false);
        }
    }

    useEffect(() => {
        async function loadPageData() {
            try {
                const supabase = getSupabaseBrowserClient();
                const { data } = await supabase.auth.getUser();
                const fullName = data.user?.user_metadata?.full_name;
                if (typeof fullName === 'string' && fullName.trim()) {
                    setDisplayName(toTitleCase(fullName.trim()));
                }

                const [journalEntries, trendSummary] = await Promise.all([
                    getJournalEntries(20),
                    getMoodTrendSummary(),
                ]);
                setEntries(journalEntries);
                setMoodTrends(trendSummary);
                void loadMoodInsight(trendSummary);
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
                ) : (
                    <>
                        {moodTrends && (
                            <Card className="space-y-4 p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                        Mood Trends
                                    </h3>
                                    <span className="text-sm text-[var(--color-muted)]">
                                        {moodTrends.totalEntries} entries
                                    </span>
                                </div>

                                {moodTrends.totalEntries === 0 ? (
                                    <p className="text-sm text-[var(--color-muted)]">
                                        No mood data yet. Create your first journal entry to start tracking your trends.
                                    </p>
                                ) : moodTrends.totalEntries < 3 ? (
                                    <p className="text-sm text-[var(--color-muted)]">
                                        We&apos;re still building your mood trends. Add a few more entries to unlock weekly and monthly insights.
                                    </p>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                                This Week
                                            </p>
                                            <div className="grid gap-3 text-sm text-[var(--color-muted)] md:grid-cols-2">
                                                <p>
                                                    Total entries:{' '}
                                                    <span className="font-medium text-[var(--color-text)]">
                                                        {moodTrends.thisWeek.totalEntries}
                                                    </span>
                                                </p>
                                                <p>
                                                    You&apos;ve been feeling mostly{' '}
                                                    <span className="font-medium text-[var(--color-text)]">
                                                        {moodTrends.thisWeek.mostCommonMood ?? 'a mix of emotions this week'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                                Last 7 Days
                                            </p>
                                            <div className="grid grid-cols-7 gap-2">
                                                {moodTrends.last7Days.map((day) => (
                                                    <div
                                                        key={day.date}
                                                        className="rounded-2xl border border-[var(--color-border)] bg-white/65 px-2 py-2 text-center"
                                                    >
                                                        <p className="text-[10px] text-[var(--color-muted)]">
                                                            {parseLocalDateKey(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </p>
                                                        <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{day.count}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                                This Month
                                            </p>
                                            <div className="grid gap-3 text-sm text-[var(--color-muted)] md:grid-cols-2">
                                                <p>
                                                    Total entries:{' '}
                                                    <span className="font-medium text-[var(--color-text)]">
                                                        {moodTrends.thisMonth.totalEntries}
                                                    </span>
                                                </p>
                                                <p>
                                                    You&apos;ve been feeling mostly{' '}
                                                    <span className="font-medium text-[var(--color-text)]">
                                                        {moodTrends.thisMonth.mostCommonMood ?? 'a mix of emotions this month'}
                                                    </span>
                                                </p>
                                            </div>
                                            {Object.keys(moodTrends.thisMonth.moodCounts).length === 0 ? (
                                                <p className="text-sm text-[var(--color-muted)]">
                                                    No mood data this month yet.
                                                </p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(moodTrends.thisMonth.moodCounts)
                                                        .sort((a, b) => b[1] - a[1])
                                                        .map(([mood, count]) => (
                                                            <span
                                                                key={mood}
                                                                className="rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1 text-xs text-[var(--color-muted)]"
                                                            >
                                                                {mood}: {count}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}

                                            <div className="rounded-2xl border border-[var(--color-border)] bg-white/65 p-4">
                                                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                                    Mood Insight
                                                </p>
                                                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                                                    {isLoadingMoodInsight
                                                        ? 'Looking at your monthly mood pattern...'
                                                        : moodInsight ?? FALLBACK_INSIGHT_MESSAGE}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                                                Recent Months
                                            </p>
                                            {moodTrends.monthlyMoodCounts.length === 0 ? (
                                                <p className="text-sm text-[var(--color-muted)]">
                                                    No monthly trends yet.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {moodTrends.monthlyMoodCounts
                                                        .slice(-3)
                                                        .reverse()
                                                        .map((month) => (
                                                            <div
                                                                key={month.month}
                                                                className="rounded-2xl border border-[var(--color-border)] bg-white/65 px-3 py-2"
                                                            >
                                                                <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                                                    {formatMonthLabel(month.month)}
                                                                </p>
                                                                {Object.keys(month.moods).length === 0 ? (
                                                                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                                                                        No mood data
                                                                    </p>
                                                                ) : (
                                                                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                                                                        {Object.entries(month.moods)
                                                                            .sort((a, b) => b[1] - a[1])
                                                                            .map(([mood, count]) => `${mood}: ${count}`)
                                                                            .join(' | ')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Card>
                        )}

                        {entries.length === 0 ? (
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
                    </>
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

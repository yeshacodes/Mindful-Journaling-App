'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type CalendarEntry = {
    id: string;
    title: string | null;
    content: string;
    mood: string | null;
    created_at: string;
};

type EntriesByDate = Record<string, CalendarEntry[]>;

function toLocalDateKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatMonthHeading(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDayHeading(dateKey: string) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, (month ?? 1) - 1, day ?? 1);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

function buildMonthGrid(monthDate: Date) {
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const cells: Array<number | null> = [];

    // Pad the first week so day 1 lands on the correct weekday column.
    for (let i = 0; i < startOffset; i += 1) {
        cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(day);
    }

    return cells;
}

function groupEntriesByDate(entries: CalendarEntry[]) {
    // Group entries by local calendar day key (YYYY-MM-DD).
    return entries.reduce<EntriesByDate>((acc, entry) => {
        const dateKey = toLocalDateKey(new Date(entry.created_at));
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(entry);
        return acc;
    }, {});
}

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [entriesByDate, setEntriesByDate] = useState<EntriesByDate>({});
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // This flag avoids setting state after the user switches months quickly.
        let isMounted = true;

        async function loadMonthEntries() {
            setIsLoading(true);
            setErrorMessage(null);
            setSelectedDateKey(null);

            try {
                const supabase = getSupabaseBrowserClient();
                const {
                    data: { user },
                    error: authError,
                } = await supabase.auth.getUser();

                if (authError) throw authError;
                if (!user) throw new Error('You need to be logged in to view calendar entries.');

                const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

                // Fetch only current month entries for the logged-in user.
                const { data, error } = await supabase
                    .from('journal_entries')
                    .select('id, title, content, mood, created_at')
                    .eq('user_id', user.id)
                    .gte('created_at', monthStart.toISOString())
                    .lt('created_at', nextMonthStart.toISOString())
                    .order('created_at', { ascending: false })
                    .returns<CalendarEntry[]>();

                if (error) throw error;

                if (isMounted) {
                    setEntriesByDate(groupEntriesByDate(data ?? []));
                }
            } catch {
                if (isMounted) {
                    setErrorMessage('Unable to load calendar entries right now.');
                    setEntriesByDate({});
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadMonthEntries();

        return () => {
            isMounted = false;
        };
    }, [currentMonth]);

    // Memoize derived calendar data so it only recalculates when its inputs change.
    const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
    const totalEntriesThisMonth = useMemo(
        () => Object.values(entriesByDate).reduce((sum, dayEntries) => sum + dayEntries.length, 0),
        [entriesByDate]
    );
    const selectedEntries = selectedDateKey ? entriesByDate[selectedDateKey] ?? [] : null;

    const goToPreviousMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <Card className="space-y-5 p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Journal Calendar
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="rounded-xl border border-[var(--color-border)] bg-white/70 px-3 py-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={goToNextMonth}
                        className="rounded-xl border border-[var(--color-border)] bg-white/70 px-3 py-1.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                    >
                        Next
                    </button>
                </div>
            </div>

            <p className="text-base font-medium text-[var(--color-text)]">{formatMonthHeading(currentMonth)}</p>

            <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {monthGrid.map((day, index) => {
                    if (!day) {
                        return <div key={`blank-${index}`} className="h-12 rounded-xl border border-transparent" />;
                    }

                    const dateKey = toLocalDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                    const hasEntries = (entriesByDate[dateKey]?.length ?? 0) > 0;
                    const isSelected = selectedDateKey === dateKey;

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            onClick={() => setSelectedDateKey(dateKey)}
                            className={`relative h-12 rounded-xl border text-sm transition-colors ${
                                isSelected
                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-text)]'
                                    : hasEntries
                                        ? 'border-[var(--color-border)] bg-white/80 text-[var(--color-text)] hover:bg-white'
                                        : 'border-[var(--color-border)] bg-white/55 text-[var(--color-muted)] hover:bg-white/75'
                            }`}
                        >
                            <span>{day}</span>
                            {hasEntries && (
                                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-accent)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {isLoading && (
                <p className="text-sm text-[var(--color-muted)]">Loading calendar entries...</p>
            )}

            {!isLoading && errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            {!isLoading && !errorMessage && totalEntriesThisMonth === 0 && (
                <p className="text-sm text-[var(--color-muted)]">No entries yet this month</p>
            )}

            {!isLoading && !errorMessage && selectedDateKey && (
                <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                    <p className="text-sm font-medium text-[var(--color-text)]">{formatDayHeading(selectedDateKey)}</p>
                    {selectedEntries && selectedEntries.length > 0 ? (
                        <div className="space-y-2">
                            {selectedEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-3"
                                >
                                    <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                        {entry.mood ?? 'Not set'}
                                    </span>
                                    <p className="mt-2 truncate text-sm text-[var(--color-text)]" title={entry.content}>
                                        {entry.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-muted)]">No journal entries for this day</p>
                    )}
                </div>
            )}
        </Card>
    );
}

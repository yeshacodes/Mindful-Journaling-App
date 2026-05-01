'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteJournalEntry, getJournalEntryById, JournalEntry, updateJournalEntry } from '@/lib/journal';

const MOODS = ['Calm', 'Happy', 'Anxious', 'Sad', 'Grateful'];

function formatDate(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function EntryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string | undefined>();

    useEffect(() => {
        if (!params.id) return;
        // Next route params can be a string or array, so normalize to one id.
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        async function loadEntry() {
            try {
                const foundEntry = await getJournalEntryById(id);
                setEntry(foundEntry);
                if (foundEntry) {
                    // Keep form fields separate from the saved entry until Save is clicked.
                    setTitle(foundEntry.title === 'Untitled Entry' ? '' : foundEntry.title);
                    setContent(foundEntry.text);
                    setMood(foundEntry.mood);
                }
            } catch {
                setLoadError('Unable to load this entry right now.');
            } finally {
                setIsHydrated(true);
            }
        }

        void loadEntry();
    }, [params.id]);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            if (entry) {
                setIsDeleting(true);
                try {
                    await deleteJournalEntry(entry.id);
                } catch {
                    setLoadError('Unable to delete this entry right now.');
                    setIsDeleting(false);
                    return;
                }
                router.push('/dashboard');
            }
        }
    };

    const handleSave = async () => {
        if (!entry) return;
        if (!content.trim()) {
            setLoadError('Entry content cannot be empty.');
            setSaveMessage(null);
            return;
        }

        setLoadError(null);
        setSaveMessage(null);
        setIsSaving(true);

        try {
            // Save the edited form values and refresh local state with the saved row.
            const updated = await updateJournalEntry(entry.id, {
                title,
                content,
                mood,
            });
            setEntry(updated);
            setTitle(updated.title === 'Untitled Entry' ? '' : updated.title);
            setContent(updated.text);
            setMood(updated.mood);
            setSaveMessage('Changes saved.');
        } catch {
            setLoadError('Unable to save changes right now. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-stone-500">Loading entry...</p>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-stone-900">{loadError ? 'Unable to Load Entry' : 'Entry Not Found'}</h1>
                {loadError && <p className="text-sm text-red-600">{loadError}</p>}
                <Link href="/dashboard" className="text-stone-600 hover:text-stone-900">
                    &larr; Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen text-stone-800">
            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                                &larr; Back to Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || isSaving}
                                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <article className="prose prose-stone lg:prose-xl mx-auto">
                    <div className="flex flex-col space-y-4 mb-8">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title (optional)"
                            className="w-full border-0 bg-transparent p-0 font-serif text-4xl font-bold text-stone-900 m-0 leading-tight focus:outline-none"
                        />

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <time className="text-stone-500">{formatDate(entry.updatedAt)}</time>
                        </div>

                        <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">Mood</p>
                            <div className="flex flex-wrap gap-2">
                                {MOODS.map((currentMood) => (
                                    <button
                                        key={currentMood}
                                        type="button"
                                        onClick={() => setMood(currentMood === mood ? undefined : currentMood)}
                                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${mood === currentMood
                                                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                                                : 'border-[var(--color-border)] bg-white/70 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
                                            }`}
                                    >
                                        {currentMood}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="min-h-[45vh] w-full resize-none rounded-3xl border border-[var(--color-border)] bg-white/70 p-5 font-serif text-lg leading-relaxed text-stone-700 placeholder:text-stone-400 focus:border-[var(--color-accent)] focus:outline-none"
                    />

                    {loadError && (
                        <p className="mt-4 text-sm text-red-600">{loadError}</p>
                    )}

                    {saveMessage && (
                        <p className="mt-4 text-sm text-emerald-700">{saveMessage}</p>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || isDeleting}
                            className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </article>
            </div>
        </main>
    );
}

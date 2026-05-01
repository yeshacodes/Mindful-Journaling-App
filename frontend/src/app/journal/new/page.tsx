'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PromptBox } from '@/components/journal/prompt-box';
import { createJournalEntry } from '@/lib/journal';
import { useCallback, useEffect, useState } from 'react';

const MOODS = ['Calm', 'Happy', 'Anxious', 'Sad', 'Grateful'];

export default function NewEntryPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [mood, setMood] = useState<string | undefined>();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
    const [promptError, setPromptError] = useState<string | null>(null);

    const generatePrompt = useCallback(async () => {
        try {
            setIsGeneratingPrompt(true);
            setPromptError(null);

            // Send the selected mood and tags so the prompt can feel more relevant.
            const res = await fetch('/api/journal-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood, tags }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate prompt');
            }

            setAiPrompt(data.prompt);
        } catch {
            setPromptError('Could not generate prompt. Try again.');
            setAiPrompt('');
        } finally {
            setIsGeneratingPrompt(false);
        }
    }, [mood, tags]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            // Avoid duplicate tags so the prompt context stays clean.
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = async () => {
        if (!text.trim()) {
            setErrorMessage('Please write a little before saving your entry.');
            return;
        }

        setErrorMessage(null);
        setIsSaving(true);

        try {
            // Supabase stores the entry, then the user is returned to history.
            await createJournalEntry({
                title,
                text,
                mood,
            });

            setShowToast(true);
            setTimeout(() => {
                router.push('/journal');
            }, 1000);
        } catch {
            setErrorMessage('We could not save your entry right now. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        // Keep the prompt matched to the current mood and tags.
        generatePrompt();
    }, [generatePrompt]);

    return (
        <main className="app-shell relative flex min-h-screen flex-col">
            {showToast && (
                <div className="animate-fade-in-down fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full bg-[var(--color-accent-strong)] px-6 py-3 text-sm font-medium text-white shadow-lg">
                    Entry saved
                </div>
            )}

            <nav className="app-nav">
                <div className="page-wrap max-w-5xl">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                            >
                                &larr; Back to Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {isSaving && (
                                <span className="animate-pulse text-sm font-medium text-[var(--color-muted)]">
                                    Saving...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="page-wrap page-section max-w-5xl flex-1">
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    <Card className="p-6 md:p-8">
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full border-0 bg-transparent p-0 font-serif text-4xl text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
                            />

                            <div>
                                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Mood
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {MOODS.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMood(m === mood ? undefined : m)}
                                            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                                                mood === m
                                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                                                    : 'border-[var(--color-border)] bg-white/70 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                    Tags
                                </p>
                                <div className="min-h-[40px] space-y-2 rounded-2xl border border-[var(--color-border)] bg-white/65 p-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center rounded-full bg-[var(--color-surface-strong)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] focus:outline-none"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder={
                                                tags.length === 0
                                                    ? 'Add tags... (press Enter)'
                                                    : 'Add another...'
                                            }
                                            className="min-w-[160px] flex-1 border-0 bg-transparent p-0 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What's on your mind?"
                                className="min-h-[56vh] w-full resize-none rounded-3xl border border-[var(--color-border)] bg-white/70 p-5 font-serif text-lg leading-relaxed text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                            />

                            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={buttonClasses({ variant: 'primary', size: 'md' })}
                                >
                                    {isSaving ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </div>
                    </Card>

                    <div className="sticky top-24 self-start space-y-4">
                        <Card className="space-y-6 border-dashed bg-[var(--color-surface-strong)]/55 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                                Writing Assistant
                            </p>

                            <PromptBox
                                title="AI suggestion"
                                prompt={isGeneratingPrompt ? 'Generating a prompt...' : aiPrompt}
                                className="bg-[var(--color-surface-strong)]"
                                actionLabel="Use this prompt"
                                onAction={() => {
                                    if (!aiPrompt) return;
                                    setText((prev) =>
                                        prev.trim() ? `${prev}\n\n${aiPrompt}` : aiPrompt
                                    );
                                }}
                            />

                            <button
                                type="button"
                                onClick={generatePrompt}
                                disabled={isGeneratingPrompt}
                                className="mt-2 flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm font-medium text-[var(--color-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isGeneratingPrompt ? 'Getting another prompt...' : 'Get another prompt'}
                            </button>

                            {promptError && (
                                <p className="text-sm text-red-600">{promptError}</p>
                            )}

                        </Card>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </main>
    );
}

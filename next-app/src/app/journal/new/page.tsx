'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { entriesStore } from '@/lib/entriesStore';

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

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = () => {
        if (!text.trim()) return;

        setIsSaving(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            entriesStore.addEntry({
                title: title.trim() || 'Untitled Entry',
                text,
                mood,
                tags
            });

            setShowToast(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        }, 500);
    };

    return (
        <main className="min-h-screen bg-stone-50 text-stone-800 flex flex-col relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-stone-800 text-white px-6 py-3 rounded-full shadow-lg transition-all animate-fade-in-down">
                    Saved (mock)
                </div>
            )}

            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                                &larr; Back to Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center">
                            {isSaving && (
                                <span className="text-sm font-medium text-stone-400 animate-pulse">
                                    Saving...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                {/* Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title (optional)"
                    className="w-full text-4xl font-serif font-bold bg-transparent border-0 focus:ring-0 placeholder:text-stone-300 p-0 text-stone-900"
                />

                {/* Mood Selection */}
                <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                        <button
                            key={m}
                            onClick={() => setMood(m === mood ? undefined : m)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${mood === m
                                    ? 'bg-stone-800 text-white shadow-md scale-105'
                                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Tags Input */}
                <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                            #{tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1.5 text-stone-400 hover:text-stone-600 focus:outline-none"
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
                        placeholder={tags.length === 0 ? "Add tags... (press Enter)" : "Add another..."}
                        className="bg-transparent border-0 focus:ring-0 p-0 text-sm text-stone-600 placeholder:text-stone-300 min-w-[150px]"
                    />
                </div>

                {/* Main Text Area */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-[50vh] text-lg leading-relaxed bg-transparent border-0 focus:ring-0 placeholder:text-stone-300 p-0 resize-none text-stone-700"
                ></textarea>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={handleSave}
                    disabled={!text.trim() || isSaving}
                    className={`rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all transform ${!text.trim() || isSaving
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-800 text-white hover:bg-stone-700 hover:scale-105 hover:shadow-xl'
                        }`}
                >
                    {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
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

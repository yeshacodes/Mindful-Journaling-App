'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { entriesStore, Entry } from '@/lib/entriesStore';

function getMoodColor(mood?: string) {
    switch (mood) {
        case 'Calm': return 'bg-green-100 text-green-800';
        case 'Happy': return 'bg-yellow-100 text-yellow-800';
        case 'Anxious': return 'bg-orange-100 text-orange-800';
        case 'Sad': return 'bg-blue-100 text-blue-800';
        case 'Grateful': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

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
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            const foundEntry = entriesStore.getEntryById(params.id as string);
            setEntry(foundEntry || null);
            setLoading(false);
        }
    }, [params.id]);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            if (entry) {
                entriesStore.deleteEntry(entry.id);
                router.push('/dashboard');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <p className="text-stone-500">Loading entry...</p>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-stone-900">Entry Not Found</h1>
                <Link href="/dashboard" className="text-stone-600 hover:text-stone-900">
                    &larr; Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-stone-50 text-stone-800">
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
                                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                            >
                                Delete Entry
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <article className="prose prose-stone lg:prose-xl mx-auto">
                    <div className="flex flex-col space-y-4 mb-8">
                        <h1 className="text-4xl font-serif font-bold text-stone-900 m-0 leading-tight">
                            {entry.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <time className="text-stone-500">{formatDate(entry.createdAt)}</time>

                            {entry.mood && (
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMoodColor(entry.mood)}`}>
                                    {entry.mood}
                                </span>
                            )}
                        </div>

                        {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {entry.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="whitespace-pre-wrap text-lg leading-relaxed text-stone-700 font-serif">
                        {entry.text}
                    </div>
                </article>
            </div>
        </main>
    );
}

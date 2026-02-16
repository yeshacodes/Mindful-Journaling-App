'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { entriesStore, Entry } from '@/lib/entriesStore';
import { useRouter } from 'next/navigation';

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export default function JournalHistoryPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const router = useRouter();

    useEffect(() => {
        setEntries(entriesStore.getEntries());
    }, []);

    return (
        <main className="min-h-screen bg-stone-50 text-stone-800">
            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="text-xl font-serif font-medium tracking-tight text-stone-900">
                                    Mindful
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-stone-900">
                                Dashboard
                            </Link>
                            <Link href="/login" className="text-sm font-medium text-stone-500 hover:text-stone-900">
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">Journal History</h1>
                    <Link
                        href="/journal/new"
                        className="rounded-md bg-stone-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 transition-all"
                    >
                        New Entry
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-stone-200">
                        {entries.length === 0 ? (
                            <li className="px-4 py-12 text-center text-stone-500">
                                No entries yet.
                            </li>
                        ) : entries.map((entry) => (
                            <li
                                key={entry.id}
                                onClick={() => router.push(`/journal/${entry.id}`)}
                                className="px-4 py-4 sm:px-6 hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium text-stone-900">{entry.title}</p>
                                    <div className="ml-2 flex flex-shrink-0">
                                        <p className="text-sm text-stone-500">{formatDate(entry.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-stone-500 line-clamp-2">
                                    {entry.text}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {entry.mood && (
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMoodColor(entry.mood)}`}>
                                            {entry.mood}
                                        </span>
                                    )}
                                    {entry.tags?.map(tag => (
                                        <span key={tag} className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}

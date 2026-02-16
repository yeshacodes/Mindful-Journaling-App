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

export default function DashboardPage() {
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
                            <Link href="/journal" className="text-sm font-medium text-stone-500 hover:text-stone-900">
                                History
                            </Link>
                            <Link href="/login" className="text-sm font-medium text-stone-500 hover:text-stone-900">
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-stone-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Good Morning, User
                        </h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <Link
                            href="/journal/new"
                            className="ml-3 inline-flex items-center rounded-md bg-stone-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 transition-all hover:scale-105"
                        >
                            New Entry
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" className="divide-y divide-stone-200">
                        {entries.length === 0 ? (
                            <li className="px-4 py-12 text-center text-stone-500">
                                No entries yet. Start by creating one!
                            </li>
                        ) : entries.slice(0, 5).map((entry) => (
                            <li
                                key={entry.id}
                                onClick={() => router.push(`/journal/${entry.id}`)}
                                className="px-4 py-4 sm:px-6 hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium text-stone-900">{entry.title}</p>
                                    <div className="ml-2 flex flex-shrink-0">
                                        {entry.mood && (
                                            <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getMoodColor(entry.mood)}`}>
                                                {entry.mood}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-stone-500 line-clamp-1">
                                            {entry.text}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-stone-500 sm:mt-0">
                                        <p>{formatDate(entry.createdAt)}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {entries.length > 5 && (
                        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-stone-200">
                            <Link href="/journal" className="text-sm font-medium text-stone-600 hover:text-stone-900">
                                View all entries &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

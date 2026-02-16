export interface Entry {
    id: string;
    title: string;
    text: string;
    mood?: string;
    tags?: string[];
    createdAt: string;
}

const STORAGE_KEY = 'mindful_journal_entries';

const MOCK_ENTRIES: Entry[] = [
    {
        id: 'mock-1',
        title: 'Morning Reflection',
        text: 'I felt really at peace today after my morning walk. The air was crisp and the birds were singing. It made me realize how important it is to start the day with intention.',
        mood: 'Calm',
        tags: ['morning', 'nature', 'peace'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    },
    {
        id: 'mock-2',
        title: 'Evening Unwind',
        text: 'Grateful for the delicious dinner and time with friends. We laughed so much. It is moments like these that make life sweet.',
        mood: 'Grateful',
        tags: ['friends', 'dinner', 'laughter'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
];

export const entriesStore = {
    getEntries: (): Entry[] => {
        if (typeof window === 'undefined') return [];

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Initialize with mock data if empty
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ENTRIES));
            return MOCK_ENTRIES;
        }

        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse entries', e);
            return [];
        }
    },

    addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => {
        const entries = entriesStore.getEntries();
        const newEntry: Entry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        const updatedEntries = [newEntry, ...entries];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        return newEntry;
    },

    getEntryById: (id: string): Entry | undefined => {
        const entries = entriesStore.getEntries();
        return entries.find((e) => e.id === id);
    },

    deleteEntry: (id: string) => {
        const entries = entriesStore.getEntries();
        const updatedEntries = entries.filter((e) => e.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
        return updatedEntries;
    }
};

import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TagChip } from '../components/TagChip';
import { getMoodEmoji } from '../components/MoodPicker';
import { useEntries } from '../../lib/EntriesContext';
import { Search, Filter } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

export function Entries() {
  const { entries } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.content.toLowerCase().includes(query) ||
          entry.prompt.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by date range
    if (dateRange === '7days') {
      const cutoff = subDays(new Date(), 7);
      filtered = filtered.filter((entry) => isAfter(entry.date, cutoff));
    } else if (dateRange === '30days') {
      const cutoff = subDays(new Date(), 30);
      filtered = filtered.filter((entry) => isAfter(entry.date, cutoff));
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter((entry) => entry.tags.includes(selectedTag));
    }

    return filtered;
  }, [entries, searchQuery, dateRange, selectedTag]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Journal Entries</h1>
          <p className="text-slate-500 mt-1">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range and Tag Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500 mb-4">
              {searchQuery || dateRange !== 'all' || selectedTag !== 'all'
                ? 'No entries match your filters'
                : 'No entries yet'}
            </p>
            {!searchQuery && dateRange === 'all' && selectedTag === 'all' && (
              <Link to="/entry/new">
                <Button>Create Your First Entry</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Link key={entry.id} to={`/entries/${entry.id}`}>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <p className="text-sm text-slate-500">
                          {format(entry.date, 'EEEE, MMMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <p className="text-slate-700 mb-3 line-clamp-3">
                        {entry.content}
                      </p>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <TagChip key={tag} tag={tag} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

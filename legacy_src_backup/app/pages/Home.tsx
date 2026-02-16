import { useState } from 'react';
import { Link } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { MoodPicker, getMoodEmoji } from '../components/MoodPicker';
import { useEntries } from '../../lib/EntriesContext';
import { mockPrompts } from '../../lib/mockData';
import { PlusCircle, Sparkles, User, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export function Home() {
  const { entries } = useEntries();
  const [currentPrompt, setCurrentPrompt] = useState(mockPrompts[0]);
  const [quickMood, setQuickMood] = useState<number | null>(null);

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * mockPrompts.length);
    setCurrentPrompt(mockPrompts[randomIndex]);
  };

  const recentEntries = entries.slice(0, 5);

  // Calculate mood trend
  const last7Days = entries.slice(0, 7);
  const avgMood = last7Days.length > 0
    ? (last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length).toFixed(1)
    : 'N/A';

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="size-5" />
          </Button>
        </div>

        {/* Quick Mood Picker */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            How are you feeling?
          </h2>
          <MoodPicker
            value={quickMood || 3}
            onChange={setQuickMood}
            size="lg"
          />
          {quickMood && (
            <p className="text-sm text-slate-500 mt-3">
              Mood logged! This can help you track patterns over time.
            </p>
          )}
        </Card>

        {/* Today's Prompt */}
        <Card className="p-6 bg-slate-100 border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="size-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                Today's Prompt
              </h2>
              <p className="text-slate-700 text-lg italic">"{currentPrompt}"</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/entry/new" className="flex-1">
              <Button className="w-full">
                <PlusCircle className="size-4 mr-2" />
                Start Writing
              </Button>
            </Link>
            <Button variant="outline" onClick={generatePrompt}>
              <Sparkles className="size-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </Card>

        {/* Mood Trend Preview */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="size-5 text-green-600" />
            <h2 className="text-lg font-semibold text-slate-800">
              Your Week at a Glance
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Entries This Week</p>
              <p className="text-2xl font-bold text-slate-800">{last7Days.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Average Mood</p>
              <p className="text-2xl font-bold text-slate-800">{avgMood} / 5</p>
            </div>
          </div>
          <Link to="/analytics">
            <Button variant="link" className="mt-3 px-0">
              View Full Analytics →
            </Button>
          </Link>
        </Card>

        {/* Recent Entries */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Recent Entries</h2>
            <Link to="/entries">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          {recentEntries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-500 mb-4">No entries yet. Start your journey!</p>
              <Link to="/entry/new">
                <Button>Create Your First Entry</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <Link key={entry.id} to={`/entries/${entry.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-500">
                          {format(entry.date, 'MMM d, yyyy • h:mm a')}
                        </p>
                        <p className="text-slate-700 mt-1 line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
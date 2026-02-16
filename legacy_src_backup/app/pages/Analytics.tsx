import { useMemo } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card } from '../components/ui/card';
import { useEntries } from '../../lib/EntriesContext';
import { getMoodEmoji } from '../components/MoodPicker';
import { TrendingUp, Calendar, Heart, Tag } from 'lucide-react';
import { subDays, subWeeks, isAfter, format } from 'date-fns';

export function Analytics() {
  const { entries } = useEntries();

  // Weekly stats
  const weekStats = useMemo(() => {
    const weekAgo = subWeeks(new Date(), 1);
    const weekEntries = entries.filter((e) => isAfter(e.date, weekAgo));
    const avgMood = weekEntries.length > 0
      ? weekEntries.reduce((sum, e) => sum + e.mood, 0) / weekEntries.length
      : 0;
    return {
      count: weekEntries.length,
      avgMood: avgMood.toFixed(1),
    };
  }, [entries]);

  // Monthly stats
  const monthStats = useMemo(() => {
    const monthAgo = subDays(new Date(), 30);
    const monthEntries = entries.filter((e) => isAfter(e.date, monthAgo));
    const avgMood = monthEntries.length > 0
      ? monthEntries.reduce((sum, e) => sum + e.mood, 0) / monthEntries.length
      : 0;
    return {
      count: monthEntries.length,
      avgMood: avgMood.toFixed(1),
    };
  }, [entries]);

  // Mood distribution (last 30 days)
  const moodDistribution = useMemo(() => {
    const monthAgo = subDays(new Date(), 30);
    const monthEntries = entries.filter((e) => isAfter(e.date, monthAgo));
    const distribution = [0, 0, 0, 0, 0];
    monthEntries.forEach((entry) => {
      distribution[entry.mood - 1]++;
    });
    return distribution;
  }, [entries]);

  // Most used tags
  const topTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [entries]);

  // Last 7 days mood trend
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayEntries = entries.filter(
        (e) => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
        : 0;
      days.push({
        date: format(date, 'EEE'),
        mood: avgMood,
        count: dayEntries.length,
      });
    }
    return days;
  }, [entries]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500 mt-1">Insights from your journaling journey</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="size-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">This Week</h2>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-slate-800">{weekStats.count}</p>
                <p className="text-sm text-slate-500">Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{weekStats.avgMood} / 5</p>
                <p className="text-sm text-slate-500">Average Mood</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="size-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Last 30 Days</h2>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-slate-800">{monthStats.count}</p>
                <p className="text-sm text-slate-500">Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{monthStats.avgMood} / 5</p>
                <p className="text-sm text-slate-500">Average Mood</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 7-Day Mood Trend */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="size-5 text-rose-600" />
            <h2 className="font-semibold text-slate-800">7-Day Mood Trend</h2>
          </div>
          <div className="space-y-3">
            {last7Days.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-12">{day.date}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                  {day.count > 0 && (
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(day.mood / 5) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {day.mood.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {day.count === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                      No entries
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mood Distribution */}
        <Card className="p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Mood Distribution (Last 30 Days)</h2>
          <div className="space-y-3">
            {moodDistribution.map((count, index) => {
              const mood = index + 1;
              const total = moodDistribution.reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{getMoodEmoji(mood)}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Tags */}
        {topTags.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="size-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Most Used Tags</h2>
            </div>
            <div className="space-y-2">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex justify-between items-center">
                  <span className="text-slate-700">{tag}</span>
                  <span className="text-sm font-medium text-slate-500">{count} entries</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card className="p-6 bg-slate-100 border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-3">Insights</h2>
          <ul className="space-y-2 text-slate-700">
            {weekStats.count > 0 && (
              <li>✨ You journaled {weekStats.count} {weekStats.count === 1 ? 'time' : 'times'} this week—great job!</li>
            )}
            {monthStats.count >= 15 && (
              <li>🔥 You're on a roll! {monthStats.count} entries this month.</li>
            )}
            {parseFloat(weekStats.avgMood) > 3.5 && (
              <li>😊 Your mood has been above average this week.</li>
            )}
            {entries.length >= 10 && (
              <li>🎯 You've created {entries.length} total entries. Keep reflecting!</li>
            )}
            {weekStats.count === 0 && (
              <li>💡 No entries this week yet. Take a moment to check in with yourself.</li>
            )}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
import { getSupabaseBrowserClient } from '@/lib/supabase';

type MoodEntryRow = {
  mood: string | null;
  created_at: string;
};

export type MoodTrendSummary = {
  totalEntries: number;
  mostCommonMood: string | null;
  moodCounts: Record<string, number>;
  last7Days: { date: string; count: number }[];
  thisWeek: {
    totalEntries: number;
    mostCommonMood: string | null;
    moodCounts: Record<string, number>;
  };
  thisMonth: {
    month: string;
    totalEntries: number;
    mostCommonMood: string | null;
    moodCounts: Record<string, number>;
  };
  last30DaysMoodCounts: Record<string, number>;
  monthlyMoodCounts: { month: string; moods: Record<string, number> }[];
};

async function getCurrentUserId() {
  // Mood trends should only use entries owned by the signed-in user.
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('You need to be logged in to view mood trends.');
  return user.id;
}

function normalizeMood(mood: string | null) {
  // Treat blank mood strings the same as no mood.
  const trimmed = mood?.trim();
  return trimmed ? trimmed : null;
}

function localDayKey(date: Date) {
  // Build a local YYYY-MM-DD key so calendar counts match the user's day.
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

function incrementCount(target: Record<string, number>, key: string) {
  target[key] = (target[key] ?? 0) + 1;
}

function getMostCommonMood(moodCounts: Record<string, number>) {
  // Walk the count map once and keep the mood with the highest count.
  let mostCommonMood: string | null = null;
  let maxCount = 0;

  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      mostCommonMood = mood;
      maxCount = count;
    }
  }

  return mostCommonMood;
}

export async function getMoodTrendSummary(): Promise<MoodTrendSummary> {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('journal_entries')
    .select('mood, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .returns<MoodEntryRow[]>();

  if (error) throw error;

  const rows = data ?? [];
  const moodCounts: Record<string, number> = {};
  const last30DaysMoodCounts: Record<string, number> = {};
  const monthlyBuckets: Record<string, Record<string, number>> = {};
  const thisWeekMoodCounts: Record<string, number> = {};
  const thisMonthMoodCounts: Record<string, number> = {};
  let thisWeekTotalEntries = 0;
  let thisMonthTotalEntries = 0;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // These date windows power the weekly, monthly, and 30-day summaries.
  const sevenDayStart = new Date(startOfToday);
  sevenDayStart.setDate(sevenDayStart.getDate() - 6);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thirtyDayStart = new Date(startOfToday);
  thirtyDayStart.setDate(thirtyDayStart.getDate() - 29);

  const last7DaysCountMap: Record<string, number> = {};
  // Start each day at zero so days without entries still appear in the UI.
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(sevenDayStart);
    day.setDate(sevenDayStart.getDate() + i);
    last7DaysCountMap[localDayKey(day)] = 0;
  }

  for (const row of rows) {
    const createdAtDate = new Date(row.created_at);
    const mood = normalizeMood(row.mood);
    const createdAtMs = createdAtDate.getTime();

    const isInThisWeek = createdAtDate >= sevenDayStart && createdAtDate <= now;
    const isInThisMonth = createdAtDate >= thisMonthStart && createdAtDate <= now;
    const createdDayKey = localDayKey(createdAtDate);
    if (createdDayKey in last7DaysCountMap) {
      last7DaysCountMap[createdDayKey] += 1;
    }
    if (isInThisWeek) {
      thisWeekTotalEntries += 1;
    }
    if (isInThisMonth) {
      thisMonthTotalEntries += 1;
    }

    if (!mood) continue;

    // Count the same mood in each summary bucket it belongs to.
    incrementCount(moodCounts, mood);
    if (isInThisWeek) {
      incrementCount(thisWeekMoodCounts, mood);
    }
    if (isInThisMonth) {
      incrementCount(thisMonthMoodCounts, mood);
    }

    if (createdAtMs >= thirtyDayStart.getTime() && createdAtMs <= now.getTime()) {
      incrementCount(last30DaysMoodCounts, mood);
    }

    const month = localMonthKey(createdAtDate);
    if (!monthlyBuckets[month]) {
      monthlyBuckets[month] = {};
    }
    // Monthly buckets let the dashboard compare recent months.
    incrementCount(monthlyBuckets[month], mood);
  }

  const mostCommonMood = getMostCommonMood(moodCounts);

  const last7Days = Object.entries(last7DaysCountMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const monthlyMoodCounts = Object.entries(monthlyBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, moods]) => ({ month, moods }));

  return {
    totalEntries: rows.length,
    mostCommonMood,
    moodCounts,
    last7Days,
    thisWeek: {
      totalEntries: thisWeekTotalEntries,
      mostCommonMood: getMostCommonMood(thisWeekMoodCounts),
      moodCounts: thisWeekMoodCounts,
    },
    thisMonth: {
      month: localMonthKey(now),
      totalEntries: thisMonthTotalEntries,
      mostCommonMood: getMostCommonMood(thisMonthMoodCounts),
      moodCounts: thisMonthMoodCounts,
    },
    last30DaysMoodCounts,
    monthlyMoodCounts,
  };
}

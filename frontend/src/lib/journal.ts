import { getSupabaseBrowserClient } from '@/lib/supabase';

type JournalEntryRow = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
};

export interface JournalEntry {
  id: string;
  title: string;
  text: string;
  mood?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateJournalEntryInput {
  title?: string;
  text: string;
  mood?: string;
}

interface UpdateJournalEntryInput {
  title?: string;
  content: string;
  mood?: string;
}

function mapRowToEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    title: row.title?.trim() || 'Untitled Entry',
    text: row.content,
    mood: row.mood || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getCurrentUserId() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('You need to be logged in to access journal entries.');
  return user.id;
}

export async function createJournalEntry(input: CreateJournalEntryInput) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  const trimmedTitle = input.title?.trim() || null;

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      title: trimmedTitle,
      content: input.text.trim(),
      mood: input.mood ?? null,
    })
    .select('id, user_id, title, content, mood, created_at, updated_at')
    .single<JournalEntryRow>();

  if (error) throw error;
  return mapRowToEntry(data);
}

export async function getJournalEntries(limit?: number) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  let query = supabase
    .from('journal_entries')
    .select('id, user_id, title, content, mood, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const { data, error } = await query.returns<JournalEntryRow[]>();

  if (error) throw error;
  return (data ?? []).map(mapRowToEntry);
}

export async function getJournalEntryById(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, user_id, title, content, mood, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle<JournalEntryRow>();

  if (error) throw error;
  if (!data) return null;
  return mapRowToEntry(data);
}

export async function deleteJournalEntry(id: string) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function updateJournalEntry(id: string, input: UpdateJournalEntryInput) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  const trimmedTitle = input.title?.trim() || null;

  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      title: trimmedTitle,
      content: input.content.trim(),
      mood: input.mood ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, user_id, title, content, mood, created_at, updated_at')
    .single<JournalEntryRow>();

  if (error) throw error;
  return mapRowToEntry(data);
}

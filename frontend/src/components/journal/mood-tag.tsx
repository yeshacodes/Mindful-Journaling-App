import { cn } from '@/lib/cn';

const moodStyles: Record<string, string> = {
  Calm: 'bg-[#e7efe9] text-[#41584b] border border-[#d6e3d8]',
  Happy: 'bg-[#f3eddc] text-[#6e613e] border border-[#e7dec4]',
  Anxious: 'bg-[#f3e5de] text-[#6f4f45] border border-[#e6d3ca]',
  Sad: 'bg-[#e8edf2] text-[#4b5f74] border border-[#d9e2ea]',
  Grateful: 'bg-[#efe8df] text-[#5f5649] border border-[#e1d6ca]',
};

interface MoodTagProps {
  mood: string;
  className?: string;
}

export function MoodTag({ mood, className }: MoodTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        moodStyles[mood] ?? 'bg-[var(--color-surface-strong)] text-[var(--color-muted)]',
        className
      )}
    >
      {mood}
    </span>
  );
}

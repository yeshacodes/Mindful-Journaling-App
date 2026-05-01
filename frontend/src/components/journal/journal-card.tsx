import { Card } from '@/components/ui/card';
import { MoodTag } from '@/components/journal/mood-tag';
import { cn } from '@/lib/cn';

interface JournalCardProps {
  title: string;
  text: string;
  date: string;
  mood?: string;
  tags?: string[];
  onClick?: () => void;
  compact?: boolean;
}

export function JournalCard({
  title,
  text,
  date,
  mood,
  tags,
  onClick,
  compact = false,
}: JournalCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        // The same card works as a static preview or a clickable navigation item.
        'group p-5 transition-all duration-200',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_20px_55px_-32px_rgba(49,66,58,0.45)]',
        compact ? 'space-y-3' : 'space-y-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-1 text-base font-semibold text-[var(--color-text)]">{title}</h3>
        {mood && <MoodTag mood={mood} />}
      </div>

      <p className={cn('text-[var(--color-muted)]', compact ? 'line-clamp-2 text-sm' : 'line-clamp-3 text-sm leading-relaxed')}>
        {text}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{date}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {/* Show only a few tags so compact cards stay easy to scan. */}
            {tags.slice(0, compact ? 2 : 3).map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--color-surface-strong)] px-2.5 py-1 text-[11px] text-[var(--color-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

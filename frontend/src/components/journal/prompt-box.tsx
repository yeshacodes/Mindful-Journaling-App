import { Card } from '@/components/ui/card';

interface PromptBoxProps {
  title?: string;
  prompt: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function PromptBox({
  title = 'AI suggestion',
  prompt,
  actionLabel,
  onAction,
  className,
}: PromptBoxProps) {
  return (
    <Card className={`border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-4 ${className ?? ''}`}>
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">{title}</p>
      <p className="mt-2 font-serif text-base leading-relaxed text-[var(--color-text)]">{prompt}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          {actionLabel ?? 'Use this prompt'}
        </button>
      )}
    </Card>
  );
}

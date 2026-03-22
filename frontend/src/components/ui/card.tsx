import { cn } from '@/lib/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_8px_24px_-20px_rgba(43,43,43,0.24)]',
        className
      )}
      {...props}
    />
  );
}

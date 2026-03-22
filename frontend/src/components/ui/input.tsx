import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full rounded-2xl border border-[var(--color-border)] bg-white/85 px-4 py-2.5 text-sm text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]',
          className
        )}
        {...props}
      />
    </div>
  );
}

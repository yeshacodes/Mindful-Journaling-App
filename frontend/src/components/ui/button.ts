import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonClassOptions = {}) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60',
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-6 py-2.5 text-sm',
    size === 'lg' && 'px-8 py-3 text-sm tracking-wide',
    fullWidth && 'w-full',
    variant === 'primary' && 'bg-[var(--color-accent)] text-white shadow-sm hover:bg-[var(--color-accent-strong)]',
    variant === 'secondary' && 'border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-surface-strong)]',
    variant === 'ghost' && 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-strong)]'
  );
}

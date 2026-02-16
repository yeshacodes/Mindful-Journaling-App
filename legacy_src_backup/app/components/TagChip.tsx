import { X } from 'lucide-react';

interface TagChipProps {
  tag: string;
  onRemove?: () => void;
}

export function TagChip({ tag, onRemove }: TagChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${tag} tag`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
interface MoodPickerProps {
  value: number;
  onChange: (mood: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const moodEmojis = ['😞', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];

export function MoodPicker({ value, onChange, size = 'md' }: MoodPickerProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex gap-3 items-center">
      {moodEmojis.map((emoji, index) => {
        const mood = index + 1;
        const isSelected = mood === value;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={`${sizeClasses[size]} transition-all hover:scale-110 ${
              isSelected ? 'scale-110 drop-shadow-lg' : 'opacity-50 hover:opacity-100'
            }`}
            title={moodLabels[index]}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

export function getMoodEmoji(mood: number): string {
  return moodEmojis[mood - 1] || '😐';
}

export function getMoodLabel(mood: number): string {
  return moodLabels[mood - 1] || 'Neutral';
}

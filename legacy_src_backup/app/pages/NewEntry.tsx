import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { MoodPicker } from '../components/MoodPicker';
import { TagInput } from '../components/TagInput';
import { Toast } from '../components/Toast';
import { useEntries } from '../../lib/EntriesContext';
import { mockPrompts } from '../../lib/mockData';
import { Sparkles, X } from 'lucide-react';

export function NewEntry() {
  const navigate = useNavigate();
  const { addEntry } = useEntries();
  const [prompt, setPrompt] = useState(mockPrompts[0]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * mockPrompts.length);
    setPrompt(mockPrompts[randomIndex]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    addEntry({
      date: new Date(),
      mood,
      tags,
      prompt,
      content: content.trim(),
    });

    setShowToast(true);
    setTimeout(() => {
      navigate('/entries');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">New Entry</h1>
          <p className="text-slate-500 mt-1">Take a moment to reflect</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Card */}
          <Card className="p-6 bg-slate-100 border-slate-200">
            <div className="flex items-start gap-3">
              <Sparkles className="size-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-slate-600 mb-2">
                  Today's Prompt
                </h2>
                <p className="text-slate-800 text-lg italic">"{prompt}"</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generatePrompt}
              >
                Regenerate
              </Button>
            </div>
          </Card>

          {/* Journal Content */}
          <Card className="p-6">
            <label className="block mb-2 font-medium text-slate-700">
              Your Thoughts
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely... there's no right or wrong way to journal."
              className="min-h-[300px] resize-none"
              required
            />
            <p className="text-sm text-slate-500 mt-2">
              {content.length} characters
            </p>
          </Card>

          {/* Mood Selector */}
          <Card className="p-6">
            <label className="block mb-3 font-medium text-slate-700">
              How are you feeling?
            </label>
            <MoodPicker value={mood} onChange={setMood} size="lg" />
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <label className="block mb-3 font-medium text-slate-700">
              Tags (Optional)
            </label>
            <TagInput tags={tags} onChange={setTags} />
            <p className="text-sm text-slate-500 mt-2">
              Add tags to organize and find entries later
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" size="lg">
              Save Entry
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
            >
              <X className="size-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {showToast && (
        <Toast message="Entry saved!" onClose={() => setShowToast(false)} />
      )}
    </AppLayout>
  );
}
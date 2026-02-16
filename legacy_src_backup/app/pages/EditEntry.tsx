import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { MoodPicker } from '../components/MoodPicker';
import { TagInput } from '../components/TagInput';
import { Toast } from '../components/Toast';
import { useEntries } from '../../lib/EntriesContext';
import { ArrowLeft, X } from 'lucide-react';

export function EditEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, updateEntry } = useEntries();
  const entry = id ? getEntry(id) : undefined;

  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (entry) {
      setContent(entry.content);
      setMood(entry.mood);
      setTags(entry.tags);
    }
  }, [entry]);

  if (!entry) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-6">
          <Card className="p-12 text-center">
            <p className="text-slate-500 mb-4">Entry not found</p>
            <Link to="/entries">
              <Button>Back to Entries</Button>
            </Link>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !id) {
      return;
    }

    updateEntry(id, {
      content: content.trim(),
      mood,
      tags,
    });

    setShowToast(true);
    setTimeout(() => {
      navigate(`/entries/${id}`);
    }, 1500);
  };

  const handleCancel = () => {
    navigate(`/entries/${id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <Link to={`/entries/${id}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Entry
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Edit Entry</h1>
          <p className="text-slate-500 mt-1">Update your reflection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Journal Content */}
          <Card className="p-6">
            <label className="block mb-2 font-medium text-slate-700">
              Your Thoughts
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely..."
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
              Tags
            </label>
            <TagInput tags={tags} onChange={setTags} />
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" size="lg">
              Save Changes
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
        <Toast message="Entry updated!" onClose={() => setShowToast(false)} />
      )}
    </AppLayout>
  );
}

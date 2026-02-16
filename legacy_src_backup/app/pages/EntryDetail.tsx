import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { TagChip } from '../components/TagChip';
import { Toast } from '../components/Toast';
import { getMoodEmoji, getMoodLabel } from '../components/MoodPicker';
import { useEntries } from '../../lib/EntriesContext';
import { ArrowLeft, Edit, Trash2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export function EntryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEntry, deleteEntry } = useEntries();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const entry = id ? getEntry(id) : undefined;

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

  const handleDelete = () => {
    if (id) {
      deleteEntry(id);
      setShowDeleteDialog(false);
      setShowToast(true);
      setTimeout(() => {
        navigate('/entries');
      }, 1500);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link to="/entries">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Entries
            </Button>
          </Link>
          <div className="flex justify-between items-start gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Journal Entry</h1>
              <p className="text-slate-500 mt-1">
                {format(entry.date, 'EEEE, MMMM d, yyyy • h:mm a')}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/entries/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <Card className="p-6 mb-6 bg-slate-100 border-slate-200">
          <div className="flex items-start gap-3">
            <Sparkles className="size-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-slate-600 mb-2">Prompt</h2>
              <p className="text-slate-800 text-lg italic">"{entry.prompt}"</p>
            </div>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6 mb-6">
          <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </p>
        </Card>

        {/* Mood and Tags */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Mood</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>
              <div>
                <p className="font-medium text-slate-800">{getMoodLabel(entry.mood)}</p>
                <p className="text-sm text-slate-500">{entry.mood} / 5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Tags</h3>
            {entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No tags</p>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showToast && (
        <Toast message="Entry deleted" onClose={() => setShowToast(false)} />
      )}
    </AppLayout>
  );
}
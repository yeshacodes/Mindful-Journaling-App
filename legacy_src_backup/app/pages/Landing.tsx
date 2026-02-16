import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { BookHeart, Sparkles, TrendingUp } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookHeart className="size-8 text-blue-600" />
          <span className="text-2xl font-semibold text-slate-800">Mindful</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button>Create Account</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
          Your Daily Moment<br />of Mindful Reflection
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          A simple, calm space for micro-journaling. Capture your thoughts,
          track your mood, and build a mindfulness practice—one small entry at a time.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="size-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              1. Get a Prompt
            </h3>
            <p className="text-slate-600">
              Receive a thoughtful daily prompt designed to guide your reflection
              and encourage mindfulness.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookHeart className="size-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              2. Write Freely
            </h3>
            <p className="text-slate-600">
              Journal your thoughts in a calm, distraction-free space. Add your mood
              and tags to track patterns.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="size-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              3. Track Progress
            </h3>
            <p className="text-slate-600">
              Review your entries, visualize mood trends, and gain insights
              into your emotional journey.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 Mindful. A space for reflection and growth.
        </div>
      </footer>
    </div>
  );
}
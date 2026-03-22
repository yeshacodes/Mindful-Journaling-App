'use client';

import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="app-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl mix-blend-multiply filter" style={{ backgroundColor: 'var(--color-surface-strong)' }} />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl mix-blend-multiply filter" style={{ backgroundColor: '#ddc8b7' }} />
      </div>

      <div className="z-10 w-full max-w-3xl mx-auto text-center space-y-12">

        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-light leading-tight tracking-tight">
            Capture your thoughts, <br className="hidden md:block" />
            <span className="italic text-[var(--color-muted)]">one moment at a time.</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-[var(--color-muted)] md:text-xl">
            A quiet space to reflect, write, and grow.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up delay-100">
          <Link
            href="/signup"
            className={buttonClasses({ variant: 'primary', size: 'lg' })}
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className={buttonClasses({ variant: 'secondary', size: 'lg' })}
          >
            Log in
          </Link>
        </div>

        {/* Features / Phrases */}
        <div className="pt-16 max-w-2xl mx-auto animate-fade-in-up delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-muted)] transition-colors">Write freely</p>
              <div className="mx-auto h-px w-8 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-16" />
            </div>
            <div className="group">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-muted)] transition-colors">Notice your moods</p>
              <div className="mx-auto h-px w-8 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-16" />
            </div>
            <div className="group">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--color-muted)] transition-colors">Reflect over time</p>
              <div className="mx-auto h-px w-8 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-16" />
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-100 {
            animation-delay: 0.1s;
        }
        .delay-200 {
            animation-delay: 0.2s;
        }
      `}</style>
    </main>
  );
}

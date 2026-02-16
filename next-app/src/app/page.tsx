'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-stone-50 text-stone-800 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stone-100 rounded-full blur-3xl mix-blend-multiply filter"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-200 rounded-full blur-3xl mix-blend-multiply filter"></div>
      </div>

      <div className="z-10 w-full max-w-3xl mx-auto text-center space-y-12">

        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-stone-800 leading-tight tracking-tight">
            Capture your thoughts, <br className="hidden md:block" />
            <span className="italic text-stone-600">one moment at a time.</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-500 max-w-xl mx-auto font-light leading-relaxed">
            A quiet space to reflect, write, and grow.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up delay-100">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-full bg-stone-800 text-stone-50 hover:bg-stone-700 transition-all text-sm font-medium tracking-wide min-w-[160px]"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full border border-stone-300 text-stone-600 hover:border-stone-400 hover:bg-white transition-all text-sm font-medium tracking-wide min-w-[160px]"
          >
            Log in
          </Link>
        </div>

        {/* Features / Phrases */}
        <div className="pt-16 max-w-2xl mx-auto animate-fade-in-up delay-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium mb-2 group-hover:text-stone-600 transition-colors">Write freely</p>
              <div className="h-px w-8 bg-stone-300 mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
            <div className="group">
              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium mb-2 group-hover:text-stone-600 transition-colors">Notice your moods</p>
              <div className="h-px w-8 bg-stone-300 mx-auto group-hover:w-16 transition-all duration-500"></div>
            </div>
            <div className="group">
              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium mb-2 group-hover:text-stone-600 transition-colors">Reflect over time</p>
              <div className="h-px w-8 bg-stone-300 mx-auto group-hover:w-16 transition-all duration-500"></div>
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

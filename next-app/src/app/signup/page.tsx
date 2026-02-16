'use client';

import Link from 'next/link';

export default function SignupPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-stone-50 text-stone-800">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-serif font-medium tracking-tight text-stone-900 hover:text-stone-700 transition-colors">
                        Mindful
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        Start your mindful journey today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 px-3 bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 px-3 bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6 px-3 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Link
                            href="/dashboard"
                            className="flex w-full justify-center rounded-md bg-stone-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-stone-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold leading-6 text-stone-600 hover:text-stone-500">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}

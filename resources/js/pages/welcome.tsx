import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to Notes App">
                <meta
                    name="description"
                    content="Your ultimate note-taking companion. Organize your thoughts, boost productivity, and never forget an idea."
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6 dark:bg-gray-900">
                {/* Navigation Bar */}
                <header className="fixed top-0 z-10 mx-auto flex w-full max-w-7xl items-center justify-between bg-white px-6 py-4 shadow-md dark:bg-gray-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">Notes App</div>
                    <nav className="space-x-4">
                        {auth.user ? (
                            <Link href={route('notes.index')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                Your Notes
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="mt-16 max-w-4xl px-6 py-20 text-center">
                    <h1 className="mb-4 text-5xl leading-tight font-extrabold text-gray-900 dark:text-white">
                        Capture Your Ideas, Organize Your Life
                    </h1>
                    <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
                        Your ultimate note-taking companion. Organize your thoughts, boost productivity, and never forget an idea.
                    </p>
                    <Link
                        href={route('register')}
                        className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:bg-green-700"
                    >
                        Get Started for Free
                    </Link>
                </section>

                {/* Features Section (USPs) */}
                <section className="w-full max-w-7xl px-6 py-20">
                    <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900 dark:text-white">Why Choose Notes App?</h2>
                    <div className="grid gap-10 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Effortless Organization</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Keep your notes categorized, tagged, and in dedicated workspaces for ultimate clarity.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Secure & Private</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Your notes are personal. We ensure they remain secure and accessible only by you.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Access Anywhere</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Sync your notes across all your devices and access them whenever inspiration strikes.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

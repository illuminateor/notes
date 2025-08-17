import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Create Note',
        href: '/notes/create',
    },
];

export default function CreateNote() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/notes');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Note" />
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Create Note</h2>
                <Link href="/notes" className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                    Back to Notes
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                    <label className="mb-1 block font-medium dark:text-white" htmlFor="title">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />
                    {errors.title && <div className="mt-1 text-sm text-red-500">{errors.title}</div>}
                </div>
                <div>
                    <label className="mb-1 block font-medium dark:text-white" htmlFor="content">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        rows={6}
                        required
                    />
                    {errors.content && <div className="mt-1 text-sm text-red-500">{errors.content}</div>}
                </div>
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={processing}>
                    Create
                </button>
            </form>
        </AppLayout>
    );
}

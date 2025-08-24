import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import _debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type Note = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    } | null;
    tags?: {
        id: number;
        name: string;
    }[];
    workspace?: {
        id: number;
        name: string;
    };
};

interface Props {
    notes: Note[];
    search?: string;
}

type PageProps = {
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    workspaces: { id: number; name: string }[];
};

interface TimestampConverterProps {
    timestamp: string;
}

function TimestampConverter({ timestamp }: TimestampConverterProps) {
    const date = new Date(timestamp);
    return <span>{format(date, 'PPpp')}</span>;
}

export default function NotesIndex({ notes, search = '' }: Props) {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState(search ?? '');
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category') ?? '';
    const tagId = params.get('tag') ?? '';
    const workspaceId = params.get('workspace') ?? '';
    const { categories, tags, workspaces } = usePage<PageProps>().props;
    const category = categories.find((cat: { id: number }) => cat.id === Number(categoryId));
    const tag = tags.find((tag: { id: number }) => tag.id === Number(tagId));
    const workspace = workspaces.find((workspace: { id: number }) => workspace.id === Number(workspaceId));

    useEffect(() => {
        if (typeof props.success === 'string' && props.success) {
            toast(props.success);
        }
    }, [props.success]);

    const debouncedSearch = useMemo(
        () =>
            _debounce((value) => {
                router.get('/notes', { search: value }, { preserveState: true, replace: true });
            }, 500),
        [],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    let title = 'All Notes';

    if (category) {
        title = `Category: ${category.name}`;
    }
    if (tag) {
        title = `Tag: ${tag.name}`;
    }
    if (workspace) {
        title = `Workspace: ${workspace.name}`;
    }
    if (searchTerm) {
        title = `Search results for "${searchTerm}"`;
    }

    return (
        <AppLayout>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search notes on title, workspace, category or tags"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
            </div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">{title}</h2>
                <Link href="/notes/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Add Note
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                    <Card
                        key={note.id}
                        className="group cursor-pointer transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Link href={`/notes/${note.id}/edit`} className="block p-4">
                            <CardContent className="flex h-full flex-col p-0">
                                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white">
                                    {note.title}
                                </h3>
                                <div className="mt-2 flex-grow space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">Workspace:</span> {note.workspace?.name ?? '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Category:</span> {note.category?.name ?? '—'}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="font-medium">Tags:</span>
                                        {(note?.tags &&
                                            note?.tags.map((tag: { name: string }, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))) ||
                                            '—'}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700">
                                    <div>
                                        Created: <TimestampConverter timestamp={note.created_at} />
                                    </div>
                                    <div>
                                        Updated: <TimestampConverter timestamp={note.updated_at} />
                                    </div>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
            {notes.length === 0 && <p className="mt-8 text-center text-gray-500">No notes found.</p>}
        </AppLayout>
    );
}

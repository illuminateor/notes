import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

type Note = {
    id: number;
    title: string;
    content: string;
    category?: {
        id: number;
        name: string;
    } | null;
    tags?: {
        id: number;
        name: string;
    }[];
};

interface Props {
    notes: Note[];
}

export default function NotesIndex({ notes }: Props) {
    const { props } = usePage();

    useEffect(() => {
        if (typeof props.success === 'string' && props.success) {
            toast(props.success);
        }
    }, [props.success]);

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this note?')) {
            router.delete(`/notes/${id}`);
        }
    }

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">All Notes</h2>
                <Link href="/notes/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Add Note
                </Link>
            </div>
            <ul>
                {notes.map((note) => (
                    <li key={note.id} className="mb-4 border-b pb-4">
                        <div className="font-semibold">{note.title}</div>
                        <div className="text-gray-300">Category: {note.category?.name}</div>
                        <div className="text-gray-300">Tags: {note?.tags && note?.tags.map((tag: { name: string }) => tag.name).join(', ')}</div>
                        <div className="mt-2 flex gap-2">
                            <Link href={`/notes/${note.id}/edit`} className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                                View
                            </Link>
                            <button onClick={() => handleDelete(note.id)} className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </AppLayout>
    );
}

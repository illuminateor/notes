import { Head } from '@inertiajs/react';

type Note = {
    id: number;
    title: string;
    content: string;
    category?: {
        id: number;
        name: string;
    };
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
    note: Note;
}

export default function ShowSharedNote({ note }: Props) {
    return (
        <>
            <Head title={note.title} />
            <div className="mx-auto max-w-4xl p-6">
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">{note.title}</h1>
                {note.category && (
                    <span className="mr-2 mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {note.category.name}
                    </span>
                )}
                {note.tags &&
                    note.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="mr-2 mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                            {tag.name}
                        </span>
                    ))}
                {note.workspace && (
                    <span className="mb-4 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {note.workspace.name}
                    </span>
                )}
                <div className="prose dark:prose-invert mt-6" dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
        </>
    );
}

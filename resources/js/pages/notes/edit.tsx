import { MultiSelect } from '@/components/multiselect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type PageProps = {
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
    workspaces: { id: number; name: string }[];
};

export default function EditNote({ note }: Props) {
    const { categories, tags, workspaces } = usePage<PageProps>().props;

    const [options, setOptions] = useState<string[]>(categories.map((cat) => cat.name));
    const [filtered, setFiltered] = useState<string[]>(options);
    const { data, setData, put, processing, errors } = useForm({
        title: note.title,
        content: note.content,
        category: note.category ? note.category.name : '',
        selectedTags: note.tags ? note.tags.map((tag) => ({ value: tag.name, label: tag.name })) : [],
        workspace_id: note.workspace ? note.workspace.id.toString() : '',
    });

    useEffect(() => {
        if (data.category) {
            setFiltered(options.filter((opt) => opt.toLowerCase().includes(data.category.toLowerCase())));
        } else {
            setFiltered(options);
        }
    }, [data.category, options]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: data.content,
        onUpdate({ editor }) {
            setData('content', editor.getHTML());
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setData('content', editor?.getHTML() || '');
        put(`/notes/${note.id}`);
    }

    const handleSelect = (value: string) => {
        setData('category', value);
        setFiltered([]);
    };

    const handleAdd = () => {
        if (data.category && !options.includes(data.category)) {
            setOptions((prev) => [...prev, data.category]);
            setFiltered([]);
        }
    };

    const handleClear = () => {
        setData('category', '');
        setFiltered(options);
    };

    const handleSetSelected = (selected: { value: string; label: string }[]) => {
        setData('selectedTags', selected);
    };

    function handleDelete() {
        if (confirm('Are you sure you want to delete this note?')) {
            router.delete(`/notes/${note.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Note" />
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Edit Note</h2>
                <div className="flex gap-2">
                    <Link href="/notes" className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                        Back to Notes
                    </Link>
                    <button onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Delete Note
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex h-[calc(100vh-10rem)] gap-4">
                <div className="flex w-2/3 flex-col space-y-4">
                    <div>
                        <label className="mb-1 block font-medium dark:text-white" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <div className="mt-1 text-sm text-red-500">{errors.title}</div>}
                    </div>
                    <div className="flex flex-grow flex-col">
                        <label className="mb-1 block font-medium dark:text-white" htmlFor="content">
                            Content
                        </label>
                        <div className="flex-grow rounded-md border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Toolbar with icons */}
                            <div className="mb-2 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    title="Bold"
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={
                                        editor?.isActive('bold')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Bold SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <text x="4" y="17" fontWeight="bold" fontSize="16" fill="currentColor">
                                            B
                                        </text>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Italic"
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={
                                        editor?.isActive('italic')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Italic SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <text x="4" y="17" fontStyle="italic" fontSize="16" fill="currentColor">
                                            I
                                        </text>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Strike"
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    className={
                                        editor?.isActive('strike')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Strike SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <text x="4" y="17" fontSize="16" fill="currentColor">
                                            S
                                        </text>
                                        <line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Code"
                                    onClick={() => editor?.chain().focus().toggleCode().run()}
                                    className={
                                        editor?.isActive('code')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Code SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <polyline points="7 8 3 12 7 16" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <polyline points="17 8 21 12 17 16" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <line x1="10" y1="19" x2="14" y2="5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Blockquote"
                                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                    className={
                                        editor?.isActive('blockquote')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Blockquote SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <rect x="3" y="7" width="6" height="10" rx="2" fill="currentColor" opacity="0.2" />
                                        <rect x="15" y="7" width="6" height="10" rx="2" fill="currentColor" opacity="0.2" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Task List"
                                    onClick={() => editor?.chain().focus().toggleTaskList().run()}
                                    className={
                                        editor?.isActive('taskList')
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Task List SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <rect x="4" y="6" width="16" height="2" fill="currentColor" />
                                        <rect x="4" y="11" width="16" height="2" fill="currentColor" />
                                        <rect x="4" y="16" width="16" height="2" fill="currentColor" />
                                        <rect x="2" y="6" width="2" height="2" fill="currentColor" />
                                        <rect x="2" y="11" width="2" height="2" fill="currentColor" />
                                        <rect x="2" y="16" width="2" height="2" fill="currentColor" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="New Task"
                                    onClick={() => editor?.chain().focus().splitListItem('taskItem').run()}
                                    className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    {/* New Task SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Heading"
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                    className={
                                        editor?.isActive('heading', { level: 1 })
                                            ? 'rounded-md bg-blue-600 px-2 py-1 text-white shadow-sm dark:bg-blue-700'
                                            : 'rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }
                                >
                                    {/* Heading SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <text x="2" y="17" fontSize="16" fontWeight="bold" fill="currentColor">
                                            H1
                                        </text>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Horizontal Rule"
                                    onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                                    className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    {/* Horizontal Rule SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Undo"
                                    onClick={() => editor?.chain().focus().undo().run()}
                                    className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    {/* Undo SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path d="M9 7L4 12L9 17" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <path d="M20 12H5" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    title="Redo"
                                    onClick={() => editor?.chain().focus().redo().run()}
                                    className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                >
                                    {/* Redo SVG */}
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path d="M15 7L20 12L15 17" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <path d="M4 12H19" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </button>
                            </div>
                            <EditorContent editor={editor} className="prose dark:prose-invert max-w-none focus:outline-none" />
                            {errors.content && <div className="mt-1 text-sm text-red-500">{errors.content}</div>}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:focus:ring-offset-gray-900"
                        disabled={processing}
                    >
                        Update Note
                    </Button>
                </div>
                <div className="w-1/3 space-y-4">
                    <div>
                        <label className="mb-1 block font-medium dark:text-white" htmlFor="workspace">
                            Workspace
                        </label>
                        <select
                            id="workspace"
                            name="workspace"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={data.workspace_id}
                            onChange={(e) => setData('workspace_id', e.target.value)}
                        >
                            <option value="">Select a Workspace</option>
                            {workspaces.map((workspace) => (
                                <option key={workspace.id} value={workspace.id}>
                                    {workspace.name}
                                </option>
                            ))}
                        </select>
                        {errors.workspace_id && <div className="mt-1 text-sm text-red-500">{errors.workspace_id}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block font-medium dark:text-white" htmlFor="category">
                            Category
                        </label>
                        <Card className="p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardContent className="flex flex-col gap-2 p-0">
                                <div className="relative">
                                    <Input
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Type to search or add..."
                                        className="rounded-md border border-gray-300 bg-white pr-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                    />
                                    {data.category && (
                                        <button
                                            onClick={handleClear}
                                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            type="button"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>

                                {/* Suggestion List */}
                                {filtered.length > 0 && note?.category?.name !== data.category && (
                                    <div className="max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-700">
                                        {filtered.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSelect(item)}
                                                className="cursor-pointer p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add Button if not exists */}
                                {data.category && !options.includes(data.category) && (
                                    <Button onClick={handleAdd} className="mt-2 dark:bg-blue-600 dark:hover:bg-blue-500" type="button">
                                        ➕ Add "{data.category}"
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                        {errors.category && <div className="mt-1 text-sm text-red-500">{errors.category}</div>}
                    </div>
                    <div>
                        <label className="mb-1 block font-medium dark:text-white" htmlFor="tags">
                            Tags
                        </label>
                        <Card className="p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardContent className="p-0">
                                <MultiSelect
                                    options={tags.map((tag) => ({ value: tag.id.toString(), label: tag.name }))}
                                    selected={data.selectedTags}
                                    onChange={handleSetSelected}
                                />
                            </CardContent>
                        </Card>
                        {errors.selectedTags && <div className="mt-1 text-sm text-red-500">{errors.selectedTags}</div>}
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Category;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Tag;
use App\Models\Workspace;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request('search');
        $category = request('category');
        $tag = request('tag');
        $workspace = request('workspace');
        $notesQuery = Note::query();

        if ($search) {
            $notesQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('tags', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('workspace', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($category) {
            $notesQuery->whereHas('category', function ($q) use ($category) {
                $q->where('id', $category);
            });
        }

        if ($tag) {
            $notesQuery->whereHas('tags', function ($q) use ($tag) {
                $q->where('tags.id', $tag);
            });
        }

        if ($workspace) {
            $notesQuery->whereHas('workspace', function ($q) use ($workspace) {
                $q->where('id', $workspace);
            });
        }

        $notes = $notesQuery->orderBy('updated_at', 'desc')->get();

        return inertia('notes/index', [
            'notes' => $notes->load('category')->load('tags')->load('workspace'),
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('notes/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNoteRequest $request)
    {
        $data = $request->validated();
        if (!empty($data['category'])) {
            $category = Category::firstOrCreate(['name' => $data['category']]);
            $data['category_id'] = $category->id;
        } else {
            $data['category_id'] = null;
        }
        unset($data['category']);

        // Assign workspace_id
        $data['workspace_id'] = $request->workspace_id;

        // Process tags
        $tags = [];
        if (!empty($data['selectedTags']) && is_array($data['selectedTags'])) {
            foreach ($data['selectedTags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName['label']]);
                $tags[] = $tag->id;
            }
        }
        unset($data['selectedTags']);

        $note = Note::create($data);

        // Attach tags to note
        if (!empty($tags)) {
            $note->tags()->sync($tags);
        }

        return redirect()->route('notes.index')->with('success', 'Note created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        return Inertia::render('notes/edit', [
            'note' => $note->load('category')->load('tags')->load('workspace'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        $data = $request->validated();
        if (!empty($data['category'])) {
            $category = Category::firstOrCreate(['name' => $data['category']]);
            $data['category_id'] = $category->id;
        } else {
            $data['category_id'] = null;
        }
        unset($data['category']);

        // Assign workspace_id
        $data['workspace_id'] = $request->workspace_id;

        // Process tags
        $tags = [];
        if (!empty($data['selectedTags']) && is_array($data['selectedTags'])) {
            foreach ($data['selectedTags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName['label']]);
                $tags[] = $tag->id;
            }
        }
        unset($data['selectedTags']);

        $note->update($data);

        // Sync tags to note
        if (!empty($tags)) {
            $note->tags()->sync($tags);
        } else {
            $note->tags()->detach();
        }

        return redirect()->route('notes.index')->with('success', 'Note updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        $note->delete();

        return redirect()->route('notes.index')->with('success', 'Note deleted successfully.');
    }
}

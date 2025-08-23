<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Category;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Tag;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = Note::all();
        return inertia('notes/index', [
            'notes' => $notes->load('category')->load('tags'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('notes/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
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

        // Process tags
        $tags = [];
        if (!empty($data['selectedTags']) && is_array($data['selectedTags'])) {
            foreach ($data['selectedTags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName['value']]);
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
        $categories = Category::all();
        $tags = Tag::all();
        return Inertia::render('notes/edit', [
            'note' => $note->load('category')->load('tags'),
            'categories' => $categories,
            'tags' => $tags,
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

<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Category;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Tag;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Str;

class NoteController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Note::class, 'note');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request('search');
        $category = request('category');
        $tag = request('tag');
        $workspace = request('workspace');
        $notesQuery = Auth::user()->notes();

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
            $category = Category::firstOrCreate(
                ['name' => $data['category'], 'user_id' => Auth::id()]
            );
            $data['category_id'] = $category->id;
        } else {
            $data['category_id'] = null;
        }
        unset($data['category']);

        // Assign workspace_id
        $data['workspace_id'] = $request->workspace_id;

        // Assign user_id
        $data['user_id'] = Auth::id();

        // Process tags
        $tags = [];
        if (!empty($data['selectedTags']) && is_array($data['selectedTags'])) {
            foreach ($data['selectedTags'] as $tagName) {
                $tag = Tag::firstOrCreate(
                    ['name' => $tagName['label'], 'user_id' => Auth::id()]
                );
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
        // The policy will handle authorization
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
            $category = Category::firstOrCreate(
                ['name' => $data['category'], 'user_id' => Auth::id()]
            );
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
                $tag = Tag::firstOrCreate(
                    ['name' => $tagName['label'], 'user_id' => Auth::id()]
                );
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

    public function share(Note $note)
    {
        if ($note->share_id) {
            return response()->json(['share_id' => $note->share_id]);
        }

        $shareId = Str::random(10);
        $note->update(['share_id' => $shareId]);

        return response()->json(['share_id' => $shareId]);
    }

    public function showShared(string $share_id)
    {
        $note = Note::where('share_id', $share_id)->firstOrFail();

        return Inertia::render('notes/show-shared', [
            'note' => $note->load('category')->load('tags')->load('workspace'),
        ]);
    }
}

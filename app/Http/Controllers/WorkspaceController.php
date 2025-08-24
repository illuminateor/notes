<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkspaceController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Workspace::class, 'workspace');
    }

    public function index()
    {
        $workspaces = Auth::user()->workspaces()->get();

        return inertia('dashboard', [
            'workspaces' => $workspaces,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Auth::user()->workspaces()->create(['name' => $request->name]);

        return Redirect::back()->with('success', 'Workspace created successfully.');
    }

    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return Redirect::back()->with('success', 'Workspace deleted successfully.');
    }
}

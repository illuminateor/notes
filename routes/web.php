<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('notes', App\Http\Controllers\NoteController::class);
    Route::post('/notes/{note}/share', [App\Http\Controllers\NoteController::class, 'share'])->name('notes.share');
    Route::post(uri: '/workspaces', action: [App\Http\Controllers\WorkspaceController::class, 'store'])->name('workspaces.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::get('/share/{share_id}', [App\Http\Controllers\NoteController::class, 'showShared'])->name('notes.share.show');

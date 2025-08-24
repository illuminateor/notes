<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use App\Models\Category;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = Category::factory(5)->create(['user_id' => $user->id]);
        $workspaces = Workspace::factory(3)->create(['user_id' => $user->id]);
        $tags = \App\Models\Tag::factory(10)->create(['user_id' => $user->id]);

        Note::factory(20)->create([
            'user_id' => $user->id,
            'category_id' => $categories->random()->id,
            'workspace_id' => $workspaces->random()->id,
        ])->each(function ($note) use ($tags) {
            $note->tags()->attach($tags->random(rand(1, 3))->pluck('id'));
        });
    }
}

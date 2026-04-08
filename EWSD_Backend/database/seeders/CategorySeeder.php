<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Research Papers',
                'description' => 'Academic and scholarly research works.',
                'type' => 'article',
            ],
            [
                'name' => 'Projects',
                'description' => 'Individual or group academic projects.',
                'type' => 'article',
            ],
            [
                'name' => 'Creative Writing',
                'description' => 'Poetry, stories, and creative written content.',
                'type' => 'article',
            ],
            [
                'name' => 'Reviews (Literature and Books)',
                'description' => 'Critical reviews of literature and books.',
                'type' => 'article',
            ],
            [
                'name' => 'Extracurriculars',
                'description' => 'Activities beyond academic curriculum.',
                'type' => 'article',
            ],
            [
                'name' => 'Campus Photography',
                'description' => 'Photography capturing campus life.',
                'type' => 'gallery',
            ],
            [
                'name' => 'Artistic Photography',
                'description' => 'Creative and artistic photography.',
                'type' => 'gallery',
            ],
            [
                'name' => 'Event Photography',
                'description' => 'Photos from events and functions.',
                'type' => 'gallery',
            ],
            [
                'name' => 'Experimental Images',
                'description' => 'Innovative and experimental visual works.',
                'type' => 'gallery',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']], // Find by name
                [ // Update or create with these values
                    'description' => $category['description'],
                    'type' => $category['type']
                ]
            );
        }

        $this->command->info('Categories seeded successfully with types!');
    }
}
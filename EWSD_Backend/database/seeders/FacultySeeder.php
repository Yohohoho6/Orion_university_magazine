<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

         public function run(): void
    {
        $faculties = [
            [
                'name' => 'Engineering',
                'description' => 'Engineering and technology related programs',
            ],
            [
                'name' => 'Business',
                'description' => 'Business, management, and finance studies',
            ],
            [
                'name' => 'Science',
                'description' => 'Pure and applied science programs',
            ],
            [
                'name' => 'Arts',
                'description' => 'Arts, humanities, and social sciences',
            ],
            [
                'name' => 'Computing',
                'description' => 'Computer science, IT, and software engineering',
            ],
        ];

        foreach ($faculties as $faculty) {
            Faculty::updateOrCreate(
                ['name' => $faculty['name']], // unique key
                ['description' => $faculty['description']]
            );
        }
    }
    }


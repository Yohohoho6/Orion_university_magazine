<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        AcademicYear::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $academicYears = [
            [
                'name' => 'Academic Year 2023-2024',
                'start_date' => Carbon::create(2023, 9, 1),
                'end_date' => Carbon::create(2024, 6, 30),  
                'closure_date' => Carbon::create(2024, 3, 15),
                'final_closure_date' => Carbon::create(2024, 3, 30),
                'is_active' => false, // Past academic year
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Academic Year 2024-2025',
                'start_date' => Carbon::create(2024, 9, 1), 
                'end_date' => Carbon::create(2025, 6, 30),  
                'closure_date' => Carbon::create(2025, 3, 14), 
                'final_closure_date' => Carbon::create(2025, 3, 28),
                'is_active' => false, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Academic Year 2025-2026',
                'start_date' => Carbon::create(2025, 9, 1), 
                'end_date' => Carbon::create(2026, 6, 30),  
                'closure_date' => Carbon::create(2026, 4, 30), 
                'final_closure_date' => Carbon::create(2026, 5, 30), 
                'is_active' => true, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($academicYears as $year) {
            AcademicYear::create($year);
        }

        $this->command->info('Successfully seeded 3 academic years!');
    }
}
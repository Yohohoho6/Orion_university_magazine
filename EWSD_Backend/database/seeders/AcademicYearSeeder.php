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
                'name' => 'Academic Year 2024',
                'start_date' => Carbon::create(2024, 1, 1),
                'end_date' => Carbon::create(2024, 12, 31),
                'closure_date' => Carbon::create(2024, 11, 30),
                'final_closure_date' => Carbon::create(2024, 12, 15),
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Academic Year 2025',
                'start_date' => Carbon::create(2025, 1, 1),
                'end_date' => Carbon::create(2025, 12, 31),
                'closure_date' => Carbon::create(2025, 11, 30),
                'final_closure_date' => Carbon::create(2025, 12, 15),
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Academic Year 2026',
                'start_date' => Carbon::create(2026, 1, 1),
                'end_date' => Carbon::create(2026, 12, 31),
                'closure_date' => Carbon::create(2026, 11, 30),
                'final_closure_date' => Carbon::create(2026, 12, 15),
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
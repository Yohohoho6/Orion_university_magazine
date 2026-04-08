<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    public function run(): void
        {
            $roles = [
                [
                    'name' => 'student',
                    'description' => 'Student user with standard access',
                ],
                [
                    'name' => 'admin',
                    'description' => 'Administrator with full system access',
                ],
                [
                    'name' => 'guest',
                    'description' => 'Guest user with limited access',
                ],
                [
                    'name' => 'marketing_manager',
                    'description' => 'Marketing Manager with approval and oversight permissions',
                ],
                [
                    'name' => 'marketing_coordinator',
                    'description' => 'Marketing Coordinator responsible for content and submissions',
                ],
            ];

            foreach ($roles as $role) {
                Role::updateOrCreate(
                    ['name' => $role['name']],   // unique condition
                    ['description' => $role['description']]
                );
            }
        }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@orioin.edu',
                'password' => 'password123',
                'role_id' => 2, // admin
                'faculty_id' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Manager',
                'email' => 'manager@orioin.edu',
                'password' => 'password123',
                'role_id' => 4, // marketing_manager
                'faculty_id' => null,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Coordinator1',
                'email' => 'coordinator.engineering@orioin.edu',
                'password' => 'password123',
                'role_id' => 5, // marketing_coordinator
                'faculty_id' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Coordinator2',
                'email' => 'coordinator.business@orioin.edu',
                'password' => 'password123',
                'role_id' => 5, // marketing_coordinator
                'faculty_id' => 2,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Coordinator3',
                'email' => 'coordinator.science@orioin.edu',
                'password' => 'password123',
                'role_id' => 5, // marketing_coordinator
                'faculty_id' => 3,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Coordinator4',
                'email' => 'coordinator.arts@orioin.edu',
                'password' => 'password123',
                'role_id' => 5, // marketing_coordinator
                'faculty_id' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'Marketing Coordinator5',
                'email' => 'coordinator.computing@orioin.edu',
                'password' => 'password123',
                'role_id' => 5, // marketing_coordinator
                'faculty_id' => 5,
                'status' => 'active',
            ],
            [
                'name' => 'Guest1',
                'email' => 'guest.engineering@orioin.edu',
                'password' => 'password123',
                'role_id' => 3, // guest
                'faculty_id' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'Guest2',
                'email' => 'guest.business@orioin.edu',
                'password' => 'password123',
                'role_id' => 3, // guest
                'faculty_id' =>2,
                'status' => 'active',
            ],
            [
                'name' => 'Guest3',
                'email' => 'guest.science@orioin.edu',
                'password' => 'password123',
                'role_id' => 3, // guest
                'faculty_id' => 3,
                'status' => 'active',
            ],
            [
                'name' => 'Guest4',
                'email' => 'guest.arts@orioin.edu',
                'password' => 'password123',
                'role_id' => 3, // guest
                'faculty_id' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'Guest5',
                'email' => 'guest.computing@orioin.edu',
                'password' => 'password123',
                'role_id' => 3, // guest
                'faculty_id' => 5,
                'status' => 'active',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                [
                    'email' => $user['email'],
                    'faculty_id' => $user['faculty_id']
                ],
                [
                    'name'              => $user['name'],
                    'password'          => Hash::make($user['password']),
                    'role_id'           => $user['role_id'],
                    'status'            => $user['status'],
                    'email_verified_at' => Carbon::now(),
                ]
            );
        }

    
    }
}

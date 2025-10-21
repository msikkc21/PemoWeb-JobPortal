<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyRole = \App\Models\Role::where('name', 'Company')->first();
        $companyUsers = \App\Models\User::where('role_id', $companyRole->id)->get();

        foreach ($companyUsers as $user) {
            \App\Models\Company::create([
                'user_id' => $user->id,
                'company_name' => fake()->company(),
                'industry' => fake()->randomElement(['Technology', 'Finance', 'Healthcare', 'Education', 'Retail']),
                'description' => fake()->paragraph(3),
                'location' => fake()->city(),
                'website' => fake()->url(),
                'company_email' => fake()->companyEmail(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'photo_path' => null,
                'employee_count' => fake()->numberBetween(10, 500),
                'founded_year' => fake()->numberBetween(1990, 2020),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

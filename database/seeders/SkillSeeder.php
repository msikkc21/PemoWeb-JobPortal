<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Skill::insert([
            ['name' => 'PHP', 'description' => 'PHP programming language', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Laravel', 'description' => 'Laravel framework', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'JavaScript', 'description' => 'JavaScript programming', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'React', 'description' => 'React library', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'MySQL', 'description' => 'MySQL database', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Git', 'description' => 'Version control', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Communication', 'description' => 'Effective communication skills', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeekerSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekers = \App\Models\JobSeeker::all();
        $skills = \App\Models\Skill::all();

        foreach ($jobSeekers as $jobSeeker) {
            $randomSkills = $skills->random(rand(3, 5));
            
            foreach ($randomSkills as $skill) {
                \App\Models\JobSeekerSkill::create([
                    'job_seeker_id' => $jobSeeker->id,
                    'skill_id' => $skill->id,
                    'level' => fake()->randomElement(['beginner', 'intermediate', 'expert']),
                    'experience_years' => rand(0, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

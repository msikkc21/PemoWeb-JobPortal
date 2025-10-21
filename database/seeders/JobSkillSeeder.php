<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = \App\Models\Job::all();
        $skills = \App\Models\Skill::all();

        foreach ($jobs as $job) {
            $randomSkills = $skills->random(rand(2, 4));
            
            foreach ($randomSkills as $skill) {
                \App\Models\JobSkill::create([
                    'job_id' => $job->id,
                    'skill_id' => $skill->id,
                ]);
            }
        }
    }
}

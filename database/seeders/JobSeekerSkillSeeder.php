<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobSeeker;
use App\Models\Skill;
use App\Models\JobSeekerSkill;

class JobSeekerSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobSeekers = JobSeeker::all();
        $skills = Skill::all();

        foreach ($jobSeekers as $index => $jobSeeker) {
            // Setiap job seeker punya 3-6 skills
            $skillCount = rand(3, 6);
            $selectedSkills = $skills->random($skillCount);

            foreach ($selectedSkills as $skill) {
                // Proficiency level distribution:
                // 20% beginner, 50% intermediate, 30% expert
                $rand = rand(1, 100);
                if ($rand <= 20) {
                    $level = 'beginner';
                    $yearsOfExperience = rand(0, 1);
                } elseif ($rand <= 70) {
                    $level = 'intermediate';
                    $yearsOfExperience = rand(1, 3);
                } else {
                    $level = 'expert';
                    $yearsOfExperience = rand(3, 8);
                }

                JobSeekerSkill::create([
                    'job_seeker_id' => $jobSeeker->id,
                    'skill_id' => $skill->id,
                    'level' => $level,
                    'experience_years' => $yearsOfExperience,
                    'created_at' => $jobSeeker->created_at,
                    'updated_at' => $jobSeeker->updated_at,
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\Skill;
use App\Models\JobSkill;

class JobSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = Job::all();
        $skills = Skill::all();

        // Mapping job title ke skills yang relevan
        $jobSkillMapping = [
            'Backend' => ['PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'REST API', 'Git', 'Docker'],
            'Frontend' => ['JavaScript', 'React', 'Vue.js', 'TypeScript', 'Next.js', 'Git', 'Figma'],
            'Full Stack' => ['PHP', 'Laravel', 'React', 'MySQL', 'REST API', 'Git', 'Docker', 'Node.js'],
            'Mobile' => ['Dart', 'Flutter', 'React Native', 'Kotlin', 'Git', 'REST API'],
            'UI/UX' => ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design'],
            'Product Manager' => ['Communication', 'Leadership', 'Project Management', 'Agile', 'Scrum'],
            'DevOps' => ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Git', 'CI/CD'],
            'Data Analyst' => ['Python', 'MySQL', 'PostgreSQL', 'Problem Solving'],
            'Quality Assurance' => ['TDD', 'Git', 'Problem Solving', 'Agile'],
            'Project Manager' => ['Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum'],
            'Digital Marketing' => ['Communication', 'Problem Solving', 'Team Work'],
            'Content Writer' => ['Communication', 'Problem Solving'],
            'Business Analyst' => ['Communication', 'Problem Solving', 'Project Management'],
            'System Administrator' => ['Git', 'Docker', 'AWS', 'MySQL'],
            'Database Administrator' => ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'Redis'],
        ];

        foreach ($jobs as $job) {
            $relevantSkills = [];
            
            // Cari skill yang relevan berdasarkan job title
            foreach ($jobSkillMapping as $keyword => $skillNames) {
                if (stripos($job->title, $keyword) !== false) {
                    $relevantSkills = $skillNames;
                    break;
                }
            }

            // Jika tidak ketemu mapping, ambil random
            if (empty($relevantSkills)) {
                $relevantSkills = $skills->random(rand(3, 6))->pluck('name')->toArray();
            }

            // Ambil skill objects
            $selectedSkills = $skills->whereIn('name', $relevantSkills);

            // Attach skills ke job
            foreach ($selectedSkills as $skill) {
                JobSkill::create([
                    'job_id' => $job->id,
                    'skill_id' => $skill->id,
                ]);
            }
        }
    }
}

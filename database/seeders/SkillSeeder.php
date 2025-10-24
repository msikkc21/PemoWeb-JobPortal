<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Programming Languages
            ['name' => 'PHP', 'description' => 'Server-side scripting language'],
            ['name' => 'JavaScript', 'description' => 'Programming language for web development'],
            ['name' => 'Python', 'description' => 'High-level programming language'],
            ['name' => 'Java', 'description' => 'Object-oriented programming language'],
            ['name' => 'TypeScript', 'description' => 'Typed superset of JavaScript'],
            ['name' => 'Dart', 'description' => 'Client-optimized language for apps'],
            ['name' => 'Go', 'description' => 'Statically typed compiled language'],
            ['name' => 'Kotlin', 'description' => 'Modern programming language for Android'],
            
            // Frameworks
            ['name' => 'Laravel', 'description' => 'PHP web application framework'],
            ['name' => 'React', 'description' => 'JavaScript library for building UIs'],
            ['name' => 'Vue.js', 'description' => 'Progressive JavaScript framework'],
            ['name' => 'Angular', 'description' => 'TypeScript-based web framework'],
            ['name' => 'Node.js', 'description' => 'JavaScript runtime built on Chrome V8'],
            ['name' => 'Express.js', 'description' => 'Web framework for Node.js'],
            ['name' => 'Django', 'description' => 'High-level Python web framework'],
            ['name' => 'Flutter', 'description' => 'UI toolkit for mobile apps'],
            ['name' => 'React Native', 'description' => 'Mobile app framework using React'],
            ['name' => 'Next.js', 'description' => 'React framework for production'],
            
            // Database
            ['name' => 'MySQL', 'description' => 'Open-source relational database'],
            ['name' => 'PostgreSQL', 'description' => 'Advanced open-source database'],
            ['name' => 'MongoDB', 'description' => 'NoSQL document database'],
            ['name' => 'Redis', 'description' => 'In-memory data structure store'],
            ['name' => 'Oracle', 'description' => 'Multi-model database management'],
            
            // DevOps & Tools
            ['name' => 'Docker', 'description' => 'Platform for containerization'],
            ['name' => 'Kubernetes', 'description' => 'Container orchestration system'],
            ['name' => 'Git', 'description' => 'Distributed version control system'],
            ['name' => 'GitHub', 'description' => 'Development platform using Git'],
            ['name' => 'GitLab', 'description' => 'DevOps lifecycle tool'],
            ['name' => 'Jenkins', 'description' => 'Automation server for CI/CD'],
            ['name' => 'AWS', 'description' => 'Amazon Web Services cloud platform'],
            ['name' => 'Google Cloud', 'description' => 'Google cloud computing services'],
            ['name' => 'Azure', 'description' => 'Microsoft cloud platform'],
            
            // Design
            ['name' => 'UI/UX Design', 'description' => 'User interface and experience design'],
            ['name' => 'Figma', 'description' => 'Collaborative interface design tool'],
            ['name' => 'Adobe XD', 'description' => 'Vector design tool for UX/UI'],
            ['name' => 'Photoshop', 'description' => 'Image editing software'],
            ['name' => 'Illustrator', 'description' => 'Vector graphics editor'],
            
            // Soft Skills
            ['name' => 'Communication', 'description' => 'Effective communication skills'],
            ['name' => 'Leadership', 'description' => 'Team leadership abilities'],
            ['name' => 'Problem Solving', 'description' => 'Analytical problem-solving skills'],
            ['name' => 'Team Work', 'description' => 'Collaborative team working'],
            ['name' => 'Project Management', 'description' => 'Managing projects effectively'],
            
            // Others
            ['name' => 'REST API', 'description' => 'RESTful API development'],
            ['name' => 'GraphQL', 'description' => 'Query language for APIs'],
            ['name' => 'Microservices', 'description' => 'Microservices architecture'],
            ['name' => 'Agile', 'description' => 'Agile methodology'],
            ['name' => 'Scrum', 'description' => 'Scrum framework'],
            ['name' => 'TDD', 'description' => 'Test-driven development'],
            ['name' => 'CI/CD', 'description' => 'Continuous integration and deployment'],
        ];

        foreach ($skills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'description' => $skill['description'],
                'created_at' => now()->subMonths(rand(1, 12)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}

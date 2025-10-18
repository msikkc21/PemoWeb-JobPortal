<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PencariKerjaKeahlianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get all job seeker profiles
        $pencariKerjaIds = DB::table('jobseeker_profiles')->pluck('jobseeker_id')->toArray();
        
        if (empty($pencariKerjaIds)) {
            $this->command->warn('PencariKerjaKeahlianSeeder skipped: no job seeker profiles found.');
            return;
        }
        
        // Get all skill IDs
        $keahlianIds = DB::table('keahlians')->pluck('skill_id')->toArray();
        
        if (empty($keahlianIds)) {
            $this->command->warn('PencariKerjaKeahlianSeeder skipped: no skills found.');
            return;
        }
        
        // For each job seeker, assign 3-5 skills with varying levels
        foreach ($pencariKerjaIds as $pencariId) {
            // Get job seeker's education from profile to determine skill levels
            $pencariProfile = DB::table('jobseeker_profiles')
                ->where('jobseeker_id', $pencariId)
                ->first();
            
            // Based on education, determine max years of experience and skill level probabilities (with English mapping)
            $maxYears = 1;
            $levelProbabilities = ['beginner' => 70, 'intermediate' => 25, 'expert' => 5]; // Default for SMA
            
            if ($pencariProfile) {
                switch ($pencariProfile->education) {
                    case 'S2':
                        $maxYears = 10;
                        $levelProbabilities = ['beginner' => 10, 'intermediate' => 40, 'expert' => 50];
                        break;
                    case 'S1':
                        $maxYears = 7;
                        $levelProbabilities = ['beginner' => 20, 'intermediate' => 50, 'expert' => 30];
                        break;
                    case 'D3':
                        $maxYears = 5;
                        $levelProbabilities = ['beginner' => 30, 'intermediate' => 50, 'expert' => 20];
                        break;
                }
            }
            
            // Randomly select 3-5 skills for this job seeker
            $skillCount = rand(3, min(5, count($keahlianIds)));
            $selectedSkills = array_rand(array_flip($keahlianIds), $skillCount);
            
            if (!is_array($selectedSkills)) {
                $selectedSkills = [$selectedSkills];
            }
            
            foreach ($selectedSkills as $keahlianId) {
                // Determine skill level based on probabilities
                $level = $this->getRandomWeightedElement($levelProbabilities);
                
                // Experience years based on skill level
                switch ($level) {
                    case 'expert':
                        $years = rand(max(3, $maxYears - 4), $maxYears);
                        break;
                    case 'intermediate':
                        $years = rand(2, min(5, $maxYears));
                        break;
                    default:
                        $years = rand(0, 2);
                        break;
                }
                
                // Insert the job seeker skill
                DB::table('pencari_kerja_keahlians')->insert([
                    'jobseeker_id' => $pencariId,
                    'skill_id' => $keahlianId,
                    'level' => $level,
                    'experience_years' => $years,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
    
    /**
     * Get a random element with weighted probabilities.
     *
     * @param array $weightedValues Array of values with their weights
     * @return string The selected element
     */
    private function getRandomWeightedElement(array $weightedValues)
    {
        $rand = rand(1, array_sum($weightedValues));
        
        foreach ($weightedValues as $key => $value) {
            $rand -= $value;
            if ($rand <= 0) {
                return $key;
            }
        }
        
        return array_key_first($weightedValues); // Fallback
    }
}

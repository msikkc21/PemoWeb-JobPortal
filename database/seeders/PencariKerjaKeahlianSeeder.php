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
        $pencariKerjaIds = DB::table('jobseeker_profiles')->pluck('id_pencari')->toArray();
        
        if (empty($pencariKerjaIds)) {
            $this->command->warn('PencariKerjaKeahlianSeeder skipped: no job seeker profiles found.');
            return;
        }
        
        // Get all skill IDs
        $keahlianIds = DB::table('keahlians')->pluck('id')->toArray();
        
        if (empty($keahlianIds)) {
            $this->command->warn('PencariKerjaKeahlianSeeder skipped: no skills found.');
            return;
        }
        
        // For each job seeker, assign 3-5 skills with varying levels
        foreach ($pencariKerjaIds as $pencariId) {
            // Get job seeker's education from profile to determine skill levels
            $pencariProfile = DB::table('jobseeker_profiles')
                ->where('id_pencari', $pencariId)
                ->first();
            
            // Based on education, determine max years of experience and skill level probabilities
            $maxYears = 1;
            $levelProbabilities = ['pemula' => 70, 'menengah' => 25, 'mahir' => 5]; // Default for SMA
            
            if ($pencariProfile) {
                switch ($pencariProfile->pendidikan) {
                    case 'S2':
                        $maxYears = 10;
                        $levelProbabilities = ['pemula' => 10, 'menengah' => 40, 'mahir' => 50];
                        break;
                    case 'S1':
                        $maxYears = 7;
                        $levelProbabilities = ['pemula' => 20, 'menengah' => 50, 'mahir' => 30];
                        break;
                    case 'D3':
                        $maxYears = 5;
                        $levelProbabilities = ['pemula' => 30, 'menengah' => 50, 'mahir' => 20];
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
                    case 'mahir':
                        $years = rand(max(3, $maxYears - 4), $maxYears);
                        break;
                    case 'menengah':
                        $years = rand(2, min(5, $maxYears));
                        break;
                    default:
                        $years = rand(0, 2);
                        break;
                }
                
                // Insert the job seeker skill
                DB::table('pencari_kerja_keahlians')->insert([
                    'id_pencari' => $pencariId,
                    'id_keahlian' => $keahlianId,
                    'tingkat' => $level,
                    'pengalaman_tahun' => $years,
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

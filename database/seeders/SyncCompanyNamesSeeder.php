<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SyncCompanyNamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder synchronizes company_name with user.name for all existing companies.
     * Priority is given to users.name as the source of truth.
     */
    public function run(): void
    {
        $this->command->info('🔄 Starting company name synchronization...');

        $syncCount = 0;
        $skipCount = 0;

        // Get all companies with their users
        $companies = Company::with('user')->get();

        foreach ($companies as $company) {
            if (!$company->user) {
                $this->command->warn("⚠️  Company ID {$company->id} has no associated user. Skipping.");
                $skipCount++;
                continue;
            }

            $userName = $company->user->name;
            $companyName = $company->company_name;

            // If names don't match, sync from user.name to company.company_name
            if ($userName !== $companyName) {
                DB::transaction(function () use ($company, $userName) {
                    $company->update([
                        'company_name' => $userName
                    ]);
                });

                $this->command->info("✅ Synced: Company ID {$company->id} | '{$companyName}' → '{$userName}'");
                $syncCount++;
            } else {
                $skipCount++;
            }
        }

        $this->command->info("\n📊 Synchronization complete!");
        $this->command->info("   - Synchronized: {$syncCount}");
        $this->command->info("   - Already in sync: {$skipCount}");
        $this->command->info("   - Total companies: " . $companies->count());
    }
}

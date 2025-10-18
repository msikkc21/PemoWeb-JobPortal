<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CompanyProfile;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class CompanyProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Get all users with 'Perusahaan' role
        $companyRoleId = DB::table('roles')->where('name', 'Perusahaan')->value('id');
        $companyUserIds = DB::table('users')->where('role_id', $companyRoleId)->pluck('id')->toArray();

        if (empty($companyUserIds)) {
            $this->command->warn('CompanyProfileSeeder skipped: no users with Perusahaan role found.');
            return;
        }

        // Company details with specific data for each company
        $companyDetails = [
            [
                'company_name' => 'PT Teknologi Maju',
                'industry' => 'Teknologi',
                'description' => 'Perusahaan teknologi yang berfokus pada pengembangan software dan solusi IT untuk bisnis.',
                'location' => 'Jakarta, Indonesia',
                'website' => 'https://teknologimaju.id',
                'company_email' => 'info@teknologimaju.id',
                'phone' => '021-5551234',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'employee_count' => 250,
                'founded_year' => 2010,
            ],
            [
                'company_name' => 'CV Desain Kreatif',
                'industry' => 'Kreatif',
                'description' => 'Studio desain yang menyediakan jasa desain grafis, UI/UX, dan branding untuk berbagai klien.',
                'location' => 'Bandung, Indonesia',
                'website' => 'https://desainkreatif.com',
                'company_email' => 'hello@desainkreatif.com',
                'phone' => '022-7891234',
                'address' => 'Jl. Dago No. 45, Bandung',
                'employee_count' => 30,
                'founded_year' => 2015,
            ],
            [
                'company_name' => 'PT Global Inovasi',
                'industry' => 'Konsultasi',
                'description' => 'Perusahaan konsultan manajemen dan teknologi informasi yang melayani klien dari berbagai industri.',
                'location' => 'Surabaya, Indonesia',
                'website' => 'https://globalinovasi.co.id',
                'company_email' => 'contact@globalinovasi.co.id',
                'phone' => '031-8765432',
                'address' => 'Jl. Pemuda No. 56, Surabaya',
                'employee_count' => 120,
                'founded_year' => 2008,
            ],
        ];

        // Loop through company users and assign company details
        foreach ($companyUserIds as $index => $userId) {
            // Use modulo to cycle through company details if we have more users than details
            $detailIndex = $index % count($companyDetails);

            // Create company profile
            DB::table('company_profiles')->insert([
                'user_id' => $userId,
                'company_name' => $companyDetails[$detailIndex]['company_name'],
                'industry' => $companyDetails[$detailIndex]['industry'],
                'description' => $companyDetails[$detailIndex]['description'],
                'location' => $companyDetails[$detailIndex]['location'],
                'website' => $companyDetails[$detailIndex]['website'],
                'company_email' => $companyDetails[$detailIndex]['company_email'],
                'phone' => $companyDetails[$detailIndex]['phone'],
                'address' => $companyDetails[$detailIndex]['address'],
                'photo_path' => null,
                'employee_count' => $companyDetails[$detailIndex]['employee_count'],
                'founded_year' => $companyDetails[$detailIndex]['founded_year'],
                'is_approved' => $faker->boolean(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use App\Models\Role;
use Faker\Factory as Faker;
use Carbon\Carbon;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $companyRole = Role::where('name', 'company')->first();
        $companyUsers = User::where('role_id', $companyRole->id)->get();

        $industries = [
            'Information Technology',
            'E-Commerce',
            'Financial Technology',
            'Digital Marketing',
            'Software Development',
        ];

        $locations = [
            'Jakarta Selatan',
            'Bandung',
            'Yogyakarta',
            'Surabaya',
            'Bali',
        ];

        $descriptions = [
            'Perusahaan teknologi terkemuka yang berfokus pada solusi digital inovatif untuk transformasi bisnis di era modern.',
            'Platform e-commerce terpercaya yang menghubungkan jutaan penjual dan pembeli dengan teknologi terdepan.',
            'Startup fintech yang menghadirkan layanan keuangan digital mudah, aman, dan terjangkau untuk semua kalangan.',
            'Agency digital marketing profesional yang membantu brand berkembang melalui strategi pemasaran digital terintegrasi.',
            'Software house berpengalaman dalam mengembangkan aplikasi enterprise dan mobile berkualitas tinggi.',
        ];

        foreach ($companyUsers as $index => $user) {
            // Variasi: beberapa company belum lengkap profilnya
            $isComplete = $index >= 2; // 2 company pertama belum lengkap

            Company::create([
                'user_id' => $user->id,
                'company_name' => $user->name,
                'industry' => $industries[$index],
                'description' => $isComplete ? $descriptions[$index] : null,
                'location' => $locations[$index],
                'website' => $isComplete ? 'https://www.' . strtolower(str_replace(' ', '', $user->name)) . '.com' : null,
                'company_email' => $user->email,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'photo_path' => $isComplete ? 'logos/company_' . ($index + 1) . '.png' : null,
                'employee_count' => $isComplete ? rand(50, 500) : rand(10, 50),
                'founded_year' => rand(2010, 2022),
                'created_at' => $user->created_at,
                'updated_at' => now()->subDays(rand(1, 15)),
            ]);
        }
    }
}

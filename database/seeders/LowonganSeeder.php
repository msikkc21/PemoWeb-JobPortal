<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LowonganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get all company profiles to link with job listings
        $companyIds = DB::table('company_profiles')->pluck('id')->toArray();
        
        if (empty($companyIds)) {
            $this->command->warn('LowonganSeeder skipped: no company profiles found.');
            return;
        }
        
        // Job listings data
        $lowongans = [
            [
                'title' => 'Backend Developer PHP/Laravel',
                'description' => 'Kami sedang mencari Backend Developer yang berpengalaman dengan PHP dan Laravel untuk bergabung dengan tim pengembangan kami. Posisi ini bertanggung jawab untuk merancang, mengembangkan, dan memelihara API dan layanan backend untuk aplikasi web kami.',
                'requirements' => "- Minimal 2 tahun pengalaman dengan PHP dan Laravel\n- Pemahaman yang baik tentang database SQL\n- Familiar dengan RESTful API\n- Kemampuan problem solving yang baik\n- Bisa bekerja dalam tim",
                'salary' => 8000000,
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'job_level' => 'Mid-level',
                'status' => 'open',
            ],
            [
                'title' => 'Frontend Developer React',
                'description' => 'Kami mencari Frontend Developer dengan keahlian React.js untuk membangun antarmuka pengguna yang responsif dan intuitif. Anda akan bekerja sama dengan tim desainer dan backend developer untuk mengimplementasikan fitur-fitur baru.',
                'requirements' => "- Minimal 1 tahun pengalaman dengan React.js\n- Pemahaman yang baik tentang HTML, CSS, dan JavaScript\n- Familiar dengan state management (Redux/Context API)\n- Pengalaman dengan responsive design\n- Portfolio yang menunjukkan proyek sebelumnya",
                'salary' => 7500000,
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'job_level' => 'Junior',
                'status' => 'open',
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'Kami mencari UI/UX Designer yang kreatif untuk merancang pengalaman pengguna yang luar biasa. Anda akan bertanggung jawab untuk membuat wireframe, prototipe, dan desain visual untuk aplikasi web dan mobile kami.',
                'requirements' => "- Minimal 2 tahun pengalaman sebagai UI/UX Designer\n- Kemampuan menggunakan Figma, Adobe XD, atau Sketch\n- Portfolio yang menunjukkan proyek desain sebelumnya\n- Pemahaman tentang prinsip desain dan UX\n- Kemampuan bekerja dengan tim pengembangan",
                'salary' => 7000000,
                'location' => 'Bandung',
                'job_type' => 'Full-time',
                'job_level' => 'Mid-level',
                'status' => 'open',
            ],
            [
                'title' => 'Data Analyst',
                'description' => 'Kami mencari Data Analyst yang akan membantu kami menganalisis data bisnis dan memberikan insight untuk pengambilan keputusan. Anda akan bekerja dengan data dari berbagai sumber untuk mengidentifikasi tren dan peluang.',
                'requirements' => "- Gelar dalam Statistik, Matematika, atau bidang terkait\n- Pengalaman dengan SQL dan Excel\n- Familiar dengan alat visualisasi data seperti Tableau atau Power BI\n- Kemampuan analitis yang kuat\n- Komunikasi yang baik untuk menyampaikan temuan",
                'salary' => 9000000,
                'location' => 'Surabaya',
                'job_type' => 'Full-time',
                'job_level' => 'Mid-level',
                'status' => 'open',
            ],
            [
                'title' => 'DevOps Engineer',
                'description' => 'Kami mencari DevOps Engineer yang akan membantu mengotomatisasi infrastruktur kami dan meningkatkan proses deployment. Anda akan bekerja dengan tim pengembangan untuk memastikan aplikasi kami berjalan dengan lancar di lingkungan produksi.',
                'requirements' => "- Pengalaman dengan Docker dan Kubernetes\n- Familiar dengan cloud platform seperti AWS atau GCP\n- Pengetahuan tentang CI/CD pipeline\n- Pemahaman tentang Linux dan scripting\n- Kemampuan troubleshooting yang baik",
                'salary' => 12000000,
                'location' => 'Jakarta',
                'job_type' => 'Full-time',
                'job_level' => 'Senior',
                'status' => 'open',
            ]
        ];
        
        $now = now();
        
        // Insert job listings
        foreach ($lowongans as $lowongan) {
            DB::table('lowongans')->insert([
                'company_id' => $faker->randomElement($companyIds),
                'title' => $lowongan['title'],
                'description' => $lowongan['description'],
                'requirements' => $lowongan['requirements'],
                'salary' => $lowongan['salary'],
                'location' => $lowongan['location'],
                'job_type' => $lowongan['job_type'],
                'job_level' => $lowongan['job_level'],
                'status' => $lowongan['status'],
                'posted_date' => $faker->dateTimeBetween('-30 days', 'now'),
                'expiry_date' => $faker->dateTimeBetween('+7 days', '+60 days'),
                'is_approved' => $faker->boolean(),
                'created_at' => $now,
                'updated_at' => $now
            ]);
        }
    }
}

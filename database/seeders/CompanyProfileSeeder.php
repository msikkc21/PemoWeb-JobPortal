<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CompanyProfile;
use App\Models\Pengguna;
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
        $companyUserIds = DB::table('pengguna')
            ->where('peran', 'Perusahaan')
            ->pluck('id_pengguna')
            ->toArray();
            
        if (empty($companyUserIds)) {
            $this->command->warn('CompanyProfileSeeder skipped: no users with Perusahaan role found.');
            return;
        }

        // Company details with specific data for each company
        $companyDetails = [
            [
                'nama_perusahaan' => 'PT Teknologi Maju',
                'industri' => 'Teknologi',
                'deskripsi' => 'Perusahaan teknologi yang berfokus pada pengembangan software dan solusi IT untuk bisnis.',
                'lokasi' => 'Jakarta, Indonesia',
                'website' => 'https://teknologimaju.id',
                'email_perusahaan' => 'info@teknologimaju.id',
                'telepon' => '021-5551234',
                'alamat' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'jumlah_karyawan' => 250,
                'tahun_dibentuk' => 2010,
            ],
            [
                'nama_perusahaan' => 'CV Desain Kreatif',
                'industri' => 'Kreatif',
                'deskripsi' => 'Studio desain yang menyediakan jasa desain grafis, UI/UX, dan branding untuk berbagai klien.',
                'lokasi' => 'Bandung, Indonesia',
                'website' => 'https://desainkreatif.com',
                'email_perusahaan' => 'hello@desainkreatif.com',
                'telepon' => '022-7891234',
                'alamat' => 'Jl. Dago No. 45, Bandung',
                'jumlah_karyawan' => 30,
                'tahun_dibentuk' => 2015,
            ],
            [
                'nama_perusahaan' => 'PT Global Inovasi',
                'industri' => 'Konsultasi',
                'deskripsi' => 'Perusahaan konsultan manajemen dan teknologi informasi yang melayani klien dari berbagai industri.',
                'lokasi' => 'Surabaya, Indonesia',
                'website' => 'https://globalinovasi.co.id',
                'email_perusahaan' => 'contact@globalinovasi.co.id',
                'telepon' => '031-8765432',
                'alamat' => 'Jl. Pemuda No. 56, Surabaya',
                'jumlah_karyawan' => 120,
                'tahun_dibentuk' => 2008,
            ],
        ];
        
        // Loop through company users and assign company details
        foreach ($companyUserIds as $index => $userId) {
            // Use modulo to cycle through company details if we have more users than details
            $detailIndex = $index % count($companyDetails);
            
            // Create company profile
            DB::table('company_profiles')->insert([
                'id_pengguna' => $userId,
                'nama_perusahaan' => $companyDetails[$detailIndex]['nama_perusahaan'],
                'industri' => $companyDetails[$detailIndex]['industri'],
                'deskripsi' => $companyDetails[$detailIndex]['deskripsi'],
                'lokasi' => $companyDetails[$detailIndex]['lokasi'],
                'website' => $companyDetails[$detailIndex]['website'],
                'email_perusahaan' => $companyDetails[$detailIndex]['email_perusahaan'],
                'telepon' => $companyDetails[$detailIndex]['telepon'],
                'alamat' => $companyDetails[$detailIndex]['alamat'],
                'path_foto' => null,
                'jumlah_karyawan' => $companyDetails[$detailIndex]['jumlah_karyawan'],
                'tahun_dibentuk' => $companyDetails[$detailIndex]['tahun_dibentuk'],
                'dibuat_pada' => now(),
                'diperbarui_pada' => now(),
            ]);
        }
    }
}

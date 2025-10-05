<?php

namespace App\Http\Controllers;

use App\Models\Wawancara;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class JobseekerInterviewController extends Controller
{
    private const MODEL_FIELDS = [
        'id',
        'kandidat_id',
        'perusahaan_id',
        'posisi',
        'tanggal',
        'waktu',
        'format',
        'lokasi',
        'status',
        'catatan',
        'status_kehadiran',
        'created_at',
        'updated_at',
    ];

    private const ALLOWED_VIEW_FIELDS = [
        'id',
        'posisi',
        'tanggal',
        'waktu',
        'format',
        'lokasi',
        'status',
        'catatan',
        'status_kehadiran',
    ];

    public function index(Request $request): Response
    {
        $jobseekerId = $this->resolveJobseekerId($request->user());

        $records = $this->baseQuery()
            ->when($jobseekerId, fn (EloquentBuilder $query) => $query->where('lamarans.id_pencari', $jobseekerId))
            ->orderByDesc('wawancara.jadwal')
            ->get();

        $interviews = $records
            ->map(fn ($record) => $this->transformRecord($record))
            ->values();

        return Inertia::render('Jobseeker/Interviews/Index', [
            'interviews' => $interviews,
            'schema' => $this->buildSchemaReport($interviews),
            'meta' => [
                'jobseekerId' => $jobseekerId,
                'total' => $interviews->count(),
            ],
        ]);
    }

    public function show(Request $request, int $interviewId): Response
    {
        $jobseekerId = $this->resolveJobseekerId($request->user());

        $record = $this->baseQuery()
            ->where('wawancara.id_wawancara', $interviewId)
            ->firstOrFail();

        if ($jobseekerId && (int) $record->id_pencari !== (int) $jobseekerId) {
            abort(403, 'Jadwal tidak tersedia untuk akun Anda.');
        }

        $interview = $this->transformRecord($record);

        return Inertia::render('Jobseeker/Interviews/Show', [
            'interview' => $interview,
            'schema' => $this->buildSchemaReport(collect([$interview])),
        ]);
    }

    private function baseQuery(): EloquentBuilder
    {
        return Wawancara::query()
            ->select([
                'wawancara.id_wawancara',
                'wawancara.id_lamaran',
                'wawancara.jadwal',
                'wawancara.lokasi',
                'wawancara.status',
                'lamarans.id_pencari',
                'lamarans.catatan as lamaran_catatan',
                'lowongans.id_company',
                'lowongans.judul as posisi_lowongan',
            ])
            ->leftJoin('lamarans', 'lamarans.id_lamaran', '=', 'wawancara.id_lamaran')
            ->leftJoin('lowongans', 'lowongans.id_lowongan', '=', 'lamarans.id_lowongan');
    }

    private function transformRecord(object $record): array
    {
        $meta = $this->unpackMetadata($record->lokasi);
        $schedule = Carbon::parse($record->jadwal);

        $payload = [
            'id' => (int) $record->id_wawancara,
            'posisi' => $record->posisi_lowongan,
            'tanggal' => $schedule->format('Y-m-d'),
            'waktu' => $schedule->format('H:i'),
            'format' => $meta['format'] ?? null,
            'lokasi' => $meta['lokasi'] ?? null,
            'status' => $record->status,
            'catatan' => $meta['catatan'] ?? $record->lamaran_catatan,
            'status_kehadiran' => $meta['status_kehadiran'] ?? null,
        ];

        return $this->filterViewFields($payload);
    }

    private function resolveJobseekerId($user): ?int
    {
        if (!$user) {
            return null;
        }

        $profile = null;

        if (method_exists($user, 'profilPencariKerja')) {
            $profile = $user->profilPencariKerja;
        }

        if (!$profile && method_exists($user, 'jobSeekerProfile')) {
            $profile = $user->jobSeekerProfile;
        }

        if (!$profile) {
            return null;
        }

        return (int) ($profile->id_pencari ?? $profile->id ?? null);
    }

    private function buildSchemaReport(Collection $collection): array
    {
        $used = $collection
            ->flatMap(fn ($item) => array_keys((array) $item))
            ->unique()
            ->values()
            ->all();

        $unknown = array_values(array_diff($used, self::ALLOWED_VIEW_FIELDS));
        $missing = array_values(array_diff(self::ALLOWED_VIEW_FIELDS, $used));

        return [
            'model' => self::MODEL_FIELDS,
            'allowed' => self::ALLOWED_VIEW_FIELDS,
            'used' => $used,
            'unknown' => $unknown,
            'missing' => $missing,
        ];
    }

    private function filterViewFields(array $payload): array
    {
        $allowed = array_flip(self::ALLOWED_VIEW_FIELDS);

        return array_filter(
            $payload,
            fn ($value, $key) => array_key_exists($key, $allowed),
            ARRAY_FILTER_USE_BOTH
        );
    }

    private function unpackMetadata(?string $value): array
    {
        $defaults = [
            'format' => null,
            'lokasi' => null,
            'catatan' => null,
            'status_kehadiran' => null,
        ];

        if (!$value) {
            return $defaults;
        }

        $decoded = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return array_merge($defaults, array_intersect_key($decoded, $defaults));
        }

        return array_merge($defaults, ['lokasi' => $value]);
    }
}

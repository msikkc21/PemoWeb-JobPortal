<?php

namespace App\Http\Controllers;

use App\Models\Lamaran;
use App\Models\Wawancara;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyInterviewController extends Controller
{
    private const MODEL_FIELDS = [
        'id',
        'lamaran_id',
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
    'lamaran_id',
        'posisi',
        'tanggal',
        'waktu',
        'format',
        'lokasi',
        'status',
        'catatan',
        'status_kehadiran',
    ];

    private const FORMAT_OPTIONS = ['online', 'offline'];

    private const STATUS_OPTIONS = [
        'Menunggu',
        'Diproses',
        'Terjadwal',
        'Selesai',
        'Ditolak',
        'Dibatalkan',
    ];

    private const ATTENDANCE_OPTIONS = [
        'Belum Dikonfirmasi',
        'Hadir',
        'Tidak Hadir',
        'Reschedule',
    ];

    public function index(Request $request): Response
    {
        $companyId = $this->resolveCompanyId($request->user());

        $records = $this->baseQuery()
            ->when($companyId, fn (EloquentBuilder $query) => $query->where('lowongans.id_company', $companyId))
            ->orderByDesc('wawancara.jadwal')
            ->get();

        $interviews = $records
            ->map(fn ($record) => $this->transformRecord($record, $companyId))
            ->values();

        return Inertia::render('Company/Interviews/Index', [
            'interviews' => $interviews,
            'applications' => $this->fetchApplicationsForCompany($companyId),
            'options' => [
                'formats' => self::FORMAT_OPTIONS,
                'statuses' => self::STATUS_OPTIONS,
                'attendanceStatuses' => self::ATTENDANCE_OPTIONS,
            ],
            'schema' => $this->buildSchemaReport($interviews),
            'meta' => [
                'companyId' => $companyId,
                'total' => $interviews->count(),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $companyId = $this->resolveCompanyId($request->user());

        return Inertia::render('Company/Interviews/Create', [
            'options' => [
                'formats' => self::FORMAT_OPTIONS,
                'statuses' => self::STATUS_OPTIONS,
                'attendanceStatuses' => self::ATTENDANCE_OPTIONS,
            ],
            'applications' => $this->fetchApplicationsForCompany($companyId),
            'schema' => $this->buildSchemaReport(collect()),
            'defaults' => $this->filterViewFields([
                'tanggal' => Carbon::now()->format('Y-m-d'),
                'waktu' => '09:00',
                'format' => self::FORMAT_OPTIONS[0],
                'status' => self::STATUS_OPTIONS[0],
                'status_kehadiran' => self::ATTENDANCE_OPTIONS[0],
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $companyId = $this->resolveCompanyId($request->user());

        $validated = $this->validatePayload($request, [
            'lamaran_id' => ['required', 'integer', 'exists:lamarans,id_lamaran'],
            'tanggal' => ['required', 'date', 'after_or_equal:today'],
            'waktu' => ['required', 'date_format:H:i'],
            'format' => ['required', Rule::in(self::FORMAT_OPTIONS)],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(self::STATUS_OPTIONS)],
            'catatan' => ['nullable', 'string'],
            'status_kehadiran' => ['nullable', Rule::in(self::ATTENDANCE_OPTIONS)],
        ]);

        $lamaran = $this->fetchLamaranWithRelations((int) $validated['lamaran_id']);

        if ($companyId && $lamaran && (int) $lamaran->id_company !== (int) $companyId) {
            abort(403, 'Lamaran tidak terhubung dengan perusahaan saat ini.');
        }

        $schedule = Carbon::parse($validated['tanggal'] . ' ' . $validated['waktu']);

        Wawancara::create([
            'id_lamaran' => $validated['lamaran_id'],
            'jadwal' => $schedule,
            'lokasi' => $this->packMetadata($validated),
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('company.interviews.index')
            ->with('success', 'Jadwal wawancara berhasil dibuat.');
    }

    public function show(Request $request, int $interviewId): Response
    {
        $companyId = $this->resolveCompanyId($request->user());

        $record = $this->baseQuery()
            ->where('wawancara.id_wawancara', $interviewId)
            ->firstOrFail();

        if ($companyId && (int) $record->id_company !== (int) $companyId) {
            abort(403, 'Jadwal tidak ditemukan untuk perusahaan Anda.');
        }

        $interview = $this->transformRecord($record, $companyId);

        return Inertia::render('Company/Interviews/Show', [
            'interview' => $interview,
            'schema' => $this->buildSchemaReport(collect([$interview])),
            'options' => [
                'formats' => self::FORMAT_OPTIONS,
                'statuses' => self::STATUS_OPTIONS,
                'attendanceStatuses' => self::ATTENDANCE_OPTIONS,
            ],
        ]);
    }

    public function edit(Request $request, int $interviewId): Response
    {
        $companyId = $this->resolveCompanyId($request->user());

        $record = $this->baseQuery()
            ->where('wawancara.id_wawancara', $interviewId)
            ->firstOrFail();

        if ($companyId && (int) $record->id_company !== (int) $companyId) {
            abort(403, 'Jadwal tidak ditemukan untuk perusahaan Anda.');
        }

        $interview = $this->transformRecord($record, $companyId);

        return Inertia::render('Company/Interviews/Edit', [
            'interview' => $interview,
            'applications' => $this->fetchApplicationsForCompany($companyId),
            'options' => [
                'formats' => self::FORMAT_OPTIONS,
                'statuses' => self::STATUS_OPTIONS,
                'attendanceStatuses' => self::ATTENDANCE_OPTIONS,
            ],
            'schema' => $this->buildSchemaReport(collect([$interview])),
        ]);
    }

    public function update(Request $request, int $interviewId): RedirectResponse
    {
        $companyId = $this->resolveCompanyId($request->user());

        $interview = Wawancara::query()->findOrFail($interviewId);

        $lamaran = $this->fetchLamaranWithRelations((int) $interview->id_lamaran);

        if ($companyId && $lamaran && (int) $lamaran->id_company !== (int) $companyId) {
            abort(403, 'Anda tidak memiliki akses ke jadwal ini.');
        }

        $validated = $this->validatePayload($request, [
            'tanggal' => ['required', 'date', 'after_or_equal:today'],
            'waktu' => ['required', 'date_format:H:i'],
            'format' => ['required', Rule::in(self::FORMAT_OPTIONS)],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(self::STATUS_OPTIONS)],
            'catatan' => ['nullable', 'string'],
            'status_kehadiran' => ['nullable', Rule::in(self::ATTENDANCE_OPTIONS)],
        ]);

        $schedule = Carbon::parse($validated['tanggal'] . ' ' . $validated['waktu']);

        $interview->update([
            'jadwal' => $schedule,
            'lokasi' => $this->packMetadata($validated, $interview->lokasi),
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('company.interviews.show', $interviewId)
            ->with('success', 'Jadwal wawancara berhasil diperbarui.');
    }

    public function destroy(Request $request, int $interviewId): RedirectResponse
    {
        $companyId = $this->resolveCompanyId($request->user());

        $interview = Wawancara::query()->findOrFail($interviewId);

        $lamaran = $this->fetchLamaranWithRelations((int) $interview->id_lamaran);

        if ($companyId && $lamaran && (int) $lamaran->id_company !== (int) $companyId) {
            abort(403, 'Anda tidak memiliki akses ke jadwal ini.');
        }

        $interview->delete();

        return redirect()
            ->route('company.interviews.index')
            ->with('success', 'Jadwal wawancara berhasil dihapus.');
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

    private function transformRecord(object $record, ?int $companyId = null): array
    {
        $meta = $this->unpackMetadata($record->lokasi);
        $schedule = Carbon::parse($record->jadwal);

        $payload = [
            'id' => (int) $record->id_wawancara,
            'lamaran_id' => (int) $record->id_lamaran,
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

    private function fetchApplicationsForCompany(?int $companyId): array
    {
        $query = Lamaran::query()
            ->select([
                'lamarans.id_lamaran',
                'lamarans.id_pencari',
                'lamarans.status',
                'lamarans.catatan',
                'lowongans.judul as posisi',
            ])
            ->join('lowongans', 'lowongans.id_lowongan', '=', 'lamarans.id_lowongan');

        if ($companyId) {
            $query->where('lowongans.id_company', $companyId);
        }

        return $query
            ->orderByDesc('lamarans.id_lamaran')
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id_lamaran,
                'kandidat_id' => $row->id_pencari ? (int) $row->id_pencari : null,
                'posisi' => $row->posisi,
                'status' => $row->status,
                'catatan' => $row->catatan,
            ])
            ->toArray();
    }

    private function fetchLamaranWithRelations(int $lamaranId): ?object
    {
        return DB::table('lamarans')
            ->select([
                'lamarans.id_lamaran',
                'lamarans.id_pencari',
                'lamarans.status',
                'lowongans.id_company',
                'lowongans.judul as posisi',
            ])
            ->join('lowongans', 'lowongans.id_lowongan', '=', 'lamarans.id_lowongan')
            ->where('lamarans.id_lamaran', $lamaranId)
            ->first();
    }

    private function resolveCompanyId($user): ?int
    {
        if (!$user) {
            return null;
        }

        $profile = null;

        if (method_exists($user, 'profilPerusahaan')) {
            $profile = $user->profilPerusahaan;
        }

        if (!$profile && method_exists($user, 'companyProfile')) {
            $profile = $user->companyProfile;
        }

        if (!$profile) {
            return null;
        }

        return (int) ($profile->id_perusahaan ?? $profile->id ?? null);
    }

    private function validatePayload(Request $request, array $rules): array
    {
        $data = $request->validate($rules);

        return $this->filterModelFields($data);
    }

    private function filterModelFields(array $payload): array
    {
        $allowed = array_flip(self::MODEL_FIELDS);

        return array_filter(
            $payload,
            fn ($value, $key) => array_key_exists($key, $allowed),
            ARRAY_FILTER_USE_BOTH
        );
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

    private function packMetadata(array $payload, ?string $current = null): string
    {
        $existing = $this->unpackMetadata($current);

        $meta = array_filter([
            'format' => $payload['format'] ?? $existing['format'] ?? null,
            'lokasi' => $payload['lokasi'] ?? $existing['lokasi'] ?? null,
            'catatan' => $payload['catatan'] ?? $existing['catatan'] ?? null,
            'status_kehadiran' => $payload['status_kehadiran'] ?? $existing['status_kehadiran'] ?? null,
        ], static fn ($value) => $value !== null && $value !== '');

        if ($meta === []) {
            return '';
        }

        $encoded = json_encode($meta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($encoded === false || strlen($encoded) > 255) {
            return (string) ($meta['lokasi'] ?? '');
        }

        return $encoded;
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

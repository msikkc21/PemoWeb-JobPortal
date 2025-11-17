<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Schema; 

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts'; // penting: konsisten dengan migration

    // mass assignable
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'location',
        'status',
    ];

    // status constants
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';

    // casts
    // protected $casts = [
    //     'salary' => 'decimal:2',
    // ];

    // ===============================
    // 🔗 RELATIONS
    // ===============================

    /** Job belongs to a Company */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /** Job has many Skills (pivot) */
    public function skills(): BelongsToMany
    {
        // check common pivot name variants and choose first existing table
        $candidates = [
            // common variants (adjust if your migrations use different names)
            'job_post_skill',   // singular pivot derived from job_posts + skills
            'job_post_skills',
            'job_skill',        // alternative simpler name
            'job_skills',
        ];

        $pivotTable = null;
        foreach ($candidates as $t) {
            if (Schema::hasTable($t)) {
                $pivotTable = $t;
                break;
            }
        }

        // if none exist, fall back to a sensible default (will still error if table missing)
        if (! $pivotTable) {
            $pivotTable = 'job_post_skill';
        }

        // determine pivot foreign key names based on chosen pivot name
        // common patterns:
        // - job_post_skill            => job_post_id, skill_id
        // - job_skill                 => job_id, skill_id
        // - job_post_skills / job_skills => job_post_id or job_id depending on migration
        if (in_array($pivotTable, ['job_skill', 'job_skills'])) {
            $foreignPivotKey = 'job_id';
            $relatedPivotKey = 'skill_id';
        } else {
            // default assume job_post_* uses job_post_id
            $foreignPivotKey = 'job_post_id';
            $relatedPivotKey = 'skill_id';
        }

        return $this->belongsToMany(Skill::class, $pivotTable, $foreignPivotKey, $relatedPivotKey)
            ->withTimestamps();
    }

    // ===============================
    // 🧩 SCOPES & HELPERS
    // ===============================

    public function scopeOfCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_APPROVED, self::STATUS_OPEN]);
    }

    public function isEditable(): bool
    {
        return $this->status !== self::STATUS_APPROVED && $this->status !== self::STATUS_CLOSED;
    }

    public function isClosable(): bool
    {
        return $this->status !== self::STATUS_CLOSED;
    }
}

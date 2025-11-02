<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    /**
     * Return a read-only list of skills (id, name).
     */
    public function index(Request $request): JsonResponse
    {
        $skills = Skill::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'data' => $skills,
        ]);
    }
}

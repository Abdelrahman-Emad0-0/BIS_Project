<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExploreCoursesController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('courses')
    ->leftJoin('users', 'courses.teacher_id', '=', 'users.id')
    ->select(
        'courses.*',
        'users.name as teacher_name'
    );

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        return response()->json([
            'success' => true,
            'courses' => $query->get()
        ]);
    }

    public function categories()
    {
        $categories = DB::table('courses')
            ->select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get();

        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }
}
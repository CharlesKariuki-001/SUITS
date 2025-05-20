<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        return response()->json(['data' => $query->get()]);
    }
}

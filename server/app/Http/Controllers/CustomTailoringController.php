<?php

namespace App\Http\Controllers;

use App\Models\CustomTailoring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomTailoringController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'chest' => 'required|numeric',
            'waist' => 'required|numeric',
            'arm_length' => 'required|numeric',
            'shoulder' => 'required|numeric',
            'size' => 'required|string|in:XS,S,M,L,XL',
            'color' => 'required|string|max:50',
            'fit_style' => 'required|string|in:Slim,Regular,Tailored,Loose',
            'bottom_style' => 'required_if:is_womens_suit,true|string|in:trouser,skirt|nullable',
            'fabric' => 'required|string|in:Normal Quality Plain Fabric,Standard Quality Plain Fabric,High Check Fabrics,Super Wool Fabric',
            'lapels' => 'required|string|in:Notch,Peak,Shawl',
            'is_womens_suit' => 'required|boolean',
            'additional_description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png|max:5120', // 5MB
        ]);

        // Handle image upload
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('custom_tailoring', 'public');
            $imageUrl = Storage::url($imagePath);
        }

        // Create record
        $customTailoring = CustomTailoring::create(array_merge(
            $validated,
            ['image_url' => $imageUrl]
        ));

        return response()->json([
            'message' => 'Measurements saved successfully',
            'data' => $customTailoring,
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriberController extends Controller
{
    public function store(Request $request)
    {
        // Validate email format and uniqueness
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:subscribers,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid or already subscribed email.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Store email in the database
        try {
            Subscriber::create([
                'email' => $request->input('email'),
                'verified' => false, // Set to false since no external verification
            ]);

            return response()->json([
                'message' => 'Thank you for subscribing! You’ll receive our latest updates.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while subscribing. Please try again.',
            ], 500);
        }
    }
}

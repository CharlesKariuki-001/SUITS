<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
            'isTailoringRequest' => 'boolean',
        ]);

        ContactMessage::create($validated);

        return response()->json(['message' => 'Contact message saved successfully'], 201);
    }
}

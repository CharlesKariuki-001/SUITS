<?php

     namespace App\Http\Controllers\Api;

     use App\Http\Controllers\Controller;
     use App\Models\ContactRequest;
     use Illuminate\Http\Request;

     class ContactController extends Controller
     {
         public function store(Request $request)
         {
             $validated = $request->validate([
                 'name' => 'required|string|max:255',
                 'email' => 'required|email',
                 'message' => 'required|string',
             ]);

             ContactRequest::create($validated);

             return response()->json(['message' => 'Message sent successfully'], 201);
         }
     }

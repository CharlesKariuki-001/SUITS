<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.custom_tailoring_request_id' => 'required|exists:custom_tailoring_requests,id',
            'items.*.description' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
        ]);

        $order = Order::create([
            'subtotal' => $validated['subtotal'],
            'tax' => $validated['tax'],
            'total' => $validated['total'],
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'custom_tailoring_request_id' => $item['custom_tailoring_request_id'],
                'description' => $item['description'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json(['message' => 'Order placed successfully!'], 201);
    }
}

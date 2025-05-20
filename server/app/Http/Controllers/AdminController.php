<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getOrders(Request $request)
    {
        $orders = DB::table('orders')
            ->select('id', 'user_name', 'user_email', 'user_phone', 'items', 'total', 'status', 'created_at')
            ->get()
            ->map(function ($order) {
                $items = json_decode($order->items, true);
                return [
                    'id' => $order->id,
                    'user_name' => $order->user_name,
                    'user_email' => $order->user_email,
                    'user_phone' => $order->user_phone,
                    'items' => array_map(function ($item) {
                        return [
                            'name' => $item['name'],
                            'quantity' => $item['quantity'],
                        ];
                    }, $items),
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                ];
            });

        return response()->json([
            'message' => 'Orders retrieved successfully',
            'data' => $orders,
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Received,In Progress,Ready,Delivered',
        ]);

        $updated = DB::table('orders')
            ->where('id', $id)
            ->update([
                'status' => $request->status,
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'data' => [
                'orderId' => $id,
                'status' => $request->status,
            ],
        ]);
    }

    public function getSubscribers(Request $request)
    {
        $subscribers = DB::table('subscribers')
            ->select('email', 'created_at')
            ->get();

        return response()->json([
            'message' => 'Subscribers retrieved successfully',
            'data' => $subscribers,
        ]);
    }
}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <nav class="bg-gray-800 p-4">
        <div class="container mx-auto">
            <div class="flex justify-between items-center">
                <a href="{{ route('admin.dashboard') }}" class="text-white text-lg font-bold">Admin Dashboard</a>
                <div>
                    <span class="text-gray-300 mr-4">Welcome, {{ Auth::user()->name }}</span>
                    <a href="{{ route('logout') }}" class="text-gray-300 hover:text-white" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        Logout
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                        @csrf
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <div class="container mx-auto mt-8">
        <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

        @if (session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-lg font-semibold">Total Products</h2>
                <p class="text-3xl mt-2">{{ $totalProducts }}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-lg font-semibold">Total Subscribers</h2>
                <p class="text-3xl mt-2">{{ $totalSubscribers }}</p>
            </div>
        </div>
    </div>
</body>
</html>

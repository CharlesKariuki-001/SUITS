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
        <p class="text-gray-700">This is the admin dashboard. Add more features here later!</p>
    </div>
</body>
</html>

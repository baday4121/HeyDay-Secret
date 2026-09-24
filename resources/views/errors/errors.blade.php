<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error {{ $status ?? 404 }} - HeyDay Secret</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-800 flex flex-col items-center justify-center min-h-screen px-4 font-sans antialiased">
    
    <div class="text-center max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-200 relative overflow-hidden">
        
        <div class="text-6xl mb-4 animate-float inline-block select-none">
            👀
        </div>

        <h1 class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">
            {{ $status ?? 404 }}
        </h1>

        <p class="text-gray-600 text-sm md:text-base mb-8 leading-relaxed font-medium">
            {{ $message ?? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.' }}
        </p>

        <a href="{{ url('/') }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg">
            Back to Home
        </a>
    </div>

</body>
</html>
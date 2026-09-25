<nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo dan Nama Brand -->
        <a href="{{ route('home') }}" class="flex items-center gap-2.5 group">
            <img src="{{ asset('logo.png') }}" alt="Logo" class="w-8 h-8 object-contain rounded-lg shadow-sm border border-gray-100 group-hover:scale-105 transition duration-200">
            <span class="font-bold text-lg text-gray-800 tracking-tight">Hey<span class="text-blue-600">Day</span> Secret</span>
        </a>
        
        @auth
            <div class="flex items-center gap-3">
                <a href="{{ route('dashboard') }}" class="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full hidden sm:inline-block hover:bg-gray-100 hover:text-blue-600 transition shadow-sm">
                    Admin Mode
                </a>
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm">
                        Logout
                    </button>
                </form>
            </div>
        @endauth
    </div>
</nav>
@extends('layouts.app')

@section('title', 'Admin Login')

@section('content')
    @section('meta')
        <meta name="robots" content="noindex, nofollow">
    @endsection

    <div class="w-full max-w-sm mt-10">
        <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

            @if ($errors->any())
                <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-xs font-semibold">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('login') }}" method="POST">
                @csrf
                
                <div class="mb-4">
                    <label class="block text-gray-700 text-xs font-bold mb-2">Email Address</label>
                    <input type="email" name="email" class="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" required placeholder="admin@nexicon.id" value="{{ old('email') }}">
                </div>

                <div class="mb-6">
                    <label class="block text-gray-700 text-xs font-bold mb-2">Password</label>
                    <input type="password" name="password" class="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" required placeholder="••••••••">
                </div>
                
                <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm">
                    Sign In
                </button>
            </form>
        </div>
    </div>
@endsection
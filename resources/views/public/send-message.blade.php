@extends('layouts.app')

@section('title', 'Send Secret Message')

@section('content')
    <div class="w-full max-w-lg">
        <div class="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 class="text-2xl font-bold text-center mb-2 text-gray-800">Send Anonymous Message to Baday</h2>
            <p class="text-center text-gray-500 mb-6 text-sm">Say whatever is on your mind.<br/>Your identity will remain completely anonymous. 🤫</p>

            @if (session('success'))
                <div class="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-semibold text-sm">
                    {{ session('success') }}
                </div>
            @endif

            <form id="messageForm" action="{{ route('message.store') }}" method="POST" onsubmit="handleFormSubmit(this)">
                @csrf
                <div class="mb-4">
                    <textarea name="content" id="messageInput" rows="4" 
                        class="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" 
                        placeholder="Write something here..." required>{{ old('content') }}</textarea>
                    
                    @error('content')
                        <p class="text-red-500 text-xs mt-1 font-semibold">{{ $message }}</p>
                    @enderror
                </div>
                <button type="submit" id="submitBtn" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm flex items-center justify-center gap-2">
                    <span id="btnText">Send Message</span>
                    <span id="btnLoader" class="hidden">Sending...</span>
                </button>
            </form>
        </div>

        <div class="space-y-4">
            @forelse($messages as $msg)
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <p class="text-gray-700 text-sm font-normal mb-3 break-words whitespace-pre-line">{{ Str::limit($msg->content, 510) }}</p>
                    
                    <div class="mt-4 flex justify-between items-center text-xs">
                        <span class="text-gray-400">{{ $msg->created_at->diffForHumans() }}</span>
                        <a href="{{ route('message.show', $msg->id) }}" class="text-blue-500 hover:underline font-semibold">View Details</a>
                    </div>
                </div>
            @empty
                <p class="text-center text-gray-400 mt-4 text-sm">No messages yet. Be the first!</p>
            @endforelse
        </div>

        <div class="mt-6">
            {{ $messages->links() }}
        </div>
    </div>

    <script>
        document.getElementById('messageInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const form = document.getElementById('messageForm');
                if (form.checkValidity()) {
                    form.submit();
                }
            }
        });

        function handleFormSubmit(form) {
            const btn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');

            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-not-allowed');
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
        }
    </script>
@endsection
@extends('layouts.app')

@section('title', 'Send Secret Message')

@section('content')
    <div class="w-full max-w-lg px-4 sm:px-0">
        <div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-8">
            <h2 class="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-800">Send Anonymous Message to Baday</h2>
            <p class="text-center text-gray-500 mb-6 text-xs sm:text-sm">Say whatever is on your mind.<br/>Your identity will remain completely anonymous. 🤫</p>

            @if (session('success'))
                <div class="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-semibold text-xs sm:text-sm">
                    {{ session('success') }}
                </div>
            @endif

            <form id="messageForm" action="{{ route('message.store') }}" method="POST" onsubmit="handleFormSubmit(this)">
                @csrf
                <div class="mb-4">
                    <textarea name="content" id="messageInput" rows="4" 
                        class="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs sm:text-sm resize-none" 
                        placeholder="Write something here..." required>{{ old('content') }}</textarea>
                    
                    @error('content')
                        <p class="text-red-500 text-xs mt-1 font-semibold">{{ $message }}</p>
                    @enderror
                </div>
                <button type="submit" id="submitBtn" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2">
                    <span id="btnText">Send Message</span>
                    <span id="btnLoader" class="hidden">Sending...</span>
                </button>
            </form>
        </div>

        <div class="space-y-4">
            @forelse($messages as $msg)
                <div class="bg-white p-5 rounded-xl shadow-sm overflow-hidden">
                    
                    @if(isset($msg->replies_count) && $msg->replies_count > 0)
                        <div class="flex justify-end mb-2">
                            <div class="text-gray-400 text-[10px] font-semibold inline-flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{{ $msg->replies_count }} Replies</span>
                            </div>
                        </div>
                    @endif

                    <p class="text-gray-700 text-xs sm:text-sm font-normal mb-3 break-words whitespace-pre-line">{{ Str::limit($msg->content, 510) }}</p>
                    
                    <div class="mt-4 flex justify-between items-center text-xs">
                        <span class="text-gray-400">{{ $msg->created_at->diffForHumans() }}</span>
                        <a href="{{ route('message.show', $msg->id) }}" class="text-blue-500 hover:underline font-semibold">View Details</a>
                    </div>
                </div>
            @empty
                <p class="text-center text-gray-400 mt-4 text-xs sm:text-sm">No messages yet. Be the first!</p>
            @endforelse
        </div>

        <div class="mt-6">
            {{ $messages->links() }}
        </div>
    </div>

    @if(session('profanity_warning'))
    <script>
        window.addEventListener('DOMContentLoaded', function() {
            alert("⚠️ System Warning:\n\n{{ session('profanity_warning') }}");
        });
    </script>
    @endif

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
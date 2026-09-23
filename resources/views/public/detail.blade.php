@extends('layouts.app')

@section('title', 'Message Detail')

@section('content')
    <div class="w-full max-w-md px-2 sm:px-0">
        <a href="{{ route('home') }}" class="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 mb-4 inline-block text-xs font-semibold shadow-sm transition">
            Back
        </a>

        @if (session('success'))
            <div class="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-semibold text-sm">
                {{ session('success') }}
            </div>
        @endif

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 relative overflow-hidden">
            <p class="text-xs text-gray-400 mb-2">Anonymous Message • {{ $message->created_at->diffForHumans() }}</p>
            <p class="text-gray-700 text-sm mb-3 break-words whitespace-pre-line">{{ $message->content }}</p>

            @auth
                <form action="{{ route('message.destroy', $message->id) }}" method="POST" class="absolute top-4 right-4" onsubmit="return confirm('Are you sure you want to delete this message and all its replies?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 p-2 rounded">
                        Delete Message
                    </button>
                </form>
            @endauth
        </div>

        <div class="space-y-4 mb-8">
            <h3 class="font-bold text-gray-700 text-sm ml-1">Replies ({{ $message->replies->count() }}):</h3>
            
            @forelse($message->replies as $reply)
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                    
                    <p class="text-xs text-gray-400 mb-2">Anonymous Reply • {{ $reply->created_at->diffForHumans() }}</p>
                    <p class="text-gray-700 text-sm mb-3 break-words whitespace-pre-line">{{ $reply->content }}</p>

                    @auth
                        <form action="{{ route('reply.destroy', $reply->id) }}" method="POST" class="absolute top-4 right-4" onsubmit="return confirm('Delete this reply?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 p-2 rounded">
                                Delete
                            </button>
                        </form>
                    @endauth
                </div>
            @empty
                <p class="text-center text-gray-400 text-sm">No replies yet.</p>
            @endforelse
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-10">
            <form action="{{ route('message.reply', $message->id) }}" method="POST" onsubmit="disableReplyButton(this)">
                @csrf
                <textarea name="content" rows="2" 
                    onkeydown="if(event.key === 'Enter' && !event.shiftKey){ event.preventDefault(); if(this.form.checkValidity()) this.form.submit(); }"
                    class="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" 
                    placeholder="Write your reply here... (Press Enter to send)" required>{{ old('content') }}</textarea>
                
                @error('content')
                    <p class="text-red-500 text-xs mt-1 font-semibold">{{ $message }}</p>
                @enderror
                
                <button type="submit" 
                    class="mt-2 w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm flex items-center justify-center gap-2">
                    <span>Send Reply</span>
                </button>
            </form>
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
        function disableReplyButton(form) {
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = 'Sending...';
            btn.classList.add('opacity-70', 'cursor-not-allowed');
        }
    </script>
@endsection
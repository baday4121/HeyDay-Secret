@if ($paginator->hasPages())
    <nav role="navigation" aria-label="{{ __('Pagination Navigation') }}" class="flex items-center justify-between">
        <div class="flex justify-between items-center w-full">
            
            {{-- Tombol Previous --}}
            @if ($paginator->onFirstPage())
                <span class="relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 cursor-not-allowed rounded-lg">
                    {!! __('&laquo; Previous') !!}
                </span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" class="relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition">
                    {!! __('&laquo; Previous') !!}
                </a>
            @endif

            {{-- Nomor Halaman (Opsional, atau ringkasan posisi) --}}
            <span class="text-xs text-gray-500 font-medium">
                Page <span class="font-bold text-gray-700">{{ $paginator->currentPage() }}</span> of <span class="font-bold text-gray-700">{{ $paginator->lastPage() }}</span>
            </span>

            {{-- Tombol Next --}}
            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" class="relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition">
                    {!! __('Next &raquo;') !!}
                </a>
            @else
                <span class="relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 cursor-not-allowed rounded-lg">
                    {!! __('Next &raquo;') !!}
                </span>
            @endif

        </div>
    </nav>
@endif
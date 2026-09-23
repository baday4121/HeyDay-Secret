<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Secret Message')</title>
    @yield('meta')
    <script src="https://cdn.tailwindcss.com"></script>

    @php
        $randomPreviews = [
            'preview/preview-1.jpeg', 
            'preview/preview-2.jpeg', 
            'preview/preview-3.jpeg', 
            'preview/preview-4.jpeg', 
            'preview/preview-5.jpeg'
        ];
        $selectedPreview = asset($randomPreviews[array_rand($randomPreviews)]);
    @endphp

    <meta property="og:title" content="HeyDay Secret">
    <meta property="og:description" content="Tell me a secret, or just drop a random thought. I won't know who you are!">
    <meta property="og:image" content="{{ $selectedPreview }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="HeyDay Secret">
    <meta name="twitter:description" content="Tell me a secret, or just drop a random thought. I won't know who you are!">
    <meta name="twitter:image" content="{{ $selectedPreview }}">
</head>
<body class="bg-gray-100 flex flex-col min-h-screen text-gray-800 antialiased">
    
    @include('layouts.navbar')

    <main class="flex-grow flex flex-col items-center pt-8 px-4 pb-12 w-full">
        @yield('content')
    </main>

    @include('layouts.footer')

    @stack('scripts')
</body>
</html>
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Reply;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\RateLimiter;
use App\Services\TelegramService;

class MessageController extends Controller
{
    protected $telegram;

    public function __construct(TelegramService $telegram)
    {
        $this->telegram = $telegram;
    }

    public function index()
    {
        $messages = Message::orderBy('created_at', 'desc')->paginate(25);
        return view('public.send-message', compact('messages'));
    }

    public function store(Request $request)
    {
        $request->validate(['content' => 'required|string']);

        $ip = $request->ip();
        $content = $request->content;

        $isDuplicate = Message::where('ip_address', $ip)
            ->where('content', $content)
            ->where('created_at', '>=', now()->subSeconds(3))
            ->exists();

        if ($isDuplicate) {
            return redirect()->back()->with('success', 'Your secret message has been sent successfully!');
        }

        $key = 'send-message:' . $ip;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'content' => "Whoops, you're sending messages too fast! Please wait {$seconds} seconds."
            ])->withInput();
        }
        RateLimiter::hit($key, 60);

        $location = $this->getLocation($request, $ip);
        $device = $this->getDeviceInfo($request->userAgent());

        Message::create([
            'content' => $content,
            'ip_address' => $ip,
            'location' => $location,
            'user_agent' => $device
        ]);

        $this->telegram->sendNotification('Secret Message', $content, $location, $ip, $device);

        return redirect()->back()->with('success', 'Your secret message has been sent successfully!');
    }

    public function show($id)
    {
        $message = Message::with('replies')->findOrFail($id);
        
        return view('public.detail', compact('message'));
    }

    public function storeReply(Request $request, $id)
    {
        $request->validate(['content' => 'required|string']);

        $ip = $request->ip();
        $content = $request->content;

        $isDuplicate = Reply::where('message_id', $id)
            ->where('ip_address', $ip)
            ->where('content', $content)
            ->where('created_at', '>=', now()->subSeconds(3))
            ->exists();

        if ($isDuplicate) {
            return back()->with('success', 'Reply has been sent successfully!');
        }

        $key = 'send-reply:' . $ip;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'content' => "Too many replies! Please wait {$seconds} seconds."
            ])->withInput();
        }
        RateLimiter::hit($key, 60);

        $message = Message::findOrFail($id);

        $location = $this->getLocation($request, $ip);
        $device = $this->getDeviceInfo($request->userAgent());

        Reply::create([
            'message_id' => $message->id,
            'content' => $content,
            'ip_address' => $ip,
            'location' => $location,
            'user_agent' => $device,
            'is_read' => false
        ]);

        $this->telegram->sendNotification('Anonymous Reply', $content, $location, $ip, $device);

        return back()->with('success', 'Reply has been sent successfully!');
    }

    public function destroy($id)
    {
        if (Auth::check()) {
            Message::findOrFail($id)->delete();
            return back()->with('success', 'The message and its replies have been deleted!');
        }
        return abort(403, 'Access denied.');
    }

    public function destroyReply($id)
    {
        if (Auth::check()) {
            Reply::findOrFail($id)->delete();
            return back()->with('success', 'Reply has been successfully deleted!');
        }
        return abort(403, 'Access denied.');
    }

    public function markAsRead($id)
    {
        if (Auth::check()) {
            $message = Message::findOrFail($id);
            $message->update(['is_read' => true]);
            return back()->with('success', 'Message marked as read!');
        }
        return abort(403, 'Access denied.');
    }

    private function getLocation(Request $request, $ip)
    {
        $city = $request->header('x-vercel-ip-city');
        $region = $request->header('x-vercel-ip-country-region');
        $country = $request->header('x-vercel-ip-country');

        if (empty($city)) $city = $request->server('HTTP_X_VERCEL_IP_CITY');
        if (empty($region)) $region = $request->server('HTTP_X_VERCEL_IP_COUNTRY_REGION');
        if (empty($country)) $country = $request->server('HTTP_X_VERCEL_IP_COUNTRY');

        if (!empty($city) && !empty($country)) {
            $regionText = !empty($region) ? ', ' . $region : '';
            return "{$city}{$regionText} - {$country}";
        }

        if ($ip === '127.0.0.1' || $ip === '::1') {
            return 'Localhost (Local Machine)';
        }

        try {
            $response = Http::timeout(5)->get("https://ipwho.is/{$ip}");
            if ($response->successful() && $response['success'] === true) {
                return $response['city'] . ', ' . $response['region'] . ' - ' . $response['country'];
            }
        } catch (\Exception $e) {
            return 'Location API Blocked';
        }

        return 'Location Not Found';
    }

    private function getDeviceInfo($rawUserAgent)
    {
        $agent = new Agent();
        $agent->setUserAgent($rawUserAgent);

        $device = $agent->device() ?: 'Desktop';
        $platform = $agent->platform() ?: 'Unknown OS';
        $browser = $agent->browser() ?: 'Unknown Browser';

        return "{$device} | OS: {$platform} | Browser: {$browser} || RAW: {$rawUserAgent}";
    }
}
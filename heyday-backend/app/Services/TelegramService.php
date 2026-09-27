<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TelegramService
{
    public function sendNotification($type, $content, $location, $ip, $device)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            return false;
        }

        $cleanDevice = $device;
        if (str_contains($device, '||')) {
            $parts = explode('||', $device);
            $cleanDevice = trim($parts[0]);
        }

        $text = "🔔 <b>New {$type}!</b>\n\n";
        $text .= "💬 <b>Message:</b>\n<i>{$content}</i>\n\n";
        $text .= "📍 <b>Location:</b> {$location}\n";
        $text .= "🌐 <b>IP:</b> {$ip}\n";
        $text .= "📱 <b>Device:</b> {$cleanDevice}";

        try {
            $response = Http::timeout(5)->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
}
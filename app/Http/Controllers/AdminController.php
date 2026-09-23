<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class AdminController extends Controller
{
    public function dashboard()
    {
        $messages = Message::orderBy('created_at', 'desc')->paginate(25);
    
        return view('admin.dashboard', compact('messages'));
    }

    public function showDetail($id)
    {
        $message = Message::with('replies')->findOrFail($id);
        
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        $message->replies()->where('is_read', false)->update(['is_read' => true]);

        return view('admin.detail', compact('message'));
    }
}
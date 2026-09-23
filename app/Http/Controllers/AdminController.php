<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Reply;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $status = $request->get('tab', 'inbox');

        $messages = collect();
        $archivedReplies = collect();

        if ($status === 'archived-messages') {
            $messages = Message::where('is_archived', true)
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        } elseif ($status === 'archived-replies') {
            $archivedReplies = Reply::with('message')
                ->where('is_archived', true)
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        } else {
            $messages = Message::where('is_archived', false)
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        }
    
        $archivedMessagesCount = Message::where('is_archived', true)->count();
        $archivedRepliesCount = Reply::where('is_archived', true)->count();
        $totalArchived = $archivedMessagesCount + $archivedRepliesCount;

        return view('admin.dashboard', compact(
            'messages', 
            'archivedReplies', 
            'status', 
            'totalArchived', 
            'archivedMessagesCount', 
            'archivedRepliesCount'
        ));
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

    public function toggleArchive($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_archived' => !$message->is_archived]);

        $statusText = $message->is_archived ? 'The message has been moved to the archive.' : 'The message has been restored from the archive.';
        return back()->with('success', "Succeed: {$statusText}!");
    }

    public function toggleReplyArchive($id)
    {
        $reply = Reply::findOrFail($id);
        $reply->update(['is_archived' => !$reply->is_archived]);

        return back()->with('success', 'Reply archive status successfully updated!');
    }
}
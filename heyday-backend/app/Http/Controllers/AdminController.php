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

        $messages = null;
        $archivedReplies = null;

        if ($status === 'archived-messages') {
            $messages = Message::where('is_archived', true)
                ->withCount('replies')
                ->withExists(['replies as has_unread_replies' => function ($query) {
                    $query->where('is_read', false);
                }])
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        } elseif ($status === 'archived-replies') {
            $archivedReplies = Reply::with('message')
                ->where('is_archived', true)
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        } else {
            $messages = Message::where('is_archived', false)
                ->withCount('replies')
                ->withExists(['replies as has_unread_replies' => function ($query) {
                    $query->where('is_read', false);
                }])
                ->orderBy('created_at', 'desc')
                ->paginate(25);
        }
    
        $archivedMessagesCount = Message::where('is_archived', true)->count();
        $archivedRepliesCount = Reply::where('is_archived', true)->count();
        $totalArchived = $archivedMessagesCount + $archivedRepliesCount;

        return response()->json([
            'success' => true,
            'data' => [
                'status' => $status,
                'messages' => $messages,
                'archivedReplies' => $archivedReplies,
                'stats' => [
                    'totalArchived' => $totalArchived,
                    'archivedMessagesCount' => $archivedMessagesCount,
                    'archivedRepliesCount' => $archivedRepliesCount
                ]
            ]
        ], 200);
    }

    public function showDetail($id)
    {
        $message = Message::with('replies')->findOrFail($id);
        
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        $message->replies()->where('is_read', false)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'data' => $message
        ], 200);
    }

    public function toggleArchive($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_archived' => !$message->is_archived]);

        $statusText = $message->is_archived ? 'The message has been moved to the archive.' : 'The message has been restored from the archive.';
        
        return response()->json([
            'success' => true,
            'message' => "Succeed: {$statusText}!"
        ], 200);
    }

    public function toggleReplyArchive($id)
    {
        $reply = Reply::findOrFail($id);
        $reply->update(['is_archived' => !$reply->is_archived]);

        return response()->json([
            'success' => true,
            'message' => 'Reply archive status successfully updated!'
        ], 200);
    }
}
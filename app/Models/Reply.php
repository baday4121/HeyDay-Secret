<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id', 
        'content', 
        'ip_address', 
        'location', 
        'user_agent', 
        'is_read',
        'is_archived'
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
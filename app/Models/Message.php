<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'is_read', 'ip_address', 'location', 'user_agent'];
    public function replies()
    {
        return $this->hasMany(Reply::class);
    }
}

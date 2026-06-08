<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRedemption extends Model
{
    protected $table = 'reward_redemptions';

    protected $fillable = [
        'user_id',
        'reward_code',
        'title',
        'points',
        'status',
        'metadata',
        'redeemed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'redeemed_at' => 'datetime',
        'points' => 'integer',
    ];
}

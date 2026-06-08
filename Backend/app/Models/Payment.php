<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'payment_method',
        'currency',
        'status',
        'service_type',
        'service_id',
        'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
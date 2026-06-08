<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointLedger extends Model
{
    protected $table = 'points_ledger';

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'points',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'points' => 'integer',
    ];
}

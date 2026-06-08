<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherVerification extends Model
{
    protected $fillable = [
        'user_id',
        'id_document',
        'certificates',
        'payment_method',
        'iban',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
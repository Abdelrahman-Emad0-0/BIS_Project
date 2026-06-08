<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exchange extends Model
{
    protected $fillable = [
        'requester_id',
        'partner_id',
        'requester_skill_id',
        'partner_skill_id',
        'status',
        'message',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function partner()
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    public function requesterSkill()
    {
        return $this->belongsTo(Skill::class, 'requester_skill_id');
    }

    public function partnerSkill()
    {
        return $this->belongsTo(Skill::class, 'partner_skill_id');
    }
}
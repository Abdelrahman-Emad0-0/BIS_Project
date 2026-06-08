<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Report;
use App\Models\Enrollment;
use App\Models\UserSkill;
use App\Models\Skill;
use App\Models\Verification;
use App\Models\PaymentMethod;
use App\Models\Exchange;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'gender',
        'date_of_birth',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
    public function enrollments()
{
    return $this->hasMany(Enrollment::class);
}
public function userSkills()
{
    return $this->hasMany(UserSkill::class);
}

public function teachSkills()
{
    return $this->belongsToMany(Skill::class, 'user_skills')
        ->withPivot('type')
        ->wherePivot('type', 'teach')
        ->withTimestamps();
}

public function learnSkills()
{
    return $this->belongsToMany(Skill::class, 'user_skills')
        ->withPivot('type')
        ->wherePivot('type', 'learn')
        ->withTimestamps();
}
public function verification()
{
    return $this->hasOne(Verification::class);
}
public function paymentMethod()
{
    return $this->hasOne(PaymentMethod::class);
}
public function sentExchanges()
{
    return $this->hasMany(Exchange::class, 'requester_id');
}

public function receivedExchanges()
{
    return $this->hasMany(Exchange::class, 'partner_id');
}
}
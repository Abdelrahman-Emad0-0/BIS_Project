<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'teacher_id',
        'title',
        'category',
        'description',
        'price',
        'capacity',
        'duration',
        'created_date',
        'ended_date',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function sections()
{
    return $this->hasMany(CourseSection::class);
}

public function outcomes()
{
    return $this->hasMany(CourseOutcome::class);
}
}
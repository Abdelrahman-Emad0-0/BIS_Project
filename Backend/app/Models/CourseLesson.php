<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseLesson extends Model
{
    protected $fillable = [
        'section_id',
        'title',
        'type',
        'duration',
        'content_url',
        'status',
        'sort_order'
    ];

    public function section()
    {
        return $this->belongsTo(CourseSection::class, 'section_id');
    }
}
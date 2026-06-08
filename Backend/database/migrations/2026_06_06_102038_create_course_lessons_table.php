<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('section_id')
                ->constrained('course_sections')
                ->cascadeOnDelete();

            $table->string('title');

            $table->enum('type', [
                'video',
                'article',
                'quiz'
            ]);

            $table->string('duration')->nullable();
            $table->string('content_url')->nullable();

            $table->string('status')->default('published');

            $table->integer('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_lessons');
    }
};
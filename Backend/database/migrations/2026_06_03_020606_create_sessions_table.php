<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teaching_sessions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();

            $table->foreignId('partner_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('title')->nullable();
            $table->string('type')->default('session'); // session, course, meeting, etc.

            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();

            $table->string('status')->default('scheduled'); // scheduled, confirmed, completed, cancelled

            $table->timestamps();

            $table->index(['instructor_id', 'student_id', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teaching_sessions');
    }
};
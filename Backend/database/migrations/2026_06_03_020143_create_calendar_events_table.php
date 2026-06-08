<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('subtitle')->nullable();

            $table->enum('type', [
                'session',
                'course',
                'meeting',
                'deadline',
                'reminder',
                'event'
            ]);

            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();

            $table->text('notes')->nullable();

            $table->string('color')->nullable();

            $table->string('status')->default('scheduled');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
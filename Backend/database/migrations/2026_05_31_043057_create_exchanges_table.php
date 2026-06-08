<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exchanges', function (Blueprint $table) {
            $table->id();

            $table->foreignId('requester_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('partner_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('requester_skill_id')
                ->constrained('skills')
                ->onDelete('cascade');

            $table->foreignId('partner_skill_id')
                ->constrained('skills')
                ->onDelete('cascade');

            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed'])
                ->default('pending');

            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchanges');
    }
};
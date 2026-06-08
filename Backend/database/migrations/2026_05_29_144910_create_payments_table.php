<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->string('currency', 10)->default('EGP');
            $table->string('status')->default('pending');

            $table->string('service_type');
            $table->unsignedBigInteger('service_id');

            $table->date('date')->nullable();

            $table->timestamps();

            $table->index(['service_type', 'service_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
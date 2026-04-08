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
        Schema::create('contributions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->enum('status', ['pending', 'commented', 'selected', 'rejected'])->default('pending');
            $table->boolean('is_selected')->default(false);
            $table->boolean('terms_accepted')->default(false);
            $table->foreignId('academic_year_id')->constrained('academic_years');
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('faculty_id')->constrained('faculty');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contributions');
    }
};

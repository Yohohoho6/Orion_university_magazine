<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('notifications', 'contribution_id')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->foreignId('contribution_id')
                      ->nullable()
                      ->after('user_id')
                      ->constrained()
                      ->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('notifications', 'contribution_id')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->dropForeign(['contribution_id']);
                $table->dropColumn('contribution_id');
            });
        }
    }
};
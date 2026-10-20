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
        Schema::create('inventaris_perangkats', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 50)->unique();
            $table->string('nama');
            $table->enum('kategori', ['Laptop', 'Printer', 'Jaringan']);
            $table->string('unit');
            $table->date('tanggal');
            $table->unsignedBigInteger('nilai')->default(0);
            $table->enum('status', ['Tersedia', 'Digunakan', 'Perbaikan']);
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventaris_perangkats');
    }
};

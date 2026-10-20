<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventarisPerangkat extends Model
{
    public const KATEGORI = ['Laptop', 'Printer', 'Jaringan'];

    public const STATUS = ['Tersedia', 'Digunakan', 'Perbaikan'];

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'unit',
        'tanggal',
        'nilai',
        'status',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date:Y-m-d',
            'nilai' => 'integer',
        ];
    }
}

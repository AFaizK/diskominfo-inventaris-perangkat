<?php

namespace Database\Seeders;

use App\Models\InventarisPerangkat;
use Illuminate\Database\Seeder;

class InventarisPerangkatSeeder extends Seeder
{
    /**
     * Seed 20 data contoh dari dataset.json.
     */
    public function run(): void
    {
        $dataset = json_decode(file_get_contents(__DIR__.'/data/inventaris_perangkat.json'), true);

        foreach ($dataset['data'] as $item) {
            InventarisPerangkat::updateOrCreate(
                ['kode' => $item['kode']],
                [
                    'nama' => $item['nama'],
                    'kategori' => $item['kategori'],
                    'unit' => $item['unit'],
                    'tanggal' => $item['tanggal'],
                    'nilai' => $item['nilai'],
                    'status' => $item['status'],
                    'catatan' => $item['catatan'] !== '' ? $item['catatan'] : null,
                ]
            );
        }
    }
}

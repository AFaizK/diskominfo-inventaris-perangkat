<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventarisPerangkat;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InventarisPerangkatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => InventarisPerangkat::orderBy('kode')->get(),
            'meta' => [
                'kategori' => InventarisPerangkat::KATEGORI,
                'status' => InventarisPerangkat::STATUS,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $item = InventarisPerangkat::create($this->validated($request));

        return response()->json(['message' => 'Data berhasil ditambahkan.', 'data' => $item], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventarisPerangkat $inventarisPerangkat)
    {
        return response()->json(['data' => $inventarisPerangkat]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InventarisPerangkat $inventarisPerangkat)
    {
        $inventarisPerangkat->update($this->validated($request, $inventarisPerangkat->id));

        return response()->json(['message' => 'Data berhasil diperbarui.', 'data' => $inventarisPerangkat]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventarisPerangkat $inventarisPerangkat)
    {
        $inventarisPerangkat->delete();

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'kode' => ['required', 'string', 'max:50', Rule::unique('inventaris_perangkats', 'kode')->ignore($ignoreId)],
            'nama' => ['required', 'string', 'max:255'],
            'kategori' => ['required', Rule::in(InventarisPerangkat::KATEGORI)],
            'unit' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date_format:Y-m-d'],
            'nilai' => ['required', 'integer', 'min:0'],
            'status' => ['required', Rule::in(InventarisPerangkat::STATUS)],
            'catatan' => ['nullable', 'string'],
        ], [
            'required' => ':attribute wajib diisi.',
            'unique' => ':attribute sudah digunakan.',
            'in' => ':attribute tidak sesuai pilihan.',
            'date_format' => ':attribute harus berupa tanggal yang valid (YYYY-MM-DD).',
            'integer' => ':attribute harus berupa angka.',
            'min' => ':attribute minimal :min.',
            'max' => ':attribute maksimal :max karakter.',
        ], [
            'kode' => 'Kode',
            'nama' => 'Nama',
            'kategori' => 'Kategori',
            'unit' => 'Unit',
            'tanggal' => 'Tanggal',
            'nilai' => 'Harga perolehan',
            'status' => 'Status',
            'catatan' => 'Catatan',
        ]);
    }
}

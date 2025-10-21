<?php

namespace App\Http\Controllers\Absensi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;



class AbsenHarianController extends Controller
{
    /**
     * 🔹 Ambil daftar karyawan
     */
    public function getKaryawan()
    {
        $data = DB::table('primary_karyawan')
            ->select('id', 'nama', 'bagian', 'sub_bagian')
            ->orderBy('bagian')
            ->orderBy('sub_bagian')
            ->orderBy('nama')
            ->get();

        return response()->json(['data' => $data]);
    }

    /**
     * 🔹 Ambil daftar status absen
     */
    public function getStatusAbsen()
    {
        $data = DB::table('primary_karyawan_status_absen')
            ->where('aktif', 1)
            ->orderBy('kategori')
            ->get(['id', 'kode', 'nama', 'kategori', 'warna']);

        return response()->json(['data' => $data]);
    }

    /**
     * 🔹 Simpan multi data absen harian
     */
    /**
     * 🔹 Simpan multi data absen harian
     */
    public function store(Request $request)
    {
        $rows = $request->input('data', []);

        if (!is_array($rows) || count($rows) === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Data absen kosong'
            ], 422);
        }

        // Mapping kode -> id
        $statusMap = DB::table('primary_karyawan_status_absen')->pluck('id', 'kode');
        $karyawanMap = DB::table('primary_karyawan')->pluck('id', 'nama');

        $insertData = [];
        $failedRows = [];

        foreach ($rows as $index => $r) {
            $validator = Validator::make($r, [
                'nama' => 'required|string',
                'tanggal' => 'required|date',
                'kode_absen' => 'required|string',
                'catatan' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                $failedRows[] = [
                    'row' => $r,
                    'error' => 'Validasi gagal',
                ];
                continue;
            }

            $karyawanId = $karyawanMap[$r['nama']] ?? null;
            $statusId = $statusMap[$r['kode_absen']] ?? null;

            if (!$karyawanId || !$statusId) {
                $failedRows[] = [
                    'row' => $r,
                    'error' => 'Nama karyawan atau status absen tidak valid',
                ];
                continue;
            }

            // Cek duplikasi
            $alreadyExists = DB::table('primary_karyawan_absensi')
                ->where('tanggal', $r['tanggal'])
                ->where('karyawan_id', $karyawanId)
                ->exists();

            if ($alreadyExists) {
                $failedRows[] = [
                    'row' => $r,
                    'error' => 'Data duplikat, sudah ada',
                ];
                continue;
            }

            $insertData[] = [
                'tanggal' => $r['tanggal'],
                'karyawan_id' => $karyawanId,
                'status_absen_id' => $statusId,
                'catatan' => $r['catatan'] ?? null,
                'metode_absen' => 'Manual',
                'verified_status' => 'Pending',
                'created_by' => auth()->id() ?? 1, // default user id = 1 jika auth gagal
                'created_at' => now(),
            ];
        }

        // Simpan ke database
        if (!empty($insertData)) {
            try {
                DB::table('primary_karyawan_absensi')->insert($insertData);

                // Log untuk debug
                Log::info('Insert data absen:', $insertData);
            } catch (\Exception $e) {
                Log::error('Gagal insert absen:', ['error' => $e->getMessage()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menyimpan data: ' . $e->getMessage()
                ], 500);
            }
        }

        return response()->json([
            'success' => !empty($insertData),
            'message' => count($insertData) . ' baris berhasil disimpan, ' . count($failedRows) . ' gagal',
            'data' => $insertData,
            'failed' => $failedRows,
        ]);
    }

    /**
     * 🔹 Ambil data absen harian
     */
    public function index(Request $request)
    {
        $tanggal = $request->input('tanggal', now()->toDateString());

        $data = DB::table('primary_karyawan_absensi as a')
            ->join('primary_karyawan as k', 'a.karyawan_id', '=', 'k.id')
            ->join('primary_karyawan_status_absen as s', 'a.status_absen_id', '=', 's.id')
            ->select(
                'a.id',
                'a.tanggal',
                'k.nama',
                'k.bagian',
                'k.sub_bagian as subbagian', // rename agar sama React
                's.kode as kode_absen',       // rename agar sama React
                'a.catatan',
                's.warna'
            )
            ->whereDate('a.tanggal', $tanggal)
            ->orderBy('k.bagian')
            ->orderBy('k.sub_bagian')
            ->orderBy('k.nama')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function getBagian()
    {
        $bagian = DB::table('primary_karyawan')
            ->select('bagian')
            ->whereNotNull('bagian')
            ->distinct()
            ->orderBy('bagian')
            ->pluck('bagian'); // hasil array ["Primary", "Proses Cengkeh", ...]
        
        return response()->json(['data' => $bagian]);
    }

    /**
     * 🔹 Ambil daftar subbagian berdasarkan bagian
     */
    public function getSubBagian(Request $request)
    {
        $bagian = $request->input('bagian');

        if (!$bagian) {
            return response()->json(['data' => []]);
        }

        $subbagian = DB::table('primary_karyawan')
            ->where('bagian', $bagian)
            ->distinct()
            ->pluck('sub_bagian');

        return response()->json(['data' => $subbagian]);
    }

}

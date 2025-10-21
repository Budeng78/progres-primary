<?php
// app/Http/Controllers/Personalia/TenakerController.php

namespace App\Http\Controllers\Personalia;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;


class TenakerController extends Controller
{
    /**
     * Ambil semua data karyawan
     */
    public function index()
    {
        $employees = DB::table('primary_karyawan')->get()->map(function ($employee) {
            $data = (array) $employee;

            if (!empty($data['foto_formal'])) {
                $data['foto_formal'] = asset('storage/' . $data['foto_formal']);
            }

            return $data;
        });

        return response()->json([
            'success' => true,
            'data' => $employees,
        ]);
    }

    /**
     * Detail karyawan berdasarkan id
     */
    public function show($id)
    {
        $employee = DB::table('primary_karyawan')->where('id', $id)->first();

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Data karyawan tidak ditemukan'], 404);
        }

        $employee->foto_formal = $employee->foto_formal ? asset('storage/' . $employee->foto_formal) : null;

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    /**
     * Tambah karyawan baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'no_induk_absen' => 'required|unique:primary_karyawan,no_induk_absen',
            'nama'             => 'nullable|string|max:100',
            'status_upah'      => 'nullable|string|max:50',
            'status_karyawan'  => 'nullable|string|max:50',
            'masuk_kerja'      => 'nullable|date',
            'ditetapkan'       => 'nullable|date',
            'bagian'           => 'nullable|string|max:100',
            'sub_bagian'       => 'nullable|string|max:100',
            'kelompok_kerja'   => 'nullable|string|max:100',
            'pekerjaan'        => 'nullable|string|max:100',
            'alamat_rt_rw'     => 'nullable|string|max:50',
            'alamat_desa'      => 'nullable|string|max:100',
            'alamat_kecamatan' => 'nullable|string|max:100',
            'alamat_kabupaten' => 'nullable|string|max:100',
            'no_nik'           => 'nullable|string|max:20',
            'no_kk'            => 'nullable|string|max:20',
            'kelamin'          => 'nullable|string|max:10',
            'tempat_lahir'     => 'nullable|string|max:100',
            'tanggal_lahir'    => 'nullable|date',
            'pendidikan'       => 'nullable|string|max:50',
            'disabilitas'      => 'nullable|string|max:50',
            'kpi'              => 'nullable|string|max:50',
            'no_bpjs_kes'      => 'nullable|string|max:30',
            'no_kpj'           => 'nullable|string|max:30',
            'no_hp'            => 'nullable|string|max:20',
            'whatsapp_number'  => 'nullable|string|max:255',
            'email'            => 'nullable|email|max:100',
            'bank'             => 'nullable|string|max:50',
            'no_bank'          => 'nullable|string|max:50',    
            'vaksin'           => 'nullable|string|max:100',
            'riwayat_kesehatan'=> 'nullable|string',
        ]);


        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->except('foto_formal');

            if ($request->hasFile('foto_formal')) {
                $file = $request->file('foto_formal');
                $namaFile = time().'_'.Str::slug($request->input('nama')).'.'.$file->extension();
                $path = $file->storeAs('karyawan/foto_formal', $namaFile, 'public');
                $data['foto_formal'] = $path;
            }

            $id = DB::table('primary_karyawan')->insertGetId($data);

            $newEmployee = DB::table('primary_karyawan')->where('id', $id)->first();

            return response()->json([
                'success' => true,
                'message' => 'Data karyawan berhasil ditambahkan.',
                'data' => $newEmployee
            ], 201);

        } catch (\Exception $e) {
            Log::error('Store Karyawan Error: '.$e->getMessage(), ['request' => $request->all()]);
            return response()->json(['success' => false, 'message' => 'Gagal menambahkan data karyawan.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update karyawan
     */
    public function update(Request $request, $id)
    {
        $karyawan = DB::table('primary_karyawan')->where('id', $id)->first();
        if (!$karyawan) {
            return response()->json([
                'success' => false,
                'message' => 'Data karyawan tidak ditemukan.'
            ], 404);
        }

        // 🧹 NORMALISASI DATA
        $cleanData = collect($request->all())->map(function ($v) {
            return ($v === 'null' || $v === '' || $v === []) ? null : $v;
        })->toArray();

        $request->merge($cleanData);

        // ✅ VALIDASI
        $validator = Validator::make($request->all(), [
            'no_induk_absen' => [
                'required',
                Rule::unique('primary_karyawan', 'no_induk_absen')->ignore($id, 'id'),
            ],
            'nama'             => 'nullable|string|max:100',
            'status_upah'      => 'nullable|string|max:50',
            'status_karyawan'  => 'nullable|string|max:50',
            'masuk_kerja'      => 'nullable|date',
            'ditetapkan'       => 'nullable|date',
            'bagian'           => 'nullable|string|max:100',
            'sub_bagian'       => 'nullable|string|max:100',
            'kelompok_kerja'   => 'nullable|string|max:100',
            'pekerjaan'        => 'nullable|string|max:100',
            'alamat_rt_rw'     => 'nullable|string|max:50',
            'alamat_desa'      => 'nullable|string|max:100',
            'alamat_kecamatan' => 'nullable|string|max:100',
            'alamat_kabupaten' => 'nullable|string|max:100',
            'no_nik'           => 'nullable|string|max:20',
            'no_kk'            => 'nullable|string|max:20',
            'kelamin'          => 'nullable|string|max:10',
            'tempat_lahir'     => 'nullable|string|max:100',
            'tanggal_lahir'    => 'nullable|date',
            'pendidikan'       => 'nullable|string|max:50',
            'disabilitas'      => 'nullable|string|max:50',
            'kpi'              => 'nullable|string|max:50',
            'no_bpjs_kes'      => 'nullable|string|max:30',
            'no_kpj'           => 'nullable|string|max:30',
            'no_hp'            => 'nullable|string|max:20',
            'whatsapp_number'  => 'nullable|string|max:255',
            'email'            => 'nullable|email|max:100',
            'bank'             => 'nullable|string|max:50',
            'no_bank'          => 'nullable|string|max:50',
            'vaksin'           => 'nullable|string|max:100',
            'riwayat_kesehatan'=> 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Validator gagal update karyawan:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // ✅ HINDARI FIELD TEKNIS
            $data = $request->except(['foto_formal', '_method', '_token']);

            // ✅ HANDLE FOTO
            if ($request->hasFile('foto_formal')) {
                if ($karyawan->foto_formal) {
                    Storage::disk('public')->delete($karyawan->foto_formal);
                }

                $file = $request->file('foto_formal');
                $namaFile = time().'_'.Str::slug($request->input('nama', $karyawan->nama)).'.'.$file->extension();
                $path = $file->storeAs('karyawan/foto_formal', $namaFile, 'public');
                $data['foto_formal'] = $path;
            }

            DB::table('primary_karyawan')->where('id', $id)->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Data karyawan berhasil diperbarui.'
            ]);
        } catch (\Exception $e) {
            Log::error('Update Karyawan Error: '.$e->getMessage(), ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal update karyawan',
                'error'   => $e->getMessage()
            ], 500);
        }
    }






    /**
     * Hapus karyawan
     */
    public function destroy($id)
    {
        $karyawan = DB::table('primary_karyawan')->where('id', $id)->first();
        if (!$karyawan) {
            return response()->json(['success' => false, 'message' => 'Data karyawan tidak ditemukan.'], 404);
        }

        try {
            if ($karyawan->foto_formal) Storage::disk('public')->delete($karyawan->foto_formal);
            DB::table('primary_karyawan')->where('id', $id)->delete();

            return response()->json(['success' => true, 'message' => 'Data karyawan berhasil dihapus.']);

        } catch (\Exception $e) {
            Log::error('Destroy Karyawan Error: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal menghapus data karyawan.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload foto formal karyawan
     */


    public function uploadFormalPhoto(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'id'           => 'required|exists:primary_karyawan,id',
            'foto_formal'  => 'required|image|mimes:jpeg,png,jpg|max:200048',
        ]);

        // 2. Ambil data karyawan
        $employee = DB::table('primary_karyawan')
            ->where('id', $request->id)
            ->select('no_induk_absen', 'nama', 'foto_formal')
            ->first();

        if (!$employee) {
            return response()->json(['message' => 'Data Karyawan tidak ditemukan.'], 404);
        }

        // 3. Proses File dan Penamaan
        $photo = $request->file('foto_formal');
        $prefix = Str::slug($employee->no_induk_absen . '-' . $employee->nama);
        $filename = $prefix . '-' . Str::uuid() . '.webp';

        // 4. Resize & simpan ke storage/app/public/karyawan/formal
        $manager = new ImageManager(new Driver());
        $image = $manager->read($photo)->scale(width: 1000)->toWebp(quality: 80);

        // Simpan ke disk 'public'
        $relativePath = 'karyawan/formal/' . $filename;
        Storage::disk('public')->put($relativePath, (string) $image->toString());

        // 5. Hapus foto lama jika ada
        if ($employee->foto_formal) {
            Storage::disk('public')->delete($employee->foto_formal);
        }

        // 6. Update database
        DB::table('primary_karyawan')
            ->where('id', $request->id)
            ->update(['foto_formal' => $relativePath]);

        // 7. Response
        return response()->json([
            'message' => 'Foto formal berhasil diupload & diresize',
            'path'    => $relativePath,
            'url'     => asset('storage/' . $relativePath),
        ]);
    }
}

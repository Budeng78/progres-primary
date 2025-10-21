<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Support\Str;


class ProfileController extends Controller
{
    /**
     * Tampilkan data profil user
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $karyawan = $user->karyawan; // Bisa null jika user biasa

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'whatsapp_number' => $user->whatsapp_number,
                    'foto_profile' => $user->foto_profile_url,
                ],
                'karyawan' => $karyawan ? [
                    'id'              => $karyawan->id,
                    'nama'               => $karyawan->nama,
                    'bagian'             => $karyawan->bagian ?? '-',
                    'sub_bagian'         => $karyawan->sub_bagian ?? '-',
                    'whatsapp_number'    => $karyawan->whatsapp_number ?? '-',
                    'alamat_rt_rw'       => $karyawan->alamat_rt_rw ?? '-',
                    'alamat_desa'        => $karyawan->alamat_desa ?? '-',
                    'alamat_kecamatan'   => $karyawan->alamat_kecamatan ?? '-',
                    'alamat_kabupaten'   => $karyawan->alamat_kabupaten ?? '-',
                    'no_nik'             => $karyawan->no_nik ?? '-',
                    'no_kk'              => $karyawan->no_kk ?? '-',
                    'kelamin'            => $karyawan->kelamin ?? '-',
                    'tempat_lahir'       => $karyawan->tempat_lahir ?? '-',
                    'tanggal_lahir'      => $karyawan->tanggal_lahir ?? '-',
                    'umur'               => $karyawan->umur ?? '-',
                    'pendidikan'         => $karyawan->pendidikan ?? '-',
                    'disabilitas'        => $karyawan->disabilitas ?? '-',
                    'kpi'                => $karyawan->kpi ?? '-',
                    'no_bpjs_kes'        => $karyawan->no_bpjs_kes ?? '-',
                    'no_kpj'             => $karyawan->no_kpj ?? '-',
                    'no_hp'              => $karyawan->no_hp ?? '-',
                    'email'              => $karyawan->email ?? '-',
                    'bank'               => $karyawan->bank ?? '-',
                    'no_bank'            => $karyawan->no_bank ?? '-',
                    'foto_profile'       => $karyawan->foto_profile_url,
                    'foto_formal'        => $karyawan->foto_formal_url,
                    'vaksin'             => $karyawan->vaksin ?? '-',
                    'riwayat_kesehatan'  => $karyawan->riwayat_kesehatan ?? '-',
                ] : null,
            ],
        ]);
    }

    /**
     * Update profile user & karyawan
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $karyawan = $user->karyawan;

        if (!$karyawan) {
            // User biasa
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'nullable|email|max:100',
                'whatsapp_number' => 'nullable|string|max:20',
            ]);
            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profil user berhasil diperbarui',
                'data' => $user
            ]);
        }

        // Karyawan
        $validated = $request->validate([
            'alamat_rt_rw'      => 'nullable|string|max:50',
            'alamat_desa'       => 'nullable|string|max:100',
            'alamat_kecamatan'  => 'nullable|string|max:100',
            'alamat_kabupaten'  => 'nullable|string|max:100',
            'no_nik'            => 'nullable|string|max:20',
            'no_kk'             => 'nullable|string|max:20',
            'kelamin'           => 'nullable|string|max:10',
            'tempat_lahir'      => 'nullable|string|max:100',
            'tanggal_lahir'     => 'nullable|date',
            'umur'              => 'nullable|integer',
            'pendidikan'        => 'nullable|string|max:50',
            'disabilitas'       => 'nullable|string|max:50',
            'kpi'               => 'nullable|string|max:50',
            'no_bpjs_kes'       => 'nullable|string|max:30',
            'no_kpj'            => 'nullable|string|max:30',
            'no_hp'             => 'nullable|string|max:20',
            'whatsapp_number'   => 'nullable|string|max:255',
            'email'             => 'nullable|email|max:100',
            'bank'              => 'nullable|string|max:50',
            'no_bank'           => 'nullable|string|max:50',
            'vaksin'            => 'nullable|string|max:100',
            'riwayat_kesehatan' => 'nullable|string',
        ]);
        $karyawan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil karyawan berhasil diperbarui',
            'data' => $user->load('karyawan'),
        ]);
    }

    /**
     * Update WhatsApp user/karyawan
     */
    public function updateWhatsapp(Request $request, $type)
    {
        $request->validate(['whatsapp_number' => 'required|string|max:20']);
        $user = $request->user();

        if ($type === 'user') {
            $user->whatsapp_number = $request->whatsapp_number;
            $user->save();
        } elseif ($type === 'karyawan') {
            $karyawan = $user->karyawan;
            if (!$karyawan) return response()->json(['message' => 'Data karyawan tidak ditemukan'], 404);
            $karyawan->whatsapp_number = $request->whatsapp_number;
            $karyawan->save();
        } else {
            return response()->json(['message' => 'Tipe tidak valid'], 400);
        }

        return response()->json([
            'message' => 'WhatsApp berhasil diperbarui',
            'whatsapp_number' => $request->whatsapp_number
        ]);
    }

    /**
     * Ubah password user
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Password saat ini salah'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password berhasil diperbarui']);
    }

    /**
     * Upload foto profil user/karyawan
     */
public function uploadFotoProfile(Request $request)
    {
        $request->validate([
            'foto_profile' => 'required|image|mimes:jpeg,png,jpg|max:100120', // max 5MB
        ]);

        $user = $request->user();

        if ($request->hasFile('foto_profile')) {
            $file = $request->file('foto_profile');

            // Buat nama file unik: nama_user_timestamp.webp
            $filename = Str::slug($user->name) . '_' . time() . '.webp';
            $path = storage_path('app/public/assets/images/user/foto_profile/' . $filename);

            // Buat folder jika belum ada
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0777, true);
            }

            // Pakai ImageManager langsung (tanpa facade)
            $manager = new ImageManager(new Driver());
            $manager->read($file)
                    ->resize(300, 300, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    })
                    ->toWebp(quality: 70)
                    ->save($path);

            // Simpan path di DB
            $dbPath = 'assets/images/user/foto_profile/' . $filename;
            $user->foto_profile = $dbPath;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil diupload',
            'url' => $user->foto_profile_url, // pakai accessor
        ]);
    }
}

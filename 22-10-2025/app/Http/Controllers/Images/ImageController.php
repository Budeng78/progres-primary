<?php
//app\Http\Controllers\Images\ImageController.php
namespace App\Http\Controllers\Images;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use App\Models\Tenaker\PrimaryKaryawan;
use Throwable;

class ImageController extends Controller
{
    public function uploadFotoProfile(Request $request)
    {
        $request->validate([
            'id'        => 'required|exists:primary_karyawan,id',
            'foto_profile' => 'required|image|mimes:jpeg,png,jpg|max:200048',
        ]);

        $employee = PrimaryKaryawan::where('id', $request->id)->firstOrFail();

        $photo = $request->file('foto_profile');
        $filename = \Illuminate\Support\Str::uuid() . '.webp';
        $path = storage_path('app/public/karyawan/profile/' . $filename);

        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0777, true);
        }

        // ✅ Pakai ImageManager langsung (tanpa facade)
        $manager = new ImageManager(new Driver());
        $manager->read($photo)
            ->scale(width: 800)
            ->toWebp(quality: 70)
            ->save($path);

        $dbPath = 'karyawan/profile/' . $filename;
        $employee->foto_profile = $dbPath;
        $employee->save();

        return response()->json([
            'message' => 'Foto profil berhasil diupload & diresize',
            'path'    => $dbPath,
            'url'     => asset('storage/' . $dbPath),
        ]);
    }
    public function uploadFormalPhoto(Request $request)
    {
        $request->validate([
            'id'       => 'required|exists:primary_karyawan,id',
            'foto_formal' => 'required|image|mimes:jpeg,png,jpg|max:200048',
        ]);

        $employee = PrimaryKaryawan::where('id', $request->id)->firstOrFail();

        $photo = $request->file('foto_formal');
        $filename = \Illuminate\Support\Str::uuid() . '.webp';
        $path = storage_path('app/public/karyawan/formal/' . $filename);

        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0777, true);
        }

        // ✅ Resize & konversi ke WebP
        $manager = new ImageManager(new Driver());
        $manager->read($photo)
            ->scale(width: 1000)  // bisa lebih besar dari profil
            ->toWebp(quality: 80) // kualitas lebih tinggi untuk formal
            ->save($path);

        $dbPath = 'karyawan/formal/' . $filename;
        $employee->foto_formal = $dbPath;
        $employee->save();

        return response()->json([
            'message' => 'Foto formal berhasil diupload & diresize',
            'path'    => $dbPath,
            'url'     => asset('storage/' . $dbPath),
        ]);
    }

}

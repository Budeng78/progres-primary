<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OtpController extends Controller
{
    /**
     * Kirim kode OTP ke nomor WhatsApp
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|regex:/^08[0-9]{8,12}$/|min:10|max:15',
        ]);

        try {
            // Temukan atau buat user
            $user = User::firstOrCreate(
                ['whatsapp_number' => $request->whatsapp_number],
                [
                    'name' => $request->name,
                    'email' => Str::random(10) . '@example.com',
                    'password' => Hash::make(Str::random(10)),
                ]
            );

            // Hapus OTP lama
            DB::table('otps')->where('whatsapp_number', $request->whatsapp_number)->delete();

            // Buat kode OTP baru
            $otpCode = rand(100000, 999999);

            // Simpan OTP ke database (tanpa user_id)
            DB::table('otps')->insert([
                'name' => $user->name,
                'whatsapp_number' => $request->whatsapp_number,
                'otp_code' => $otpCode,
                'is_verified' => false,
                'expires_at' => Carbon::now()->addMinutes(5),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Kirim ke Node-RED (API WhatsApp)
            try {
                $response = Http::post('http://192.168.3.253:1880/api/otp', [
                    'to' => $request->whatsapp_number,
                    'message' => "Halo {$user->name}! Kode OTP Anda adalah: {$otpCode}. Berlaku 5 menit.",
                ]);

                Log::info('Node-RED status: ' . $response->status());
                Log::info('Node-RED body: ' . $response->body());

                if ($response->successful()) {
                    return response()->json(['message' => 'Kode OTP berhasil dikirim.'], 200);
                } else {
                    return response()->json(['message' => 'Gagal mengirim OTP (Node-RED tidak merespons).'], 500);
                }
            } catch (\Exception $httpEx) {
                Log::error('Node-RED error: ' . $httpEx->getMessage());
                return response()->json(['message' => 'Gagal mengirim OTP. Node-RED tidak dapat dihubungi.'], 500);
            }

        } catch (\Exception $e) {
            Log::error('sendOtp error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengirim OTP.'], 500);
        }
    }

    /**
     * Verifikasi OTP dan login user
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'whatsapp_number' => 'required|string',
            'otp_code' => 'required|string|size:6',
        ]);

        $otp = DB::table('otps')
            ->where('whatsapp_number', $request->whatsapp_number)
            ->where('otp_code', $request->otp_code)
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Kode OTP salah.'], 400);
        }

        if (Carbon::now()->greaterThan($otp->expires_at)) {
            return response()->json(['message' => 'Kode OTP sudah kedaluwarsa.'], 400);
        }

        // Tandai sebagai terverifikasi
        DB::table('otps')
            ->where('id', $otp->id)
            ->update(['is_verified' => true]);

        // Login user
        $user = User::where('whatsapp_number', $request->whatsapp_number)->first();
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan.'], 404);
        }

        Auth::login($user);
        $token = $user->createToken('otp_login')->plainTextToken;

        return response()->json([
            'message' => 'OTP berhasil diverifikasi.',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Reset password via OTP yang sudah diverifikasi
     */
    public function resetPasswordViaOtp(Request $request)
    {
        try {
            $validated = $request->validate([
                'otp_code' => 'required|string',
                'new_password' => 'required|string|min:6|confirmed',
            ]);

            // Ambil data OTP dari DB
            $otpRecord = DB::table('otps')
                ->where('otp_code', $validated['otp_code'])
                ->where('is_verified', true)
                ->first();

            if (!$otpRecord) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'OTP tidak valid atau belum diverifikasi.'
                ], 400);
            }

            // Cari user berdasarkan nomor WA
            $user = User::where('whatsapp_number', $otpRecord->whatsapp_number)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak ditemukan untuk OTP ini.'
                ], 404);
            }

            // Ubah password
            $user->password = Hash::make($validated['new_password']);
            $user->save();

            // Nonaktifkan OTP
            DB::table('otps')
                ->where('id', $otpRecord->id)
                ->update(['is_verified' => false]);

            Log::info("Password berhasil direset untuk nomor: {$otpRecord->whatsapp_number}");

            return response()->json([
                'status' => 'success',
                'message' => 'Password berhasil direset.'
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Reset password via OTP error: ' . $th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server.',
                'detail' => $th->getMessage(), // hapus di production
            ], 500);
        }
    }
    public function logout(Request $request)
            {
                try {
                    // Revoke current token
                    $request->user()->currentAccessToken()->delete();

                    return response()->json([
                        'message' => 'Logout berhasil',
                    ], 200);
                } catch (\Throwable $th) {
                    \Log::error('Logout error: ' . $th->getMessage());
                    return response()->json([
                        'message' => 'Terjadi kesalahan saat logout',
                        'detail' => $th->getMessage(), // Hanya untuk debug
                    ], 500);
                }
            }
}

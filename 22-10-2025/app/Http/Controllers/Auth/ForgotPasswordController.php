<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;



    class ForgotPasswordController extends Controller
{
    /**
     * Kirim OTP ke user via email/WhatsApp
     */
    public function sendResetToken(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
        ]);

        try {
            $user = User::where('email', $request->login)
                        ->orWhere('whatsapp_number', $request->login)
                        ->firstOrFail();

            // Generate OTP 6 digit
            $token = rand(100000, 999999);

            $user->otp_token = $token;
            $user->otp_created_at = now();
            $user->save();

            // Kirim OTP ke Node-RED
            try {
                $response = Http::post('http://192.168.3.253:1880/api/resetpass', [
                    'to' => $user->whatsapp_number,
                    'message' => "Halo {$user->name}, kode OTP untuk reset password Anda adalah: {$token}. Berlaku 10 menit.",
                ]);

                Log::info('Node-RED status: ' . $response->status());
                Log::info('Node-RED body: ' . $response->body());

                if ($response->successful()) {
                    return response()->json(['message' => 'Token OTP berhasil dikirim.'], 200);
                } else {
                    return response()->json(['message' => 'Gagal mengirim OTP (Node-RED tidak merespons).'], 500);
                }
            } catch (\Exception $httpEx) {
                Log::error('Node-RED error: ' . $httpEx->getMessage());
                return response()->json(['message' => 'Gagal mengirim OTP. Node-RED tidak dapat dihubungi.'], 500);
            }

        } catch (\Exception $e) {
            Log::error("Forgot Password Error: " . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengirim token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verifikasi OTP
     */
    public function verifyToken(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'otp_token' => 'required|string',
        ]);

        try {
            $user = DB::table('users')
                ->where('email', $request->login)
                ->orWhere('whatsapp_number', $request->login)
                ->first();

            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan'], 404);
            }

            // cek OTP
            if ($user->otp_token !== $request->otp_token) {
                return response()->json(['message' => 'OTP tidak valid'], 400);
            }

            // cek kadaluarsa OTP 10 menit
            $otpCreated = Carbon::parse($user->otp_created_at);
            if ($otpCreated->diffInMinutes(now()) > 10) {
                return response()->json(['message' => 'OTP sudah kadaluarsa'], 400);
            }

            return response()->json(['message' => 'OTP valid'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'otp_token' => 'required|string',
            'new_password' => 'required|string|min:6',
        ]);

        try {
            $user = DB::table('users')
                ->where('email', $request->login)
                ->orWhere('whatsapp_number', $request->login)
                ->first();

            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan'], 404);
            }

            // cek OTP
            if ($user->otp_token !== $request->otp_token) {
                return response()->json(['message' => 'OTP tidak valid'], 400);
            }

            // cek kadaluarsa OTP 10 menit
            $otpCreated = Carbon::parse($user->otp_created_at);
            if ($otpCreated->diffInMinutes(now()) > 10) {
                return response()->json(['message' => 'OTP sudah kadaluarsa'], 400);
            }

            // update password & reset OTP
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'password' => Hash::make($request->new_password),
                    'otp_token' => null,
                    'otp_created_at' => null,
                ]);

            return response()->json(['message' => 'Password berhasil diubah'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
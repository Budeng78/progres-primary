<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\UserResource;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Tenaker\PrimaryKaryawan;

class ApiAuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'whatsapp_number' => ['nullable', 'string', 'unique:users,whatsapp_number'],
            'password'        => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
            ],
            'karyawan_type'   => ['required', 'in:primary,secondary,none'],
        ]);

        $primaryKaryawanId = null;
        $karyawanBagian = null;

        if ($validated['karyawan_type'] === 'primary') {
            $primaryKaryawan = \App\Models\Tenaker\PrimaryKaryawan::query()
                ->where('nama', $validated['name'])
                ->orWhere('email', $validated['email'])
                ->orWhere('whatsapp_number', $validated['whatsapp_number'] ?? null)
                ->first();

            if (!$primaryKaryawan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan di daftar tenaga kerja primary. Hubungi HRD.'
                ], 422);
            }

            $primaryKaryawanId = $primaryKaryawan->id;
            $karyawanBagian = $primaryKaryawan->bagian;
        }

        try {
            \DB::beginTransaction();

            $user = User::create([
                'name'                => $validated['name'],
                'email'               => $validated['email'],
                'whatsapp_number'     => $validated['whatsapp_number'] ?? null,
                'primary_karyawan_id' => $primaryKaryawanId,
                'karyawan_bagian'     => $karyawanBagian,
                'password'            => Hash::make($validated['password']),
            ]);

            // Tentukan role sesuai karyawan_type
            $roleName = match ($validated['karyawan_type']) {
                'primary'   => 'Primary',
                'secondary' => 'Secondary',
                default     => 'User',
            };

            $role = Role::firstOrCreate(['name' => $roleName]);
            $permission = Permission::firstOrCreate(['name' => strtolower($roleName)]);
            $user->assignRole($role);
            $user->givePermissionTo($permission);

            $token = $user->createToken('auth_token')->plainTextToken;

            \DB::commit();

            return response()->json([
                'success'     => true,
                'message'     => 'User registered successfully',
                'data'        => [
                    'user'        => new UserResource($user->load('primaryKaryawan')),
                    'roles'       => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ], 201);

        } catch (\Exception $e) {
            \DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Login user via email or WhatsApp.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login' => ['required', 'string'], // email atau whatsapp_number
            'password' => ['required', 'string'],
        ]);

        // Cari user berdasarkan email atau whatsapp_number
        $user = User::with('primaryKaryawan')
            ->where('email', $request->login)
            ->orWhere('whatsapp_number', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['The provided credentials do not match our records.'],
            ]);
        }

        // Hapus token lama agar single login
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => new UserResource($user),
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout current session.
     */
   public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();

            // Hapus token hanya jika ini PersonalAccessToken
            if ($token && method_exists($token, 'delete')) {
                $token->delete();
            }

            // Hapus session untuk stateful SPA jika ada
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        }

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices',
        ]);
    }

    /**
     * Get authenticated user info.
     */
    public function user(Request $request)
    {
        $user = $request->user()->load('primaryKaryawan');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }
    /**
     * Simpler alias for /me endpoint.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ]);
    }
}

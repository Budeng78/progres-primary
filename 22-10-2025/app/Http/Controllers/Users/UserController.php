<?php

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    // 🔍 Ambil semua user
    public function index()
    {
        $users = DB::table('users')
            ->select('id', 'name', 'email', 'whatsapp_number', 'foto_profile')
            ->get();

        foreach ($users as $user) {
            $user->roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name');

            $user->permissions = DB::table('permissions')
                ->join('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
                ->where('permission_user.user_id', $user->id)
                ->pluck('permissions.name');
        }
        \Log::info($users);
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    // 🔍 Ambil detail user
    public function show($id)
    {
        $user = DB::table('users')
            ->select('id', 'name', 'email', 'whatsapp_number', 'foto_profile')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $user->roles = DB::table('roles')
            ->join('role_user', 'roles.id', '=', 'role_user.role_id')
            ->where('role_user.user_id', $user->id)
            ->pluck('roles.name');

        $user->permissions = DB::table('permissions')
            ->join('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
            ->where('permission_user.user_id', $user->id)
            ->pluck('permissions.name');

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    // ➕ Tambah user
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'nullable|string|min:6',
            'whatsapp_number' => 'nullable|string|max:255',
            'foto_profile' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $id = DB::table('users')->insertGetId([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? 'password123'),
            'whatsapp_number' => $request->whatsapp_number,
            'foto_profile' => $request->foto_profile,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $user = DB::table('users')
            ->select('id', 'name', 'email', 'whatsapp_number', 'foto_profile')
            ->where('id', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan',
            'data' => $user
        ]);
    }

    // ✏️ Update user
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'whatsapp_number' => 'nullable|string|max:255',
            'foto_profile' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp_number' => $request->whatsapp_number,
            'foto_profile' => $request->foto_profile,
            'updated_at' => now(),
        ];

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $updated = DB::table('users')->where('id', $id)->update($updateData);

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'User gagal diupdate'
            ], 500);
        }

        $user = DB::table('users')
            ->select('id', 'name', 'email', 'whatsapp_number', 'foto_profile')
            ->where('id', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate',
            'data' => $user
        ]);
    }

    // ❌ Hapus user
    public function destroy($id)
    {
        $deleted = DB::table('users')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'User gagal dihapus'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }
}
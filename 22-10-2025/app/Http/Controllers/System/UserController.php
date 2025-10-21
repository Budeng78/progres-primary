<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Daftar semua user
     */
    public function index()
    {
        $users = User::with(['roles.permissions', 'permissions'])->get();

        $users = $users->map(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'permissions' => $r->permissions->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
            ]),
            'permissions' => $user->getAllPermissions()->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
            ]),
        ]);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }


    /**
     * Detail user
     */
    public function show($id)
    {
        $user = User::with(['roles', 'permissions', 'primaryKaryawan'])->findOrFail($id);

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'whatsapp_number' => $user->whatsapp_number,
            'primaryKaryawan' => $user->primaryKaryawan,
            'roles' => $user->roles->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ]),
            'permissions' => $user->getAllPermissions()->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
            ]),
        ];

        return response()->json([
            'success' => true,
            'data' => $userData,
        ]);
    }

    /**
     * Hapus user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Assign roles ke user
     */
    public function assignRoles(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $rolesInput = $request->input('roles', []);

        // Jika dikirim ID, ubah jadi nama
        $rolesById = Role::whereIn('id', $rolesInput)->pluck('name')->toArray();

        // Kalau ternyata frontend sudah kirim nama, tetap jalan
        $roles = !empty($rolesById) ? $rolesById : $rolesInput;

        $user->syncRoles($roles);

        return response()->json(['message' => 'Roles berhasil diperbarui']);
    }

    /**
     * Assign permissions ke user
     */
    public function assignPermissions(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $permissions = $request->input('permissions', []);

        // Jika array berisi id → konversi ke nama permission
        if (!empty($permissions) && is_numeric($permissions[0])) {
            $permissions = \Spatie\Permission\Models\Permission::whereIn('id', $permissions)
                ->pluck('name')
                ->toArray();
        }

        $user->syncPermissions($permissions);

        return response()->json(['message' => 'Permissions berhasil diperbarui']);
    }

}

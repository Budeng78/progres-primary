<?php
// app/Http/Controllers/System/PermissionController.php
namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Menampilkan daftar semua Permission
     */
    public function index()
    {
        $permissions = Permission::all();
        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * Membuat Permission baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
            'guard_name' => 'nullable|string'
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name ?? 'web',
        ]);

        return response()->json($permission, 201);
    }

    /**
     * Menampilkan detail Permission
     */
    public function show($id)
    {
        $permission = Permission::findOrFail($id);

        return response()->json($permission);
    }

    /**
     * Memperbarui Permission
     */
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
            'guard_name' => 'nullable|string'
        ]);

        $permission->update([
            'name' => $request->name,
            'guard_name' => $request->guard_name ?? $permission->guard_name ?? 'web',
        ]);

        return response()->json($permission);
    }

    /**
     * Menghapus Permission
     */
    public function destroy($id)
    {
        try {
            $permission = Permission::findOrFail($id);

            // Lepas relasi dulu biar aman
            $permission->roles()->detach();
            DB::table('model_has_permissions')->where('permission_id', $id)->delete();

            $permission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permission berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            \Log::error('Delete permission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

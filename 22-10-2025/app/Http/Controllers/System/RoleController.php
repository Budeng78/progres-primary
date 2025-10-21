<?php
// app/Http/Controllers/System/RoleController.php
namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
            'guard_name' => 'nullable|string'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
            'guard_name' => $request->guard_name ?? 'web',
        ]);

        return response()->json([
            'success' => true,
            'data' => $role
        ], 201);
    }

    public function show($id)
    {
        $role = Role::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'guard_name' => 'nullable|string'
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
            'guard_name' => $request->guard_name ?? $role->guard_name ?? 'web',
        ]);

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);

            // Lepas relasi dulu biar aman
            $role->permissions()->detach();
            DB::table('model_has_roles')->where('role_id', $id)->delete();

            $role->delete();

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            \Log::error('Delete role error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

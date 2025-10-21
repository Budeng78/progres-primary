<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Jalankan seed database.
     */
    public function run(): void
    {
        // Pastikan guard name sudah benar (misalnya 'web' atau 'api')
        // Ini akan membuat role 'user' jika belum ada
        Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        
        // Ini akan membuat role 'admin' jika belum ada
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        
        // Anda juga bisa membuat permission di sini
        // Permission::firstOrCreate(['name' => 'create articles', 'guard_name' => 'web']);
        // Role::findByName('admin')->givePermissionTo('create articles');
    }
}
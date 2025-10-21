<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminSystemSeeder extends Seeder
{
    public function run()
    {
        // Buat role admin_sistem jika belum ada
        $role = Role::firstOrCreate(['name' => 'admin_sistem']);

        // Buat permission master jika belum ada
        $permissions = [
            'users.manage',
            'roles.manage',
            'permissions.manage',
            'karyawan.manage',
            'system.manage',
        ];

        foreach ($permissions as $permName) {
            Permission::firstOrCreate(['name' => $permName]);
        }

        // Assign semua permission ke role admin_sistem
        $role->syncPermissions(Permission::all());

        // Buat user admin_sistem
        $admin = User::firstOrCreate(
            ['email' => 'admin@system.com'], // ganti email sesuai kebutuhan
            [
                'name' => 'Admin System',
                'password' => bcrypt('Admin123!'), // ganti password sesuai kebutuhan
            ]
        );

        // Assign role admin_sistem ke user
        $admin->assignRole($role);

        $this->command->info('Admin system berhasil dibuat: admin@system.com / Admin123!');
    }
}

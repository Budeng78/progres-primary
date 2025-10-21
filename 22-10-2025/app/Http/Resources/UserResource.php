<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),

            // Roles dan permissions
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name'); // nama role saja
            }),
            'permissions' => $this->getAllPermissions()->pluck('name'), // semua permission

            // Data primary_karyawan
            'primary_karyawan' => $this->whenLoaded('primaryKaryawan', function () {
                return [
                    'id' => $this->primaryKaryawan?->id,
                    'sub_bagian' => $this->primaryKaryawan?->sub_bagian,
                    'kelamin' => $this->primaryKaryawan?->kelamin,
                    'foto_profile_url' => $this->primaryKaryawan?->foto_profile_url,
                    'foto_formal_url' => $this->primaryKaryawan?->foto_formal_url,
                ];
            }),
        ];
    }
}

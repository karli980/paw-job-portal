<?php

namespace App\Policies;

use App\Models\Empresa;
use App\Models\OfertaLaboral;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OfertaLaboralPolicy
{
    /**
     * Comprobar que el usuario administra la empresa.
     */
    private function administraEmpresa(User $user, int $empresaId): bool
    {
        $empresaActiva = Empresa::query()
            ->whereKey($empresaId)
            ->where('estado', true)
            ->exists();

        if (! $empresaActiva) {
            return false;
        }

        return DB::table('empresa_usuario')
            ->where('empresa_id', $empresaId)
            ->where('user_id', $user->id)
            ->where('rol', 'admin')
            ->where('estado', true)
            ->exists();
    }

    /**
     * Comprobar autorización empresarial o administrativa.
     */
    private function puedeGestionar(
        User $user,
        OfertaLaboral $oferta,
        string $permiso
    ): bool {
        if (! $user->hasPermissionTo($permiso, 'web')) {
            return false;
        }

        // El Super Admin puede administrar ofertas de
        // cualquier empresa, conforme a sus permisos.
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if (! $user->hasRole('representante_empresa')) {
            return false;
        }

        return $this->administraEmpresa(
            $user,
            (int) $oferta->empresa_id
        );
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(
            'listar ofertas laborales',
            'web'
        );
    }

    /**
     * Crear una oferta para una empresa determinada.
     */
    public function create(User $user, Empresa $empresa): bool
    {
        if (! $user->hasPermissionTo(
            'crear ofertas laborales',
            'web'
        )) {
            return false;
        }

        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $user->hasRole('representante_empresa')
            && $this->administraEmpresa($user, (int) $empresa->id);
    }

    public function view(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'listar ofertas laborales'
        );
    }

    public function update(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'editar ofertas laborales'
        );
    }

    public function publish(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'publicar ofertas laborales'
        );
    }

    public function pause(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'pausar ofertas laborales'
        );
    }

    public function close(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'cerrar ofertas laborales'
        );
    }

    public function archive(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'archivar ofertas laborales'
        );
    }

    public function delete(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'eliminar ofertas laborales'
        );
    }

    public function viewHistory(User $user, OfertaLaboral $oferta): bool
    {
        return $this->puedeGestionar(
            $user,
            $oferta,
            'ver historial ofertas laborales'
        );
    }

    public function moderate(User $user, OfertaLaboral $oferta): bool
    {
        return $user->hasPermissionTo(
            'moderar ofertas laborales',
            'web'
        ) && $user->hasAnyRole([
            'super-admin',
            'admin',
            'moderador',
        ]);
    }

    /**
     * Determinar si el usuario puede listar
     * las ofertas laborales de una empresa.
     */
    public function viewCompany(User $user, Empresa $empresa): bool
    {
        if (! $user->can('listar ofertas laborales')) {
            return false;
        }

        if ($user->hasRole('super-admin')) {
            return true;
        }

        if (! $user->hasRole('representante_empresa')) {
            return false;
        }

        return $this->administraEmpresa($user, $empresa->id);
    }
}

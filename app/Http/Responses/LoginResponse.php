<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'two_factor' => false,
            ]);
        }

        $usuario = $request->user();

        // Usuarios administrativos.
        if ($usuario && $usuario->hasAnyRole([
            'super-admin',
            'admin',
            'moderador',
        ])) {
            return redirect()->route('admin.dashboard');
        }

        // Empresas y candidatos:
        // destino temporal hasta crear sus dashboards.
        // Representantes empresariales.
        if ($usuario && $usuario->hasRole('representante_empresa')) {
            return redirect()->route('empresa.dashboard');
        }

        // Candidatos: destino temporal.
        return redirect('/');
    }
}

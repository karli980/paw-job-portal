<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->noContent();
        }

        $usuario = $request->user();

        if (
            $usuario &&
            $usuario->hasAnyRole([
                'super-admin',
                'admin',
                'moderador',
            ])
        ) {
            return redirect()->route(
                'admin.dashboard',
                ['verified' => 1]
            );
        }

        // Mantener el comportamiento habitual de Fortify
        // para candidatos y representantes de empresas.
        return redirect()->intended(
            Fortify::redirects('email-verification') . '?verified=1'
        );
    }
}

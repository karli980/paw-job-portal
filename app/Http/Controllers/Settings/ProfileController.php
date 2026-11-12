<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Mostrar la configuración del perfil.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Actualizar la información del perfil.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        // Si cambia el correo electrónico,
        // deberá verificarlo nuevamente.
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Perfil actualizado correctamente.',
        ]);

        return to_route('profile.edit');
    }

    /**
     * Eliminación definitiva de cuentas.
     *
     * TEMPORALMENTE DESHABILITADA.
     *
     * Se mantendrá bloqueada hasta implementar
     * un procedimiento seguro de eliminación
     * y tratamiento de datos relacionados.
     */
    public function destroy(Request $request): RedirectResponse
    {
        abort(
            403,
            'La eliminación definitiva de cuentas está temporalmente deshabilitada.'
        );
    }
}

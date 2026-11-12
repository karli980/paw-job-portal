<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmpresaContactoController extends Controller
{
    /**
     * Crear o actualizar los datos de contacto empresarial.
     */
    public function update(
        Request $request,
        Empresa $empresa
    ): RedirectResponse {
        $this->verificarAcceso($request, $empresa);

        $validated = $request->validate([
            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'telefono' => [
                'nullable',
                'string',
                'max:30',
            ],
        ]);

        $email = trim($validated['email'] ?? '');
        $telefono = trim($validated['telefono'] ?? '');

        $empresa->contacto()->updateOrCreate(
            ['empresa_id' => $empresa->id],
            [
                'email' => $email !== '' ? $email : null,
                'telefono' => $telefono !== '' ? $telefono : null,
                'estado' => true,
            ]
        );

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'updated',
                'message' => 'Información de contacto actualizada correctamente.',
            ]);
    }

    /**
     * Verificar que el usuario administre esta empresa.
     */
    private function verificarAcceso(
        Request $request,
        Empresa $empresa
    ): void {
        $autorizado = DB::table('empresa_usuario')
            ->where('empresa_id', $empresa->id)
            ->where('user_id', $request->user()->id)
            ->where('rol', 'admin')
            ->where('estado', true)
            ->exists();

        abort_unless(
            $empresa->estado && $autorizado,
            403,
            'No tenés autorización para administrar esta empresa.'
        );
    }
}

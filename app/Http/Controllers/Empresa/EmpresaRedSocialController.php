<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmpresaRedSocialController extends Controller
{
    /**
     * Agregar o reactivar una red social empresarial.
     */
    public function store(
        Request $request,
        Empresa $empresa
    ): RedirectResponse {
        $this->verificarAcceso($request, $empresa);

        $validated = $request->validate([
            'red_social_id' => [
                'required',
                'integer',
                Rule::exists('redes_sociales', 'id')
                    ->where('estado', true),
            ],
            'url_perfil' => [
                'required',
                'url',
                'max:2048',
            ],
        ]);

        $ahora = now();

        // Crear la relación o reactivar la existente.
        // La tabla tiene un índice único por empresa y red social.
        DB::table('empresa_red_social')->upsert(
            [
                [
                    'empresa_id' => $empresa->id,
                    'red_social_id' => $validated['red_social_id'],
                    'url_perfil' => $validated['url_perfil'],
                    'estado' => true,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ],
            ],
            ['empresa_id', 'red_social_id'],
            ['url_perfil', 'estado', 'updated_at']
        );

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'created',
                'message' => 'Red social guardada correctamente.',
            ]);
    }

    /**
     * Actualizar la URL de una red social existente.
     */
    public function update(
        Request $request,
        Empresa $empresa,
        int $vinculo
    ): RedirectResponse {
        $this->verificarAcceso($request, $empresa);

        $validated = $request->validate([
            'url_perfil' => [
                'required',
                'url',
                'max:2048',
            ],
        ]);

        $registro = DB::table('empresa_red_social')
            ->where('id', $vinculo)
            ->where('empresa_id', $empresa->id)
            ->where('estado', true)
            ->first();

        abort_unless($registro, 404);

        DB::table('empresa_red_social')
            ->where('id', $registro->id)
            ->update([
                'url_perfil' => $validated['url_perfil'],
                'updated_at' => now(),
            ]);

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'updated',
                'message' => 'Red social actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una red social sin borrarla.
     */
    public function destroy(
        Request $request,
        Empresa $empresa,
        int $vinculo
    ): RedirectResponse {
        $this->verificarAcceso($request, $empresa);

        $registro = DB::table('empresa_red_social')
            ->where('id', $vinculo)
            ->where('empresa_id', $empresa->id)
            ->first();

        abort_unless($registro, 404);

        DB::table('empresa_red_social')
            ->where('id', $registro->id)
            ->update([
                'estado' => false,
                'updated_at' => now(),
            ]);

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Red social desactivada correctamente.',
            ]);
    }

    /**
     * Verificar autorización del representante.
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

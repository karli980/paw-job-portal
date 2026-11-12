<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmpresaLogoController extends Controller
{
    /** Subir un nuevo logo o reemplazar el que ya tiene la empresa. */
    public function store(Request $request, Empresa $empresa): RedirectResponse
    {
        $this->verificarAcceso($request, $empresa);

        $request->validate([
            'logo' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        // Nombre aleatorio generado por Laravel, nunca suministrado por el usuario.
        $rutaNueva = $request->file('logo')->store(
            "empresas/{$empresa->id}/logos",
            'public'
        );

        if (! $rutaNueva) {
            throw ValidationException::withMessages([
                'logo' => 'No se pudo guardar el archivo. Volvé a intentarlo.',
            ]);
        }

        $rutaAnterior = $empresa->logo;

        try {
            $empresa->forceFill(['logo' => $rutaNueva])->save();
        } catch (Throwable $exception) {
            // No dejar archivos huérfanos si falla la base de datos.
            Storage::disk('public')->delete($rutaNueva);
            throw $exception;
        }

        $this->eliminarArchivoPropio($empresa, $rutaAnterior);

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'updated',
                'message' => 'Logo empresarial actualizado correctamente.',
            ]);
    }

    /** Quitar el logo, conservando la empresa y sus demás datos. */
    public function destroy(Request $request, Empresa $empresa): RedirectResponse
    {
        $this->verificarAcceso($request, $empresa);

        $rutaAnterior = $empresa->logo;
        $empresa->forceFill(['logo' => null])->save();
        $this->eliminarArchivoPropio($empresa, $rutaAnterior);

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Logo empresarial eliminado correctamente.',
            ]);
    }

    /** Borrar solamente archivos que pertenezcan al directorio de esta empresa. */
    private function eliminarArchivoPropio(Empresa $empresa, ?string $ruta): void
    {
        $prefijo = "empresas/{$empresa->id}/logos/";
        if ($ruta && str_starts_with($ruta, $prefijo)) {
            Storage::disk('public')->delete($ruta);
        }
    }

    /** No permitir editar logos de empresas ajenas o inactivas. */
    private function verificarAcceso(Request $request, Empresa $empresa): void
    {
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

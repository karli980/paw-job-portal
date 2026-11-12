<?php

namespace App\Http\Controllers;

use App\Models\Candidato;
use App\Models\CandidatoIdioma;
use App\Models\Idioma;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidatoIdiomaController extends Controller
{
    /**
     * Obtener el candidato autenticado.
     */
    private function obtenerCandidato(): Candidato
    {
        return Candidato::where('user_id', auth()->id())
            ->firstOrFail();
    }

    /**
     * Mostrar los idiomas del candidato y el catálogo disponible.
     */
    public function index()
    {
        $candidato = $this->obtenerCandidato();

        // Se mantienen las asociaciones activas del candidato,
        $idiomas = $candidato->idiomas()
            ->select('idiomas.id', 'idiomas.nombre', 'idiomas.estado')
            ->orderBy('idiomas.nombre')
            ->get();

        // Solamente se ofrecen idiomas activos del catálogo
        // que el candidato no tenga asociados actualmente.
        $catalogo = Idioma::query()
            ->where('estado', true)
            ->whereDoesntHave('candidatos', function ($query) use ($candidato) {
                $query->where('candidatos.id', $candidato->id);
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('CandidatoIdiomas/Index', [
            'idiomas' => $idiomas,
            'catalogo' => $catalogo,
        ]);
    }

    /**
     * Agregar un idioma al perfil del candidato.
     */
    public function store(Request $request)
    {
        $candidato = $this->obtenerCandidato();

        $validated = $request->validate([
            'idioma_id' => [
                'required',
                'integer',
                Rule::exists('idiomas', 'id')
                    ->where('estado', true),
            ],
            'nivel_lectura' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
            'nivel_escritura' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
            'nivel_oral' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
        ]);

        // Buscar una asociación existente, incluso si está desactivada.
        // Si existe, se puede reactivar sin generar duplicados.
        $candidatoIdioma = CandidatoIdioma::firstOrNew([
            'candidato_id' => $candidato->id,
            'idioma_id' => $validated['idioma_id'],
        ]);

        if ($candidatoIdioma->exists && $candidatoIdioma->estado) {
            return back()->withErrors([
                'idioma_id' => 'Ya tenés registrado este idioma.',
            ]);
        }

        $candidatoIdioma->fill([
            'nivel_lectura' => $validated['nivel_lectura'],
            'nivel_escritura' => $validated['nivel_escritura'],
            'nivel_oral' => $validated['nivel_oral'],
            'estado' => true,
        ]);

        $candidatoIdioma->save();

        return back()->with('success', [
            'type' => 'created',
            'message' => 'Idioma agregado correctamente a tu perfil.',
        ]);
    }

    /**
     * Actualizar los niveles de un idioma.
     */
    public function update(
        Request $request,
        CandidatoIdioma $candidatoIdioma
    ) {
        $candidato = $this->obtenerCandidato();

        // Verificar que la asociación pertenezca al candidato
        // y que continúe activa en su perfil.
        abort_unless(
            (int) $candidatoIdioma->candidato_id === (int) $candidato->id
            && $candidatoIdioma->estado,
            404
        );

        // Verificar también que el idioma siga activo
        // en el catálogo general.
        if (! $candidatoIdioma->idioma()
            ->where('estado', true)
            ->exists()) {
            return back()->withErrors([
                'idioma' => 'Este idioma ya no está disponible en el catálogo. No podés modificar sus niveles.',
            ]);
        }

        $validated = $request->validate([
            'nivel_lectura' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
            'nivel_escritura' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
            'nivel_oral' => [
                'required',
                Rule::in(['basico', 'intermedio', 'avanzado', 'nativo']),
            ],
        ]);

        $candidatoIdioma->update($validated);

        return back()->with('success', [
            'type' => 'updated',
            'message' => 'Niveles de idioma actualizados correctamente.',
        ]);
    }

    /**
     * Desactivar un idioma del perfil del candidato.
     */
    public function destroy(CandidatoIdioma $candidatoIdioma)
    {
        $candidato = $this->obtenerCandidato();

        abort_unless(
            (int) $candidatoIdioma->candidato_id === (int) $candidato->id
            && $candidatoIdioma->estado,
            404
        );

        // Baja lógica de la asociación.
        // No se elimina el idioma del catálogo.
        $candidatoIdioma->update([
            'estado' => false,
        ]);

        return back()->with('success', [
            'type' => 'deleted',
            'message' => 'Idioma eliminado de tu perfil correctamente.',
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\NivelEstudio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class NivelEstudioController extends Controller
{
    /**
     * Mostrar todos los niveles de estudio.
     */
    public function index()
    {
        $nivelesEstudio = NivelEstudio::all();

        return Inertia::render('NivelesEstudio/Index', [
            'nivelEstudio' => $nivelesEstudio,
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        return Inertia::render('NivelesEstudio/Create');
    }

    /**
     * Guardar un nuevo nivel de estudio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:50',
                'unique:niveles_estudio,nombre',
            ],
            'estado' => 'required|boolean',
        ]);

        NivelEstudio::create($validated);

        return redirect()
            ->route('niveles-estudio.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Nivel de estudio creado correctamente.',
            ]);
    }

    /**
     * Mostrar el detalle de un nivel de estudio.
     */
    public function show(NivelEstudio $nivelEstudio)
    {
        abort_unless($nivelEstudio->estado, 404);

        return Inertia::render('NivelesEstudio/Show', [
            'nivelEstudio' => $nivelEstudio,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(NivelEstudio $nivelEstudio)
    {
        return Inertia::render('NivelesEstudio/Edit', [
            'nivelEstudio' => $nivelEstudio,
        ]);
    }

    /**
     * Actualizar un nivel de estudio.
     */
    public function update(
        Request $request,
        NivelEstudio $nivelEstudio
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:50',
                Rule::unique('niveles_estudio', 'nombre')
                    ->ignore($nivelEstudio->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $nivelEstudio->update($validated);

        return redirect()
            ->route('niveles-estudio.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Nivel de estudio actualizado correctamente.',
            ]);
    }

    /**
     * Desactivar un nivel de estudio.
     */
    public function destroy(NivelEstudio $nivelEstudio)
    {
        $nivelEstudio->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('niveles-estudio.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Nivel de estudio desactivado correctamente.',
            ]);
    }

    /**
     * Activar o desactivar un nivel de estudio.
     */
    public function toggleEstado(NivelEstudio $nivelEstudio)
    {
        $nivelEstudio->update([
            'estado' => ! $nivelEstudio->estado,
        ]);

        $accion = $nivelEstudio->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('niveles-estudio.index')
            ->with('success', [
                'type' => $nivelEstudio->estado ? 'updated' : 'deleted',
                'message' => "Nivel de estudio {$accion} correctamente.",
            ]);
    }
}


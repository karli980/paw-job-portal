<?php

namespace App\Http\Controllers;

use App\Models\NivelHabilidad;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class NivelHabilidadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nivelesHabilidad = NivelHabilidad::all();

        return Inertia::render('NivelesHabilidades/Index', [
            'nivelHabilidad' => $nivelesHabilidad,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NivelesHabilidades/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:50',
                'unique:niveles_habilidades,nombre',
            ],
            'porcentaje' => [
                'nullable',
                'integer',
                'min:0',
                'max:100',
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:255',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        NivelHabilidad::create($validated);

        return redirect()
            ->route('niveles-habilidades.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Nivel de habilidad creado correctamente.',
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(NivelHabilidad $nivelHabilidad)
    {
        abort_unless($nivelHabilidad->estado, 404);

        return Inertia::render('NivelesHabilidades/Show', [
            'nivelHabilidad' => $nivelHabilidad,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NivelHabilidad $nivelHabilidad)
    {
        return Inertia::render('NivelesHabilidades/Edit', [
            'nivelHabilidad' => $nivelHabilidad,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        NivelHabilidad $nivelHabilidad
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:50',
                Rule::unique('niveles_habilidades', 'nombre')
                    ->ignore($nivelHabilidad->id),
            ],
            'porcentaje' => [
                'nullable',
                'integer',
                'min:0',
                'max:100',
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:255',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $nivelHabilidad->update($validated);

        return redirect()
            ->route('niveles-habilidades.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Nivel de habilidad actualizado correctamente.',
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NivelHabilidad $nivelHabilidad)
    {
        $nivelHabilidad->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('niveles-habilidades.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Nivel de habilidad eliminado correctamente.',
            ]);
    }

    /**
     * Activate or deactivate a skill level.
     */
    public function toggleEstado(NivelHabilidad $nivelHabilidad)
    {
        $nivelHabilidad->update([
            'estado' => ! $nivelHabilidad->estado,
        ]);

        $accion = $nivelHabilidad->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('niveles-habilidades.index')
            ->with('success', [
                'type' => $nivelHabilidad->estado
                    ? 'updated'
                    : 'deleted',
                'message' => "Nivel de habilidad {$accion} correctamente.",
            ]);
    }
}

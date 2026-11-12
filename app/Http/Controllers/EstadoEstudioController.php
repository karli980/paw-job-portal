<?php

namespace App\Http\Controllers;

use App\Models\EstadoEstudio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EstadoEstudioController extends Controller
{
    /**
     * Mostrar todos los estados de estudios.
     */
    public function index()
    {
        $estadosEstudios = EstadoEstudio::all();

        return Inertia::render('EstadoEstudios/Index', [
            'estadoEstudio' => $estadosEstudios,
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        return Inertia::render('EstadoEstudios/Create');
    }

    /**
     * Guardar un nuevo estado de estudio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:30|unique:estado_estudios,nombre',
            'estado' => 'required|boolean',
        ]);

        EstadoEstudio::create($validated);

        return redirect()
            ->route('estado-estudios.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Estado de estudio creado correctamente.',
            ]);
    }

    /**
     * Mostrar el detalle de un estado de estudio.
     */
    public function show(EstadoEstudio $estadoEstudio)
    {
        abort_unless($estadoEstudio->estado, 404);

        return Inertia::render('EstadoEstudios/Show', [
            'estadoEstudio' => $estadoEstudio,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(EstadoEstudio $estadoEstudio)
    {
        return Inertia::render('EstadoEstudios/Edit', [
            'estadoEstudio' => $estadoEstudio,
        ]);
    }

    /**
     * Actualizar un estado de estudio.
     */
    public function update(
        Request $request,
        EstadoEstudio $estadoEstudio
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:30',
                Rule::unique('estado_estudios', 'nombre')
                    ->ignore($estadoEstudio->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $estadoEstudio->update($validated);

        return redirect()
            ->route('estado-estudios.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Estado de estudio actualizado correctamente.',
            ]);
    }

    /**
     * Desactivar un estado de estudio.
     */
    public function destroy(EstadoEstudio $estadoEstudio)
    {
        $estadoEstudio->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('estado-estudios.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Estado de estudio desactivado correctamente.',
            ]);
    }

    /**
     * Activar o desactivar un estado de estudio.
     */
    public function toggleEstado(EstadoEstudio $estadoEstudio)
    {
        $estadoEstudio->update([
            'estado' => ! $estadoEstudio->estado,
        ]);

        $accion = $estadoEstudio->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('estado-estudios.index')
            ->with('success', [
                'type' => $estadoEstudio->estado ? 'updated' : 'deleted',
                'message' => "Estado de estudio {$accion} correctamente.",
            ]);
    }
}


<?php

namespace App\Http\Controllers;

use App\Models\ModalidadTrabajo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ModalidadTrabajoController extends Controller
{
    /**
     * Mostrar todas las modalidades de trabajo.
     */
    public function index()
    {
        $modalidades = ModalidadTrabajo::all();

        return Inertia::render('ModalidadTrabajo/Index', [
            'modalidadTrabajo' => $modalidades,
        ]);
    }

    /**
     * Mostrar el formulario para crear una modalidad.
     */
    public function create()
    {
        return Inertia::render('ModalidadTrabajo/Create');
    }

    /**
     * Guardar una nueva modalidad.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:30',
                'unique:modalidades_trabajos,nombre',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        ModalidadTrabajo::create($validated);

        return redirect()
            ->route('modalidades-trabajo.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Modalidad de trabajo creada correctamente.',
            ]);
    }

    /**
     * Mostrar el detalle de una modalidad.
     */
    public function show(ModalidadTrabajo $modalidadTrabajo)
    {
        abort_unless($modalidadTrabajo->estado, 404);

        return Inertia::render('ModalidadTrabajo/Show', [
            'modalidadTrabajo' => $modalidadTrabajo,
        ]);
    }

    /**
     * Mostrar el formulario para editar una modalidad.
     */
    public function edit(ModalidadTrabajo $modalidadTrabajo)
    {
        return Inertia::render('ModalidadTrabajo/Edit', [
            'modalidadTrabajo' => $modalidadTrabajo,
        ]);
    }

    /**
     * Actualizar una modalidad existente.
     */
    public function update(
        Request $request,
        ModalidadTrabajo $modalidadTrabajo
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:30',
                Rule::unique('modalidades_trabajos', 'nombre')
                    ->ignore($modalidadTrabajo->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $modalidadTrabajo->update($validated);

        return redirect()
            ->route('modalidades-trabajo.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Modalidad de trabajo actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una modalidad sin eliminarla físicamente.
     */
    public function destroy(ModalidadTrabajo $modalidadTrabajo)
    {
        $modalidadTrabajo->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('modalidades-trabajo.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Modalidad de trabajo desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una modalidad.
     */
    public function toggleEstado(ModalidadTrabajo $modalidadTrabajo)
    {
        $modalidadTrabajo->update([
            'estado' => ! $modalidadTrabajo->estado,
        ]);

        $accion = $modalidadTrabajo->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('modalidades-trabajo.index')
            ->with('success', [
                'type' => $modalidadTrabajo->estado
                    ? 'updated'
                    : 'deleted',
                'message' => "Modalidad de trabajo {$accion} correctamente.",
            ]);
    }
}


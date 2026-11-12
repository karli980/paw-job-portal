<?php

namespace App\Http\Controllers;

use App\Models\CantidadDeEmpleados;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CantidadEmpleadoController extends Controller
{
    /**
     * Mostrar todos los rangos de empleados.
     */
    public function index()
    {
        $cantidades = CantidadDeEmpleados::orderBy('minimo')->get();

        return Inertia::render('CantidadEmpleados/Index', [
            'cantidadEmpleados' => $cantidades,
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        return Inertia::render('CantidadEmpleados/Create');
    }

    /**
     * Guardar un nuevo rango de empleados.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                'unique:cantidad_de_empleados,nombre',
            ],
            'minimo' => [
                'required',
                'integer',
                'min:0',
            ],
            'maximo' => [
                'nullable',
                'integer',
                'min:0',
                'gte:minimo',
            ],
            'estado' => 'required|boolean',
        ], [
            'nombre.required' => 'El nombre del rango es obligatorio.',
            'nombre.unique' => 'Ya existe un rango con ese nombre.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
            'minimo.required' => 'La cantidad mínima es obligatoria.',
            'minimo.integer' => 'La cantidad mínima debe ser un número entero.',
            'minimo.min' => 'La cantidad mínima no puede ser negativa.',
            'maximo.integer' => 'La cantidad máxima debe ser un número entero.',
            'maximo.min' => 'La cantidad máxima no puede ser negativa.',
            'maximo.gte' => 'La cantidad máxima debe ser mayor o igual a la mínima.',
        ]);

        CantidadDeEmpleados::create($validated);

        return redirect()
            ->route('cantidad-empleados.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Rango de empleados creado correctamente.',
            ]);
    }

    /**
     * Mostrar un rango específico.
     */
    public function show(CantidadDeEmpleados $cantidadEmpleado)
    {
        abort_unless($cantidadEmpleado->estado, 404);

        return Inertia::render('CantidadEmpleados/Show', [
            'cantidadEmpleado' => $cantidadEmpleado,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(CantidadDeEmpleados $cantidadEmpleado)
    {
        return Inertia::render('CantidadEmpleados/Edit', [
            'cantidadEmpleado' => $cantidadEmpleado,
        ]);
    }

    /**
     * Actualizar un rango existente.
     */
    public function update(
        Request $request,
        CantidadDeEmpleados $cantidadEmpleado
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('cantidad_de_empleados', 'nombre')
                    ->ignore($cantidadEmpleado->id),
            ],
            'minimo' => [
                'required',
                'integer',
                'min:0',
            ],
            'maximo' => [
                'nullable',
                'integer',
                'min:0',
                'gte:minimo',
            ],
            'estado' => 'required|boolean',
        ], [
            'nombre.required' => 'El nombre del rango es obligatorio.',
            'nombre.unique' => 'Ya existe un rango con ese nombre.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
            'minimo.required' => 'La cantidad mínima es obligatoria.',
            'minimo.integer' => 'La cantidad mínima debe ser un número entero.',
            'minimo.min' => 'La cantidad mínima no puede ser negativa.',
            'maximo.integer' => 'La cantidad máxima debe ser un número entero.',
            'maximo.min' => 'La cantidad máxima no puede ser negativa.',
            'maximo.gte' => 'La cantidad máxima debe ser mayor o igual a la mínima.',

        ]);

        $cantidadEmpleado->update($validated);

        return redirect()
            ->route('cantidad-empleados.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Rango de empleados actualizado correctamente.',
            ]);
    }

    /**
     * Eliminar un rango.
     */
    public function destroy(CantidadDeEmpleados $cantidadEmpleado)
    {
        $cantidadEmpleado->update(['estado' => false]);

        return redirect()
            ->route('cantidad-empleados.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Rango de empleados desactivado correctamente.',
            ]);
    }

    public function toggleEstado(CantidadDeEmpleados $cantidadEmpleado)
    {
        $cantidadEmpleado->update([
            'estado' => ! $cantidadEmpleado->estado,
        ]);

        $accion = $cantidadEmpleado->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('cantidad-empleados.index')
            ->with('success', [
                'type' => $cantidadEmpleado->estado ? 'updated' : 'deleted',
                'message' => "Rango de empleados {$accion} correctamente.",
            ]);
    }
}

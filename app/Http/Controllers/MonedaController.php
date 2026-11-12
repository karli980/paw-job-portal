<?php

namespace App\Http\Controllers;

use App\Models\Moneda;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MonedaController extends Controller
{
    /**
     * Mostrar el listado de monedas.
     */
    public function index()
    {
        $monedas = Moneda::all();

        return Inertia::render('Monedas/Index', [
            'moneda' => $monedas,
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        return Inertia::render('Monedas/Create');
    }

    /**
     * Guardar una nueva moneda.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:monedas,nombre',
            'simbolo' => 'required|string|max:10',
            'codigo' => 'required|string|size:3|unique:monedas,codigo',
        ], [
            'nombre.required' => 'El nombre de la moneda es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
            'nombre.unique' => 'Ya existe una moneda con ese nombre.',
            'simbolo.required' => 'El símbolo es obligatorio.',
            'simbolo.max' => 'El símbolo no puede superar los 10 caracteres.',
            'codigo.required' => 'El código de moneda es obligatorio.',
            'codigo.size' => 'El código debe tener exactamente 3 caracteres.',
            'codigo.unique' => 'Ya existe una moneda con ese código.',
        ]);

        $validated['codigo'] = strtoupper($validated['codigo']);

        Moneda::create($validated);

        return redirect()
            ->route('monedas.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Moneda creada correctamente.',
            ]);
    }

    /**
     * Mostrar una moneda.
     */
    public function show(Moneda $moneda)
    {
        return Inertia::render('Monedas/Show', [
            'moneda' => $moneda,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(Moneda $moneda)
    {
        return Inertia::render('Monedas/Edit', [
            'moneda' => $moneda,
        ]);
    }

    /**
     * Actualizar una moneda.
     */
    public function update(Request $request, Moneda $moneda)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('monedas', 'nombre')->ignore($moneda->id),
            ],
            'simbolo' => 'required|string|max:10',
            'codigo' => [
                'required',
                'string',
                'size:3',
                Rule::unique('monedas', 'codigo')->ignore($moneda->id),
            ],
        ], [
            'nombre.required' => 'El nombre de la moneda es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
            'nombre.unique' => 'Ya existe una moneda con ese nombre.',
            'simbolo.required' => 'El símbolo es obligatorio.',
            'simbolo.max' => 'El símbolo no puede superar los 10 caracteres.',
            'codigo.required' => 'El código de moneda es obligatorio.',
            'codigo.size' => 'El código debe tener exactamente 3 caracteres.',
            'codigo.unique' => 'Ya existe una moneda con ese código.',
        ]);

        $validated['codigo'] = strtoupper($validated['codigo']);

        $moneda->update($validated);

        return redirect()
            ->route('monedas.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Moneda actualizada correctamente.',
            ]);
    }

    /**
     * Eliminar una moneda.
     */
    public function destroy(Moneda $moneda)
    {
        $moneda->delete();

        return redirect()
            ->route('monedas.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Moneda eliminada correctamente.',
            ]);
    }
    public function toggleEstado(Moneda $moneda)
{
    $moneda->estado = !$moneda->estado;
    $moneda->save();

    return redirect()
        ->route('monedas.index')
        ->with('success', [
            'type' => $moneda->estado ? 'updated' : 'deleted',
            'message' => $moneda->estado
                ? 'Moneda activada correctamente.'
                : 'Moneda desactivada correctamente.',
        ]);
}
}



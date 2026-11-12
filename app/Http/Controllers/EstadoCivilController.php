<?php

namespace App\Http\Controllers;

use App\Models\EstadoCivil;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EstadoCivilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $estadosCiviles = EstadoCivil::all();

        return Inertia::render('EstadoCivil/Index', [
            'estadoCivil' => $estadosCiviles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('EstadoCivil/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:estados_civiles,nombre',
            'estado' => 'required|boolean',
        ]);

        EstadoCivil::create($validated);

        return redirect()
            ->route('estado-civil.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Estado civil creado correctamente.',
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(EstadoCivil $estadoCivil)
    {
        abort_unless($estadoCivil->estado, 404);

        return Inertia::render('EstadoCivil/Show', [
            'estadoCivil' => $estadoCivil,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EstadoCivil $estadoCivil)
    {
        return Inertia::render('EstadoCivil/Edit', [
            'estadoCivil' => $estadoCivil,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EstadoCivil $estadoCivil)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:50',
                Rule::unique('estados_civiles', 'nombre')
                    ->ignore($estadoCivil->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $estadoCivil->update($validated);

        return redirect()
            ->route('estado-civil.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Estado civil actualizado correctamente.',
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EstadoCivil $estadoCivil)
    {
        // Baja lógica: conserva el registro en la base de datos.
        $estadoCivil->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('estado-civil.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Estado civil eliminado correctamente.',
            ]);
    }

    /**
     * Activate or deactivate a civil status.
     */
    public function toggleEstado(EstadoCivil $estadoCivil)
    {
        $estadoCivil->update([
            'estado' => ! $estadoCivil->estado,
        ]);

        $accion = $estadoCivil->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('estado-civil.index')
            ->with('success', [
                'type' => $estadoCivil->estado ? 'updated' : 'deleted',
                'message' => "Estado civil {$accion} correctamente.",
            ]);
    }
}


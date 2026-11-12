<?php

namespace App\Http\Controllers;

use App\Models\Idioma;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class IdiomaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $idiomas = Idioma::all();

        return Inertia::render('Idiomas/Index', [
            'idioma' => $idiomas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Idiomas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:idiomas,nombre',
            'estado' => 'required|boolean',
        ]);

        Idioma::create($validated);

        return redirect()
            ->route('idiomas.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Idioma creado correctamente.',
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Idioma $idioma)
    {
        abort_unless($idioma->estado, 404);

        return Inertia::render('Idiomas/Show', [
            'idioma' => $idioma,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Idioma $idioma)
    {
        return Inertia::render('Idiomas/Edit', [
            'idioma' => $idioma,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Idioma $idioma)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('idiomas', 'nombre')->ignore($idioma->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $idioma->update($validated);

        return redirect()
            ->route('idiomas.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Idioma actualizado correctamente.',
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Idioma $idioma)
    {
        $idioma->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('idiomas.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Idioma eliminado correctamente.',
            ]);
    }

    /**
     * Activate or deactivate an idioma.
     */
    public function toggleEstado(Idioma $idioma)
    {
        $idioma->update([
            'estado' => ! $idioma->estado,
        ]);

        $accion = $idioma->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('idiomas.index')
            ->with('success', [
                'type' => $idioma->estado ? 'updated' : 'deleted',
                'message' => "Idioma {$accion} correctamente.",
            ]);
    }
}

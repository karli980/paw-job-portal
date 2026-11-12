<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GeneroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $generos = Genero::all();

        return Inertia::render('Generos/Index', [
            'genero' => $generos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Generos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:20|unique:generos,nombre',
            'estado' => 'required|boolean',
        ]);

        Genero::create($validated);

        // return redirect()->route('generos.index');
        return redirect()
            ->route('generos.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Genero creado correctamente.',
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Genero $genero)
    {
        abort_unless($genero->estado, 404);

        return Inertia::render('Generos/Show', [
            'genero' => $genero,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Genero $genero)
    {
        return Inertia::render('Generos/Edit', [
            'genero' => $genero,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Genero $genero)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:20',
                Rule::unique('generos', 'nombre')->ignore($genero->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $genero->update($validated);

        // return redirect()->route('generos.index');
        return redirect()
            ->route('generos.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Genero actualizado correctamente.',
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genero $genero)
    {
        $genero->update(['estado' => false]);

        return redirect()
            ->route('generos.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Genero eliminado correctamente.',
            ]);
    }

    public function toggleEstado(Genero $genero)
{
    $genero->update([
        'estado' => ! $genero->estado,
    ]);

    $accion = $genero->estado ? 'activado' : 'desactivado';

    return redirect()
        ->route('generos.index')
        ->with('success', [
            'type' => $genero->estado ? 'updated' : 'deleted',
            'message' => "Género {$accion} correctamente.",
        ]);
}
}

<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PaisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        public function index()
{
    return Inertia::render('Paises/Index', [
        'paises' => Pais::where('estado', true)->get(),
    ]);
}

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Paises/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:100', 'unique:paises,nombre'],
            'codigo_iso' => ['required', 'string', 'size:2', 'unique:paises,codigo_iso'],
            'codigo_iso3' => ['required', 'string', 'size:3', 'unique:paises,codigo_iso3'],
            'estado' => ['boolean'],
        ]);

        Pais::create($validated);

        return redirect()
            ->route('paises.index')
            ->with('success', 'País creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pais $pais)
    {
        return Inertia::render('Paises/Edit', [
            'pais' => $pais,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pais $pais)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('paises', 'nombre')->ignore($pais->id),
            ],
            'codigo_iso' => [
                'required',
                'string',
                'size:2',
                Rule::unique('paises', 'codigo_iso')->ignore($pais->id),
            ],
            'codigo_iso3' => [
                'required',
                'string',
                'size:3',
                Rule::unique('paises', 'codigo_iso3')->ignore($pais->id),
            ],
            'estado' => 'required|boolean',
        ]);

        $pais->update($validated);

        return redirect()->route('paises.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pais $pais)
    {
        $pais->update(['estado' => false]);

        return redirect()->route('paises.index');
    }
}

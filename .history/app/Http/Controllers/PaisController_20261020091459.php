<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PaisController extends Controller
{
    public function index(Request $request)
    {
        // 1. Búsqueda
        $buscar = trim($request->input('buscar', ''));

        // 2. Ordenamiento (validado por seguridad)
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $camposPermitidos = ['nombre', 'codigo_iso', 'codigo_iso3'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'nombre';
        }
        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        // 3. Paginación (validado)
        $porPagina = (int) $request->input('por_pagina', 5);
        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        // 4. Consulta Eloquent
        $paises = Pais::query()
            ->where('estado', true) // Solo mostramos activos
            ->when($buscar != '', function ($query) use ($buscar) {
                $query->where('nombre', 'like', "%{$buscar}%");
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString(); // Conserva filtros en los enlaces de paginación

        return Inertia::render('Paises/Index', [
            'paises' => $paises,
            'filtros' => [
                'buscar' => $buscar,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
            ]
        ]);
    }

    public function create()
{
    return Inertia::render('Paises/Create');
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

        // return redirect()->route('paises.index');
        // update()
        return redirect()
            ->route('paises.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'País actualizado correctamente.',
            ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pais $pais)
    {
        $pais->update(['estado' => false]);

        // return redirect()->route('paises.index');
        return redirect()
            ->route('paises.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'País eliminado correctamente.',
            ]);
    }
}



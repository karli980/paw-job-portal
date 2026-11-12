<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PaisController extends Controller
{
    public function index(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));

        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');

        $camposPermitidos = ['nombre', 'codigo_iso', 'codigo_iso3'];

        if (! in_array($orden, $camposPermitidos, true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        $porPagina = (int) $request->input('por_pagina', 5);

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $paises = Pais::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('codigo_iso', 'like', "%{$buscar}%")
                        ->orWhere('codigo_iso3', 'like', "%{$buscar}%");
                });
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Paises/Index', [
            'paises' => $paises,
            'filtros' => [
                'buscar' => $buscar,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Paises/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:100', Rule::unique('paises', 'nombre')],
            'codigo_iso' => ['required', 'string', 'size:2',   Rule::unique('paises', 'codigo_iso')],
            'codigo_iso3' => ['required', 'string', 'size:3',   Rule::unique('paises', 'codigo_iso3')],
            'estado' => 'required|boolean',
        ]);

        Pais::create($validated);

        // return redirect()->route('paises.index');

        return redirect()
            ->route('paises.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'País creado correctamente.',
            ]);
    }

    public function edit(Pais $pais)
    {
        return Inertia::render('Paises/Edit', [
            'pais' => $pais,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pais $pais)
    {
        return Inertia::render('Paises/Show', [
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

        $this->actualizarConCascada($pais, $validated);

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
        $this->actualizarConCascada($pais, [
            'estado' => false,
        ]);

        return redirect()
            ->route('paises.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'País y sus ubicaciones dependientes desactivados correctamente.',
            ]);
    }

    public function toggleEstado(Pais $pais)
    {
        $nuevoEstado = ! (bool) $pais->estado;

        $this->actualizarConCascada($pais, [
            'estado' => $nuevoEstado,
        ]);

        $accion = $nuevoEstado ? 'activado' : 'desactivado';

        return redirect()
            ->route('paises.index')
            ->with('success', [
                'type' => $nuevoEstado ? 'updated' : 'deleted',
                'message' => "País {$accion} correctamente.",
            ]);
    }

    private function actualizarConCascada(Pais $pais, array $datos): void
    {
        DB::transaction(function () use ($pais, $datos) {

            // Actualizar el país.
            $pais->update($datos);

            // Si el país queda activo, no reactivamos
            // automáticamente sus provincias ni ciudades.
            if ((bool) $pais->estado) {
                return;
            }

            // Desactivar todas las ciudades que pertenecen
            // a las provincias del país.
            DB::table('ciudades')
                ->whereIn('provincia_id', function ($query) use ($pais) {
                    $query->select('id')
                        ->from('provincias')
                        ->where('pais_id', $pais->id);
                })
                ->update([
                    'estado' => false,
                    'updated_at' => now(),
                ]);

            // Desactivar todas las provincias del país.
            DB::table('provincias')
                ->where('pais_id', $pais->id)
                ->update([
                    'estado' => false,
                    'updated_at' => now(),
                ]);
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Ciudad;
use App\Models\Provincia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CiudadController extends Controller
{
    /**
     * Mostrar el listado de ciudades.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $provinciaId = $request->input('provincia_id', '');

        if (! in_array($orden, [
            'nombre',
            'codigo_postal',
            'estado',
            'provincia',
        ], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $query = Ciudad::query()
            ->with('provincia')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subQuery) use ($buscar) {
                    $subQuery
                        ->where('ciudades.nombre', 'like', "%{$buscar}%")
                        ->orWhere(
                            'ciudades.codigo_postal',
                            'like',
                            "%{$buscar}%"
                        )
                        ->orWhereHas('provincia', function ($provinciaQuery) use ($buscar) {
                            $provinciaQuery->where(
                                'nombre',
                                'like',
                                "%{$buscar}%"
                            );
                        });
                });
            })
            ->when(
                $provinciaId !== '' && ctype_digit((string) $provinciaId),
                fn ($query) => $query->where(
                    'ciudades.provincia_id',
                    (int) $provinciaId
                )
            );

        if ($orden === 'provincia') {
            $query
                ->join(
                    'provincias',
                    'ciudades.provincia_id',
                    '=',
                    'provincias.id'
                )
                ->select('ciudades.*')
                ->orderBy('provincias.nombre', $direccion);
        } else {
            $query->orderBy("ciudades.{$orden}", $direccion);
        }

        $ciudades = $query
            ->orderBy('ciudades.id')
            ->paginate($porPagina)
            ->withQueryString();

        // Mostrar todas para permitir filtrar
        // también registros históricos inactivos.
        $provincias = Provincia::query()
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Ciudades/Index', [
            'ciudades' => $ciudades,
            'provincias' => $provincias,
            'filtros' => [
                'buscar' => $buscar,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
                'provincia_id' => $provinciaId,
            ],
        ]);
    }

    /**
     * Formulario de creación.
     */
    public function create()
    {
        $provincias = Provincia::query()
            ->where('estado', true)
            ->whereHas('pais', function ($query) {
                $query->where('estado', true);
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Ciudades/Create', [
            'provincias' => $provincias,
        ]);
    }

    /**
     * Guardar una nueva ciudad.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('ciudades', 'nombre')
                    ->where(
                        'provincia_id',
                        $request->input('provincia_id')
                    ),
            ],
            'codigo_postal' => [
                'nullable',
                'string',
                'max:20',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
            'provincia_id' => [
                'required',
                'integer',
                Rule::exists('provincias', 'id'),
            ],
        ]);

        // Verificar provincia y país activos.
        $this->validarUbicacionActiva(
            (int) $validated['provincia_id']
        );

        $validated['codigo_postal'] =
            ($validated['codigo_postal'] ?? null) ?: null;

        Ciudad::create($validated);

        return redirect()
            ->route('ciudades.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Ciudad creada correctamente.',
            ]);
    }

    /**
     * Mostrar una ciudad.
     */
    public function show(Ciudad $ciudad)
    {
        abort_unless($ciudad->estado, 404);

        $ciudad->load('provincia');

        return Inertia::render('Ciudades/Show', [
            'ciudad' => $ciudad,
        ]);
    }

    /**
     * Formulario de edición.
     */
    public function edit(Ciudad $ciudad)
    {
        // Provincias válidas, más la provincia
        // actual para conservar datos históricos.
        $provincias = Provincia::query()
            ->where(function ($query) use ($ciudad) {
                $query
                    ->where(function ($activas) {
                        $activas
                            ->where('estado', true)
                            ->whereHas('pais', function ($pais) {
                                $pais->where('estado', true);
                            });
                    })
                    ->orWhereKey($ciudad->provincia_id);
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'estado']);

        return Inertia::render('Ciudades/Edit', [
            'ciudad' => $ciudad->load('provincia'),
            'provincias' => $provincias,
        ]);
    }

    /**
     * Actualizar una ciudad.
     */
    public function update(Request $request, Ciudad $ciudad)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('ciudades', 'nombre')
                    ->where(
                        'provincia_id',
                        $request->input('provincia_id')
                    )
                    ->ignore($ciudad->id),
            ],
            'codigo_postal' => [
                'nullable',
                'string',
                'max:20',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
            'provincia_id' => [
                'required',
                'integer',
                Rule::exists('provincias', 'id'),
            ],
        ]);

        $nuevoEstado = (bool) $validated['estado'];

        $cambioProvincia =
            (int) $validated['provincia_id'] !==
            (int) $ciudad->provincia_id;

        // Si la ciudad va a estar activa o cambia
        // de provincia, verificar toda la jerarquía.
        if ($nuevoEstado || $cambioProvincia) {
            $this->validarUbicacionActiva(
                (int) $validated['provincia_id']
            );
        }

        $validated['codigo_postal'] =
            ($validated['codigo_postal'] ?? null) ?: null;

        $ciudad->update($validated);

        return redirect()
            ->route('ciudades.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Ciudad actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una ciudad.
     */
    public function destroy(Ciudad $ciudad)
    {
        $ciudad->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('ciudades.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Ciudad desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una ciudad.
     */
    public function toggleEstado(Ciudad $ciudad)
    {
        $nuevoEstado = ! (bool) $ciudad->estado;

        // No activar ciudades cuyo país o
        // provincia estén inactivos.
        if ($nuevoEstado) {
            $this->validarUbicacionActiva(
                (int) $ciudad->provincia_id,
                'estado'
            );
        }

        $ciudad->update([
            'estado' => $nuevoEstado,
        ]);

        $accion = $nuevoEstado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('ciudades.index')
            ->with('success', [
                'type' => $nuevoEstado ? 'updated' : 'deleted',
                'message' => "Ciudad {$accion} correctamente.",
            ]);
    }

    /**
     * Validar que la provincia y su país estén activos.
     */
    private function validarUbicacionActiva(
        int $provinciaId,
        string $campoError = 'provincia_id'
    ): void {
        $ubicacionValida = Provincia::query()
            ->whereKey($provinciaId)
            ->where('estado', true)
            ->whereHas('pais', function ($query) {
                $query->where('estado', true);
            })
            ->exists();

        if (! $ubicacionValida) {
            throw ValidationException::withMessages([
                $campoError =>
                    'No se puede realizar la operación porque la provincia o su país están inactivos.',
            ]);
        }
    }
}

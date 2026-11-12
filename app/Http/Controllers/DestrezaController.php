<?php

namespace App\Http\Controllers;

use App\Exports\DestrezasExport;
use App\Models\CategoriaHabilidad;
use App\Models\Destreza;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DestrezaController extends Controller
{
    /**
     * Mostrar el listado de destrezas.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);

        if (! in_array($orden, ['nombre', 'categoria', 'estado'], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $destrezas = Destreza::query()
            ->with('categoriaHabilidad')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery
                        ->where('nombre', 'like', "%{$buscar}%")
                        ->orWhereHas(
                            'categoriaHabilidad',
                            function ($categoria) use ($buscar) {
                                $categoria->where(
                                    'nombre',
                                    'like',
                                    "%{$buscar}%"
                                );
                            }
                        );
                });
            })
            ->when(
                $orden === 'categoria',
                function ($query) use ($direccion) {
                    $query->orderBy(
                        CategoriaHabilidad::select('nombre')
                            ->whereColumn(
                                'categorias_habilidades.id',
                                'destrezas.categoria_habilidad_id'
                            ),
                        $direccion
                    );
                },
                function ($query) use ($orden, $direccion) {
                    $query->orderBy($orden, $direccion);
                }
            )
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Destrezas/Index', [
            'destrezas' => $destrezas,
            'filtros' => [
                'buscar' => $buscar,
                'orden' => $orden,
                'direccion' => $direccion,
                'por_pagina' => $porPagina,
            ],
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        $categorias = CategoriaHabilidad::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('Destrezas/Create', [
            'categorias' => $categorias,
        ]);
    }

    /**
     * Guardar una nueva destreza.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'categoria_habilidad_id' => [
                'required',
                'integer',
                Rule::exists('categorias_habilidades', 'id')
                    ->where('estado', true),
            ],
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('destrezas', 'nombre')
                    ->where(
                        'categoria_habilidad_id',
                        $request->input('categoria_habilidad_id')
                    ),
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:255',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        Destreza::create($validated);

        return redirect()
            ->route('destrezas.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Destreza creada correctamente.',
            ]);
    }

    /**
     * Mostrar una destreza específica.
     */
    public function show(Destreza $destreza)
    {
        abort_unless($destreza->estado, 404);

        $destreza->load('categoriaHabilidad');

        return Inertia::render('Destrezas/Show', [
            'destreza' => $destreza,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(Destreza $destreza)
    {
        $destreza->load('categoriaHabilidad');

        $categorias = CategoriaHabilidad::query()
            ->where(function ($query) use ($destreza) {
                $query->where('estado', true)
                    ->orWhere(
                        'id',
                        $destreza->categoria_habilidad_id
                    );
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'estado']);

        return Inertia::render('Destrezas/Edit', [
            'destreza' => $destreza,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Actualizar una destreza.
     */
    public function update(Request $request, Destreza $destreza)
    {
        $validated = $request->validate([
            'categoria_habilidad_id' => [
                'required',
                'integer',
                Rule::exists('categorias_habilidades', 'id')
                    ->where('estado', true),
            ],
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('destrezas', 'nombre')
                    ->where(
                        'categoria_habilidad_id',
                        $request->input('categoria_habilidad_id')
                    )
                    ->ignore($destreza->id),
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:255',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $destreza->update($validated);

        return redirect()
            ->route('destrezas.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Destreza actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una destreza.
     */
    public function destroy(Destreza $destreza)
    {
        $destreza->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('destrezas.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Destreza desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una destreza.
     */
    public function toggleEstado(Destreza $destreza)
    {
        $destreza->load('categoriaHabilidad');

        // Impedir activar una destreza si su categoría está inactiva.
        if (
            ! $destreza->estado
            && (
                ! $destreza->categoriaHabilidad
                || ! $destreza->categoriaHabilidad->estado
            )
        ) {
            return redirect()
                ->route('destrezas.index')
                ->with('success', [
                    'type' => 'error',
                    'message' => 'No se puede activar esta destreza porque su categoría de habilidad está inactiva.',
                ]);
        }

        $destreza->update([
            'estado' => ! $destreza->estado,
        ]);

        return redirect()
            ->route('destrezas.index')
            ->with('success', [
                'type' => $destreza->estado ? 'updated' : 'deleted',
                'message' => $destreza->estado
                    ? 'Destreza activada correctamente.'
                    : 'Destreza desactivada correctamente.',
            ]);
    }

    /**
     * Generar el reporte PDF de destrezas.
     */
    public function reporte()
    {
        $destrezas = Destreza::with('categoriaHabilidad')
            ->orderBy('nombre')
            ->get();

        $pdf = Pdf::loadView(
            'destrezas.reporte-destrezas',
            compact('destrezas')
        );

        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('reporte-destrezas.pdf');
    }

    /**
     * Exportar las destrezas a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new DestrezasExport,
            'reporte-destrezas.xlsx'
        );
    }
}

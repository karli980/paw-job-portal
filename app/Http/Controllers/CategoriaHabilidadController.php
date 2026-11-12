<?php

namespace App\Http\Controllers;

use App\Exports\CategoriasHabilidadesExport;
use App\Models\CategoriaHabilidad;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class CategoriaHabilidadController extends Controller
{
    /**
     * Mostrar el listado de categorías de habilidades.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);

        if (! in_array($orden, ['nombre', 'estado'], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $categorias = CategoriaHabilidad::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('nombre', 'like', "%{$buscar}%");
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('CategoriaHabilidad/Index', [
            'categorias' => $categorias,
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
        return Inertia::render('CategoriaHabilidad/Create');
    }

    /**
     * Guardar una nueva categoría.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                'unique:categorias_habilidades,nombre',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        CategoriaHabilidad::create($validated);

        return redirect()
            ->route('categorias-habilidades.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Categoría de habilidad creada correctamente.',
            ]);
    }

    /**
     * Mostrar una categoría específica.
     */
    public function show(CategoriaHabilidad $categoriaHabilidad)
    {
        abort_unless($categoriaHabilidad->estado, 404);

        return Inertia::render('CategoriaHabilidad/Show', [
            'categoria' => $categoriaHabilidad,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(CategoriaHabilidad $categoriaHabilidad)
    {
        return Inertia::render('CategoriaHabilidad/Edit', [
            'categoria' => $categoriaHabilidad,
        ]);
    }

    /**
     * Actualizar una categoría.
     */
    public function update(
        Request $request,
        CategoriaHabilidad $categoriaHabilidad
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categorias_habilidades', 'nombre')
                    ->ignore($categoriaHabilidad->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        DB::transaction(function () use ($categoriaHabilidad, $validated) {
            $categoriaHabilidad->update($validated);

            if (! $categoriaHabilidad->estado) {
                $categoriaHabilidad->destrezas()->update([
                    'estado' => false,
                ]);
            }
        });

        return redirect()
            ->route('categorias-habilidades.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Categoría de habilidad actualizada correctamente. Las destrezas asociadas fueron desactivadas si correspondía.',
            ]);
    }

    /**
     * Desactivar una categoría.
     */
    public function destroy(CategoriaHabilidad $categoriaHabilidad)
    {
        DB::transaction(function () use ($categoriaHabilidad) {
            $categoriaHabilidad->update([
                'estado' => false,
            ]);

            $categoriaHabilidad->destrezas()->update([
                'estado' => false,
            ]);
        });

        return redirect()
            ->route('categorias-habilidades.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Categoría desactivada y sus destrezas asociadas deshabilitadas correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una categoría.
     */
    public function toggleEstado(
        CategoriaHabilidad $categoriaHabilidad
    ) {
        DB::transaction(function () use ($categoriaHabilidad) {
            $nuevoEstado = ! $categoriaHabilidad->estado;

            $categoriaHabilidad->update([
                'estado' => $nuevoEstado,
            ]);

            // Si se desactiva la categoría, desactivar sus destrezas.
            if (! $nuevoEstado) {
                $categoriaHabilidad->destrezas()->update([
                    'estado' => false,
                ]);
            }
        });

        $categoriaHabilidad->refresh();

        $accion = $categoriaHabilidad->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('categorias-habilidades.index')
            ->with('success', [
                'type' => $categoriaHabilidad->estado
                    ? 'updated'
                    : 'deleted',
                'message' => $categoriaHabilidad->estado
                    ? 'Categoría activada correctamente. Sus destrezas permanecen inactivas hasta que las habilites individualmente.'
                    : 'Categoría y todas sus destrezas asociadas desactivadas correctamente.',
            ]);
    }

    /**
     * Generar el reporte PDF de categorías de habilidades.
     */
    public function reporte()
    {
        $categorias = CategoriaHabilidad::orderBy('nombre', 'asc')->get();

        $pdf = Pdf::loadView(
            'categoriashabilidades.reporte-categorias-habilidades',
            [
                'categorias' => $categorias,
            ]
        )->setPaper('a4', 'portrait');

        return $pdf->stream('reporte-categorias-habilidades.pdf');
    }

    /**
     * Exportar las categorías de habilidades a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new CategoriasHabilidadesExport,
            'reporte-categorias-habilidades.xlsx'
        );
    }
}

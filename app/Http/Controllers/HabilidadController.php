<?php

namespace App\Http\Controllers;

use App\Exports\HabilidadesExport;
use App\Models\Habilidad;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class HabilidadController extends Controller
{
    /**
     * Mostrar el listado de habilidades con búsqueda y paginación.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);

        // Validar los campos permitidos para ordenar.
        if (! in_array($orden, ['nombre', 'categoria', 'estado'], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $habilidades = Habilidad::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery
                        ->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('categoria', 'like', "%{$buscar}%");
                });
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Habilidades/Index', [
            'habilidades' => $habilidades,
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
        return Inertia::render('Habilidades/Create');
    }

    /**
     * Guardar una nueva habilidad.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                'unique:habilidades,nombre',
            ],
            'categoria' => [
                'nullable',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        Habilidad::create($validated);

        return redirect()
            ->route('habilidades.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Habilidad creada correctamente.',
            ]);
    }

    /**
     * Mostrar una habilidad específica.
     */
    public function show(Habilidad $habilidad)
    {
        abort_unless($habilidad->estado, 404);

        return Inertia::render('Habilidades/Show', [
            'habilidad' => $habilidad,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(Habilidad $habilidad)
    {
        return Inertia::render('Habilidades/Edit', [
            'habilidad' => $habilidad,
        ]);
    }

    /**
     * Actualizar una habilidad.
     */
    public function update(Request $request, Habilidad $habilidad)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('habilidades', 'nombre')
                    ->ignore($habilidad->id),
            ],
            'categoria' => [
                'nullable',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $habilidad->update($validated);

        return redirect()
            ->route('habilidades.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Habilidad actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una habilidad.
     */
    public function destroy(Habilidad $habilidad)
    {
        $habilidad->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('habilidades.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Habilidad desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una habilidad.
     */
    public function toggleEstado(Habilidad $habilidad)
    {
        $habilidad->update([
            'estado' => ! $habilidad->estado,
        ]);

        $accion = $habilidad->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('habilidades.index')
            ->with('success', [
                'type' => $habilidad->estado ? 'updated' : 'deleted',
                'message' => "Habilidad {$accion} correctamente.",
            ]);
    }

    /**
     * Generar el reporte PDF de habilidades.
     */
    /**
     * Generar el reporte PDF de habilidades.
     */
    public function reporte()
    {
        $habilidades = Habilidad::orderBy('nombre', 'asc')->get();

        $pdf = Pdf::loadView('habilidades.reporte-habilidades', [
            'habilidades' => $habilidades,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('reporte-habilidades.pdf');
    }

    /**
     * Exportar el listado de habilidades a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new HabilidadesExport,
            'reporte-habilidades.xlsx'
        );
    }
}

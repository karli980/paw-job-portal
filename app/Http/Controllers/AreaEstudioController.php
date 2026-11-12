<?php

namespace App\Http\Controllers;

use App\Exports\AreasEstudioExport;
use App\Models\AreaEstudio;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AreaEstudioController extends Controller
{
    /**
     * Mostrar el listado de áreas de estudio.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);

        // Validar los campos permitidos para ordenar.
        if (! in_array($orden, ['nombre', 'estado'], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $areasEstudio = AreaEstudio::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('nombre', 'like', "%{$buscar}%");
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('AreasEstudio/Index', [
            'areasEstudio' => $areasEstudio,
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
        return Inertia::render('AreasEstudio/Create');
    }

    /**
     * Guardar una nueva área de estudio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
                'unique:areas_estudio,nombre',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        AreaEstudio::create($validated);

        return redirect()
            ->route('areas-estudio.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Área de estudio creada correctamente.',
            ]);
    }

    /**
     * Mostrar un área de estudio específica.
     */
    public function show(AreaEstudio $areaEstudio)
    {
        abort_unless($areaEstudio->estado, 404);

        return Inertia::render('AreasEstudio/Show', [
            'areaEstudio' => $areaEstudio,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(AreaEstudio $areaEstudio)
    {
        return Inertia::render('AreasEstudio/Edit', [
            'areaEstudio' => $areaEstudio,
        ]);
    }

    /**
     * Actualizar un área de estudio.
     */
    public function update(
        Request $request,
        AreaEstudio $areaEstudio
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
                Rule::unique('areas_estudio', 'nombre')
                    ->ignore($areaEstudio->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $areaEstudio->update($validated);

        return redirect()
            ->route('areas-estudio.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Área de estudio actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar un área de estudio.
     */
    public function destroy(AreaEstudio $areaEstudio)
    {
        $areaEstudio->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('areas-estudio.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Área de estudio desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar un área de estudio.
     */
    public function toggleEstado(AreaEstudio $areaEstudio)
    {
        $areaEstudio->update([
            'estado' => ! $areaEstudio->estado,
        ]);

        $accion = $areaEstudio->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('areas-estudio.index')
            ->with('success', [
                'type' => $areaEstudio->estado
                    ? 'updated'
                    : 'deleted',
                'message' => "Área de estudio {$accion} correctamente.",
            ]);
    }

    /**
     * Generar el reporte PDF de áreas de estudio.
     */
    public function reporte()
    {
        $areasEstudio = AreaEstudio::orderBy('nombre', 'asc')->get();

        $pdf = Pdf::loadView('areasestudio.reporte-areas-estudio', [
            'areasEstudio' => $areasEstudio,
        ]);

        return $pdf->stream('reporte-areas-estudio.pdf');
    }

    /**
     * Exportar las áreas de estudio a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new AreasEstudioExport,
            'reporte-areas-estudio.xlsx'
        );
    }
}

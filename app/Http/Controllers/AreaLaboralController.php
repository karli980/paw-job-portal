<?php

namespace App\Http\Controllers;

use App\Exports\AreasLaboralesExport;
use App\Models\AreaLaboral;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AreaLaboralController extends Controller
{
    /**
     * Mostrar el listado de áreas laborales.
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

        $areasLaborales = AreaLaboral::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('nombre', 'like', "%{$buscar}%");
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('AreasLaborales/Index', [
            'areasLaborales' => $areasLaborales,
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
        return Inertia::render('AreasLaborales/Create');
    }

    /**
     * Guardar una nueva área laboral.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
                'unique:areas_laborales,nombre',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        AreaLaboral::create($validated);

        return redirect()
            ->route('areas-laborales.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Área laboral creada correctamente.',
            ]);
    }

    /**
     * Mostrar un área laboral específica.
     */
    public function show(AreaLaboral $areaLaboral)
    {
        abort_unless($areaLaboral->estado, 404);

        return Inertia::render('AreasLaborales/Show', [
            'areaLaboral' => $areaLaboral,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(AreaLaboral $areaLaboral)
    {
        return Inertia::render('AreasLaborales/Edit', [
            'areaLaboral' => $areaLaboral,
        ]);
    }

    /**
     * Actualizar un área laboral.
     *
     * Si se desactiva, también se desactivan sus subáreas.
     */
    public function update(
        Request $request,
        AreaLaboral $areaLaboral
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
                Rule::unique('areas_laborales', 'nombre')
                    ->ignore($areaLaboral->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        DB::transaction(function () use ($areaLaboral, $validated) {
            $areaLaboral->update($validated);

            if (! $areaLaboral->estado) {
                $areaLaboral->subAreasLaborales()->update([
                    'estado' => false,
                ]);
            }
        });

        return redirect()
            ->route('areas-laborales.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Área laboral actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar un área laboral y todas sus subáreas.
     */
    public function destroy(AreaLaboral $areaLaboral)
    {
        DB::transaction(function () use ($areaLaboral) {
            $areaLaboral->update([
                'estado' => false,
            ]);

            $areaLaboral->subAreasLaborales()->update([
                'estado' => false,
            ]);
        });

        return redirect()
            ->route('areas-laborales.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Área laboral y sus subáreas desactivadas correctamente.',
            ]);
    }

    /**
     * Activar o desactivar un área laboral.
     *
     * Al desactivar, también se desactivan sus subáreas.
     * Al reactivar, las subáreas permanecen inactivas.
     */
    public function toggleEstado(AreaLaboral $areaLaboral)
    {
        $nuevoEstado = ! $areaLaboral->estado;

        DB::transaction(function () use ($areaLaboral, $nuevoEstado) {
            $areaLaboral->update([
                'estado' => $nuevoEstado,
            ]);

            if (! $nuevoEstado) {
                $areaLaboral->subAreasLaborales()->update([
                    'estado' => false,
                ]);
            }
        });

        $accion = $nuevoEstado ? 'activada' : 'desactivada';

        return redirect()
            ->route('areas-laborales.index')
            ->with('success', [
                'type' => $nuevoEstado ? 'updated' : 'deleted',
                'message' => "Área laboral {$accion} correctamente."
                    . (! $nuevoEstado
                        ? ' Sus subáreas también fueron desactivadas.'
                        : ''),
            ]);
    }

    /**
     * Generar el reporte PDF de áreas laborales.
     */
    public function reporte()
    {
        $areasLaborales = AreaLaboral::orderBy('nombre', 'asc')->get();

        $pdf = Pdf::loadView(
            'areaslaborales.reporte-areas-laborales',
            [
                'areasLaborales' => $areasLaborales,
            ]
        );

        return $pdf->stream('reporte-areas-laborales.pdf');
    }

    /**
     * Exportar las áreas laborales a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new AreasLaboralesExport,
            'reporte-areas-laborales.xlsx'
        );
    }
}

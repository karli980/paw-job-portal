<?php

namespace App\Http\Controllers;

use App\Exports\SubAreasLaboralesExport;
use App\Models\AreaLaboral;
use App\Models\SubAreaLaboral;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SubAreaLaboralController extends Controller
{
    /**
     * Comprobar que el área laboral de la subárea esté activa.
     *
     * Impide consultar o modificar subáreas cuyo padre esté inactivo.
     */
    private function asegurarAreaActiva(SubAreaLaboral $subAreaLaboral): void
    {
        abort_unless(
            $subAreaLaboral->areaLaboral()
                ->where('estado', true)
                ->exists(),
            404
        );
    }

    /**
     * Mostrar el listado de sub áreas laborales.
     */
    public function index(Request $request)
    {
        $buscar = $request->input('buscar', '');
        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);

        if (! in_array($orden, ['nombre', 'estado', 'area_laboral'], true)) {
            $orden = 'nombre';
        }

        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (! in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $subAreasLaborales = SubAreaLaboral::query()
            ->with('areaLaboral:id,nombre,estado')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subQuery) use ($buscar) {
                    $subQuery->where('nombre', 'like', "%{$buscar}%")
                        ->orWhereHas('areaLaboral', function ($areaQuery) use ($buscar) {
                            $areaQuery->where('nombre', 'like', "%{$buscar}%");
                        });
                });
            })
            ->when(
                $orden === 'area_laboral',
                fn ($query) => $query->orderBy(
                    AreaLaboral::select('nombre')
                        ->whereColumn(
                            'areas_laborales.id',
                            'sub_areas_laborales.area_laboral_id'
                        ),
                    $direccion
                ),
                fn ($query) => $query->orderBy($orden, $direccion)
            )
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('SubAreasLaborales/Index', [
            'subAreasLaborales' => $subAreasLaborales,
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
        return Inertia::render('SubAreasLaborales/Create', [
            'areasLaborales' => AreaLaboral::where('estado', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'estado']),
        ]);
    }

    /**
     * Guardar una nueva sub área laboral.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_laboral_id' => [
                'required',
                'integer',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],
            'nombre' => [
                'required',
                'string',
                'max:150',
                Rule::unique('sub_areas_laborales', 'nombre')
                    ->where('area_laboral_id', $request->input('area_laboral_id')),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        SubAreaLaboral::create($validated);

        return redirect()
            ->route('sub-areas-laborales.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Sub área laboral creada correctamente.',
            ]);
    }

    /**
     * Mostrar una sub área laboral específica.
     */
    public function show(SubAreaLaboral $subAreaLaboral)
    {
        $this->asegurarAreaActiva($subAreaLaboral);

        abort_unless($subAreaLaboral->estado, 404);

        $subAreaLaboral->load('areaLaboral:id,nombre,estado');

        return Inertia::render('SubAreasLaborales/Show', [
            'subAreaLaboral' => $subAreaLaboral,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(SubAreaLaboral $subAreaLaboral)
    {
        $this->asegurarAreaActiva($subAreaLaboral);

        $subAreaLaboral->load('areaLaboral:id,nombre,estado');

        return Inertia::render('SubAreasLaborales/Edit', [
            'subAreaLaboral' => $subAreaLaboral,
            'areasLaborales' => AreaLaboral::where('estado', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'estado']),
        ]);
    }

    /**
     * Actualizar una sub área laboral.
     */
    public function update(
        Request $request,
        SubAreaLaboral $subAreaLaboral
    ) {
        $this->asegurarAreaActiva($subAreaLaboral);

        $validated = $request->validate([
            'area_laboral_id' => [
                'required',
                'integer',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],
            'nombre' => [
                'required',
                'string',
                'max:150',
                Rule::unique('sub_areas_laborales', 'nombre')
                    ->where('area_laboral_id', $request->input('area_laboral_id'))
                    ->ignore($subAreaLaboral->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $subAreaLaboral->update($validated);

        return redirect()
            ->route('sub-areas-laborales.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Sub área laboral actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una sub área laboral.
     */
    public function destroy(SubAreaLaboral $subAreaLaboral)
    {
        $this->asegurarAreaActiva($subAreaLaboral);

        $subAreaLaboral->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('sub-areas-laborales.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Sub área laboral desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una sub área laboral.
     */
    public function toggleEstado(SubAreaLaboral $subAreaLaboral)
    {
        $this->asegurarAreaActiva($subAreaLaboral);

        $nuevoEstado = ! $subAreaLaboral->estado;

        // La verificación y actualización se realizan dentro
        // de una transacción para evitar cambios parciales.
        DB::transaction(function () use ($subAreaLaboral, $nuevoEstado) {
            $subAreaLaboral->update([
                'estado' => $nuevoEstado,
            ]);
        });

        $accion = $nuevoEstado ? 'activada' : 'desactivada';

        return redirect()
            ->route('sub-areas-laborales.index')
            ->with('success', [
                'type' => $nuevoEstado ? 'updated' : 'deleted',
                'message' => "Sub área laboral {$accion} correctamente.",
            ]);
    }

    /**
     * Generar el reporte PDF de sub áreas laborales.
     */
    public function reporte()
    {
        $subAreasLaborales = SubAreaLaboral::with('areaLaboral')
            ->orderBy('nombre')
            ->get();

        $pdf = Pdf::loadView(
            'subareaslaborales.reporte-sub-areas-laborales',
            [
                'subAreasLaborales' => $subAreasLaborales,
            ]
        );

        return $pdf->stream('reporte-sub-areas-laborales.pdf');
    }

    /**
     * Exportar las sub áreas laborales a Excel.
     */
    public function excel()
    {
        return Excel::download(
            new SubAreasLaboralesExport,
            'reporte-sub-areas-laborales.xlsx'
        );
    }
}

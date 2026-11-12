<?php

namespace App\Http\Controllers;

use App\Exports\IndustriasExport;
use App\Models\Industria;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class IndustriaController extends Controller
{
    /**
     * Mostrar el listado de industrias.
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

        $industrias = Industria::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('nombre', 'like', "%{$buscar}%");
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Industrias/Index', [
            'industrias' => $industrias,
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
        return Inertia::render('Industrias/Create');
    }

    /**
     * Guardar una nueva industria.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                'unique:industrias,nombre',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        Industria::create($validated);

        return redirect()
            ->route('industrias.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Industria creada correctamente.',
            ]);
    }

    /**
     * Mostrar una industria específica.
     */
    public function show(Industria $industria)
    {
        abort_unless($industria->estado, 404);

        return Inertia::render('Industrias/Show', [
            'industria' => $industria,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(Industria $industria)
    {
        return Inertia::render('Industrias/Edit', [
            'industria' => $industria,
        ]);
    }

    /**
     * Actualizar una industria.
     */
    public function update(Request $request, Industria $industria)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('industrias', 'nombre')
                    ->ignore($industria->id),
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $industria->update($validated);

        return redirect()
            ->route('industrias.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Industria actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una industria.
     */
    public function destroy(Industria $industria)
    {
        $industria->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('industrias.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Industria desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una industria.
     */
    public function toggleEstado(Industria $industria)
    {
        $industria->update([
            'estado' => ! $industria->estado,
        ]);

        $accion = $industria->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('industrias.index')
            ->with('success', [
                'type' => $industria->estado ? 'updated' : 'deleted',
                'message' => "Industria {$accion} correctamente.",
            ]);
    }

    public function reporte()
    {
        $industrias = Industria::orderBy('nombre', 'asc')->get();

        $pdf = Pdf::loadView('industrias.reporte', [
            'industrias' => $industrias,
        ]);

        return $pdf->stream('reporte-industrias.pdf');
    }

    public function excel()
    {
        return Excel::download(
            new IndustriasExport,
            'reporte-industrias.xlsx'
        );
    }
}

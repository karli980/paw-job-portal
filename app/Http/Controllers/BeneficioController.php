<?php

namespace App\Http\Controllers;

use App\Models\Beneficio;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BeneficiosExport;

class BeneficioController extends Controller
{
    /**
     * Mostrar los beneficios con búsqueda, ordenamiento y paginación.
     */
    public function index(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));

        $orden = $request->input('orden', 'nombre');
        $direccion = $request->input('direccion', 'asc');

        $camposPermitidos = ['nombre', 'estado', 'created_at'];

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

        $beneficios = Beneficio::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('descripcion', 'like', "%{$buscar}%");
                });
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('Beneficios/Index', [
            'beneficios' => $beneficios,
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
        return Inertia::render('Beneficios/Create');
    }

    /**
     * Guardar un nuevo beneficio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('beneficios', 'nombre'),
            ],
            'descripcion' => [
                'nullable',
                'string',
            ],
            'icono' => [
                'nullable',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        Beneficio::create($validated);

        return redirect()
            ->route('beneficios.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Beneficio creado correctamente.',
            ]);
    }

    /**
     * Mostrar un beneficio.
     */
    public function show(Beneficio $beneficio)
    {
        return Inertia::render('Beneficios/Show', [
            'beneficio' => $beneficio,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(Beneficio $beneficio)
    {
        return Inertia::render('Beneficios/Edit', [
            'beneficio' => $beneficio,
        ]);
    }

    /**
     * Actualizar un beneficio existente.
     */
    public function update(Request $request, Beneficio $beneficio)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('beneficios', 'nombre')
                    ->ignore($beneficio->id),
            ],
            'descripcion' => [
                'nullable',
                'string',
            ],
            'icono' => [
                'nullable',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $beneficio->update($validated);

        return redirect()
            ->route('beneficios.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Beneficio actualizado correctamente.',
            ]);
    }

    /**
     * Eliminación lógica: desactivar el beneficio.
     */
    public function destroy(Beneficio $beneficio)
    {
        $beneficio->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('beneficios.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Beneficio eliminado correctamente.',
            ]);
    }

    /**
     * Activar o desactivar un beneficio.
     */
    public function toggleEstado(Beneficio $beneficio)
    {
        $beneficio->update([
            'estado' => ! $beneficio->estado,
        ]);

        $accion = $beneficio->estado
            ? 'activado'
            : 'desactivado';

        return redirect()
            ->route('beneficios.index')
            ->with('success', [
                'type' => $beneficio->estado
                    ? 'updated'
                    : 'deleted',
                'message' => "Beneficio {$accion} correctamente.",
            ]);
    }

    public function reporte()
    {
        $beneficios = Beneficio::orderBy('nombre')->get();

        $pdf = Pdf::loadView(
            'beneficios.reporte-beneficios',
            compact('beneficios')
        )->setPaper('a4', 'portrait');

        return $pdf->stream('reporte-beneficios.pdf');
    }

    public function excel()
    {
        return Excel::download(
            new BeneficiosExport,
            'beneficios.xlsx'
        );
    }
}

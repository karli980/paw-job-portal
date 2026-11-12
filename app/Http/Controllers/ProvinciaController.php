<?php

namespace App\Http\Controllers;

use App\Models\Pais;
use App\Models\Provincia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProvinciaController extends Controller
{
    /**
     * Listado de provincias.
     */
    public function index()
    {
        $provincias = Provincia::with('pais')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Provincias/Index', [
            'provincia' => $provincias,
        ]);
    }

    /**
     * Formulario de creación.
     */
    public function create()
    {
        return Inertia::render('Provincias/Create');
    }

    /**
     * Registrar una provincia.
     */
    public function store(Request $request)
    {
        $pais = Pais::where('codigo_iso', 'AR')
            ->firstOrFail();

        // No permitir crear provincias cuando
        // Argentina está desactivada.
        if (! $pais->estado) {
            throw ValidationException::withMessages([
                'estado' => 'No se pueden crear provincias porque Argentina está desactivada.',
            ]);
        }

        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('provincias', 'nombre')
                    ->where('pais_id', $pais->id),
            ],
            'estado' => ['required', 'boolean'],
        ]);

        $pais->provincias()->create($validated);

        return redirect()
            ->route('provincias.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Provincia creada correctamente.',
            ]);
    }

    /**
     * Mostrar una provincia.
     */
    public function show(Provincia $provincia)
    {
        abort_unless($provincia->estado, 404);

        $provincia->load('pais');

        return Inertia::render('Provincias/Show', [
            'provincia' => $provincia,
        ]);
    }

    /**
     * Formulario de edición.
     */
    public function edit(Provincia $provincia)
    {
        $provincia->load('pais');

        return Inertia::render('Provincias/Edit', [
            'provincia' => $provincia,
        ]);
    }

    /**
     * Actualizar una provincia.
     */
    public function update(Request $request, Provincia $provincia)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('provincias', 'nombre')
                    ->where('pais_id', $provincia->pais_id)
                    ->ignore($provincia->id),
            ],
            'estado' => ['required', 'boolean'],
        ]);

        // Centralizamos la actualización y
        // la desactivación de ciudades.
        $this->actualizarConCascada($provincia, $validated);

        return redirect()
            ->route('provincias.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Provincia actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una provincia.
     */
    public function destroy(Provincia $provincia)
    {
        $this->actualizarConCascada($provincia, [
            'estado' => false,
        ]);

        return redirect()
            ->route('provincias.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Provincia y sus ciudades desactivadas correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una provincia.
     */
    public function toggleEstado(Provincia $provincia)
    {
        $nuevoEstado = ! (bool) $provincia->estado;

        $this->actualizarConCascada($provincia, [
            'estado' => $nuevoEstado,
        ]);

        $accion = $nuevoEstado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('provincias.index')
            ->with('success', [
                'type' => $nuevoEstado ? 'updated' : 'deleted',
                'message' => "Provincia {$accion} correctamente.",
            ]);
    }

    /**
     * Actualizar provincia y desactivar sus ciudades
     * cuando la provincia queda inactiva.
     */
    private function actualizarConCascada(
        Provincia $provincia,
        array $datos
    ): void {
        DB::transaction(function () use ($provincia, $datos) {

            $nuevoEstado = array_key_exists('estado', $datos)
                ? (bool) $datos['estado']
                : (bool) $provincia->estado;

            // No permitir una provincia activa
            // si su país está desactivado.
            if ($nuevoEstado) {
                $paisActivo = Pais::query()
                    ->whereKey($provincia->pais_id)
                    ->where('estado', true)
                    ->exists();

                if (! $paisActivo) {
                    throw ValidationException::withMessages([
                        'estado' => 'No se puede activar la provincia porque su país está inactivo.',
                    ]);
                }
            }

            // Actualizar la provincia.
            $provincia->update($datos);

            // Si la provincia queda activa, no
            // reactivar automáticamente las ciudades.
            if ((bool) $provincia->estado) {
                return;
            }

            // Desactivar todas sus ciudades.
            DB::table('ciudades')
                ->where('provincia_id', $provincia->id)
                ->update([
                    'estado' => false,
                    'updated_at' => now(),
                ]);
        });
    }
}

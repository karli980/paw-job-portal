<?php

namespace App\Http\Controllers;

use App\Models\AreaLaboral;
use App\Models\Candidato;
use App\Models\ExperienciaLaboral;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidatoExperienciaLaboralController extends Controller
{
    /**
     * Obtener el candidato autenticado.
     */
    private function obtenerCandidato(): Candidato
    {
        return Candidato::where('user_id', auth()->id())
            ->firstOrFail();
    }

    /**
     * Mostrar las experiencias laborales del candidato
     * y el catálogo de áreas y subáreas disponibles.
     */
    public function index()
    {
        $candidato = $this->obtenerCandidato();

        // Obtener las experiencias activas del candidato.
        // Se conservan las relaciones históricas aunque
        // el área o la subárea estén desactivadas.
        $experiencias = $candidato->experienciasLaborales()
            ->where('estado', true)
            ->with([
                'subAreaLaboral.areaLaboral',
            ])
            ->orderByDesc('fecha_inicio')
            ->get();

        // Obtener únicamente áreas y subáreas activas
        // para permitir nuevas selecciones.
        $areas = AreaLaboral::query()
            ->where('estado', true)
            ->with([
                'subAreasLaborales' => function ($query) {
                    $query->where('estado', true)
                        ->orderBy('nombre');
                },
            ])
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('CandidatoExperienciasLaborales/Index', [
            'experiencias' => $experiencias,
            'areas' => $areas,
        ]);
    }

    /**
     * Registrar una nueva experiencia laboral.
     */
    public function store(Request $request)
    {
        $candidato = $this->obtenerCandidato();

        // Si trabaja actualmente, no debe existir
        // una fecha de finalización.
        if ($request->boolean('trabaja_actualmente')) {
            $request->merge([
                'fecha_finalizacion' => null,
            ]);
        }

        $validated = $request->validate([
            'area_laboral_id' => [
                'required',
                'integer',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'sub_area_laboral_id' => [
                'required',
                'integer',
                Rule::exists('sub_areas_laborales', 'id')
                    ->where('estado', true)
                    ->where(
                        'area_laboral_id',
                        $request->input('area_laboral_id')
                    ),
            ],

            'nombre_empleador' => [
                'required',
                'string',
                'max:150',
            ],

            'puesto' => [
                'required',
                'string',
                'max:150',
            ],

            'fecha_inicio' => [
                'required',
                'date',
            ],

            'fecha_finalizacion' => [
                'nullable',
                'required_if:trabaja_actualmente,false',
                'date',
                'after_or_equal:fecha_inicio',
            ],

            'trabaja_actualmente' => [
                'required',
                'boolean',
            ],

            'responsabilidades' => [
                'required',
                'string',
            ],

            'personas_a_cargo' => [
                'nullable',
                'integer',
                'min:0',
                'max:65535',
            ],
        ]);

        // El área se utiliza para validar la selección,
        // pero no se almacena en experiencias_laborales.
        unset($validated['area_laboral_id']);

        $candidato->experienciasLaborales()->create([
            ...$validated,
            'estado' => true,
        ]);

        return back()->with('success', [
            'type' => 'created',
            'message' => 'Experiencia laboral agregada correctamente.',
        ]);
    }

    /**
     * Actualizar una experiencia laboral.
     */
    public function update(
        Request $request,
        ExperienciaLaboral $experienciaLaboral
    ) {
        $candidato = $this->obtenerCandidato();

        // Verificar que la experiencia pertenezca
        // al candidato autenticado y esté activa.
        abort_unless(
            (int) $experienciaLaboral->candidato_id === (int) $candidato->id
            && $experienciaLaboral->estado,
            404
        );

        // Obtener la clasificación histórica actual.
        $subAreaActual = $experienciaLaboral->subAreaLaboral()
            ->firstOrFail();

        $areaActualId = (int) $subAreaActual->area_laboral_id;
        $subAreaActualId = (int) $subAreaActual->id;

        $areaSeleccionadaId = (int) $request->input('area_laboral_id');
        $subAreaSeleccionadaId = (int) $request->input('sub_area_laboral_id');

        // Determinar si el candidato conserva exactamente
        // la misma área y subárea de su experiencia.
        $mantieneClasificacion =
            $areaSeleccionadaId === $areaActualId
            && $subAreaSeleccionadaId === $subAreaActualId;

        // Si trabaja actualmente, eliminar la fecha final.
        if ($request->boolean('trabaja_actualmente')) {
            $request->merge([
                'fecha_finalizacion' => null,
            ]);
        }

        // Reglas de validación de la clasificación.
        if ($mantieneClasificacion) {

            // Se permite conservar una clasificación histórica
            // aunque el área o la subárea estén desactivadas.
            $reglaArea = Rule::exists('areas_laborales', 'id');

            $reglaSubArea = Rule::exists('sub_areas_laborales', 'id')
                ->where('area_laboral_id', $areaActualId);

        } else {

            // Una nueva clasificación solamente puede utilizar
            // áreas y subáreas activas.
            $reglaArea = Rule::exists('areas_laborales', 'id')
                ->where('estado', true);

            $reglaSubArea = Rule::exists('sub_areas_laborales', 'id')
                ->where('estado', true)
                ->where('area_laboral_id', $areaSeleccionadaId);
        }

        $validated = $request->validate([
            'area_laboral_id' => [
                'required',
                'integer',
                $reglaArea,
            ],

            'sub_area_laboral_id' => [
                'required',
                'integer',
                $reglaSubArea,
            ],

            'nombre_empleador' => [
                'required',
                'string',
                'max:150',
            ],

            'puesto' => [
                'required',
                'string',
                'max:150',
            ],

            'fecha_inicio' => [
                'required',
                'date',
            ],

            'fecha_finalizacion' => [
                'nullable',
                'required_if:trabaja_actualmente,false',
                'date',
                'after_or_equal:fecha_inicio',
            ],

            'trabaja_actualmente' => [
                'required',
                'boolean',
            ],

            'responsabilidades' => [
                'required',
                'string',
            ],

            'personas_a_cargo' => [
                'nullable',
                'integer',
                'min:0',
                'max:65535',
            ],
        ]);

        // El área solamente se utiliza para validar
        // la clasificación y no se almacena en la tabla.
        unset($validated['area_laboral_id']);

        $experienciaLaboral->update($validated);

        return back()->with('success', [
            'type' => 'updated',
            'message' => 'Experiencia laboral actualizada correctamente.',
        ]);
    }

    /**
     * Desactivar una experiencia laboral.
     */
    public function destroy(
        ExperienciaLaboral $experienciaLaboral
    ) {
        $candidato = $this->obtenerCandidato();

        // Verificar propiedad y estado.
        abort_unless(
            (int) $experienciaLaboral->candidato_id === (int) $candidato->id
            && $experienciaLaboral->estado,
            404
        );

        // Baja lógica: se conserva el registro.
        $experienciaLaboral->update([
            'estado' => false,
        ]);

        return back()->with('success', [
            'type' => 'deleted',
            'message' => 'Experiencia laboral eliminada de tu perfil correctamente.',
        ]);
    }
}

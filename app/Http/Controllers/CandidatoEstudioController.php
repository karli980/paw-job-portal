<?php

namespace App\Http\Controllers;

use App\Models\AreaEstudio;
use App\Models\Candidato;
use App\Models\EstadoEstudio;
use App\Models\Estudio;
use App\Models\NivelEstudio;
use App\Models\Pais;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidatoEstudioController extends Controller
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
     * Mostrar los estudios del candidato
     * y los catálogos disponibles.
     */
    public function index()
    {
        $candidato = $this->obtenerCandidato();

        // Obtener los estudios activos del candidato.
        // Se conservan las relaciones históricas aunque
        // alguno de sus catálogos esté desactivado.
        $estudios = $candidato->estudios()
            ->where('estado', true)
            ->with([
                'pais',
                'estadoEstudio',
                'areaEstudio',
                'nivelEstudio',
            ])
            ->orderByDesc('fecha_inicio')
            ->get();

        // Obtener únicamente catálogos activos
        // para permitir nuevas selecciones.
        $paises = Pais::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $estadosEstudio = EstadoEstudio::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $areasEstudio = AreaEstudio::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $nivelesEstudio = NivelEstudio::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('CandidatoEstudios/Index', [
            'estudios' => $estudios,
            'paises' => $paises,
            'estadosEstudio' => $estadosEstudio,
            'areasEstudio' => $areasEstudio,
            'nivelesEstudio' => $nivelesEstudio,
        ]);
    }

    /**
     * Registrar un nuevo estudio.
     */
    public function store(Request $request)
    {
        $candidato = $this->obtenerCandidato();

        // Identificar el estado académico seleccionado.
        $estadoEstudio = EstadoEstudio::find(
            $request->input('estado_estudio_id')
        );

        // Si el estudio está en curso, no debe existir
        // una fecha de finalización.
        if ($estadoEstudio?->nombre === 'En Curso') {
            $request->merge([
                'fecha_finalizacion' => null,
            ]);
        }

        $graduadoId = EstadoEstudio::where('nombre', 'Graduado')
            ->value('id');

        $validated = $request->validate([
            'pais_id' => [
                'required',
                'integer',
                Rule::exists('paises', 'id')
                    ->where('estado', true),
            ],

            'estado_estudio_id' => [
                'required',
                'integer',
                Rule::exists('estado_estudios', 'id')
                    ->where('estado', true),
            ],

            'area_estudio_id' => [
                'required',
                'integer',
                Rule::exists('areas_estudio', 'id')
                    ->where('estado', true),
            ],

            'nivel_estudio_id' => [
                'required',
                'integer',
                Rule::exists('niveles_estudio', 'id')
                    ->where('estado', true),
            ],

            'titulo' => [
                'required',
                'string',
                'max:150',
            ],

            'institucion' => [
                'required',
                'string',
                'max:150',
            ],

            'fecha_inicio' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'fecha_finalizacion' => [
                'nullable',
                Rule::requiredIf(
                    $graduadoId !== null
                    && (int) $request->input('estado_estudio_id') === (int) $graduadoId
                ),
                'date',
                'after_or_equal:fecha_inicio',
                'before_or_equal:today',
            ],
        ]);

        // El candidato se establece desde el servidor.
        // Nunca se acepta candidato_id enviado desde el formulario.
        $candidato->estudios()->create([
            ...$validated,
            'estado' => true,
        ]);

        return back()->with('success', [
            'type' => 'created',
            'message' => 'Estudio agregado correctamente.',
        ]);
    }

    /**
     * Actualizar un estudio del candidato.
     */
    public function update(
        Request $request,
        Estudio $estudio
    ) {
        $candidato = $this->obtenerCandidato();

        // Verificar que el estudio pertenezca
        // al candidato autenticado y esté activo.
        abort_unless(
            (int) $estudio->candidato_id === (int) $candidato->id
            && $estudio->estado,
            404
        );

        // Obtener las relaciones actuales para permitir
        // conservar selecciones históricas desactivadas.
        $paisActualId = (int) $estudio->pais_id;
        $estadoActualId = (int) $estudio->estado_estudio_id;
        $areaActualId = (int) $estudio->area_estudio_id;
        $nivelActualId = (int) $estudio->nivel_estudio_id;

        $paisSeleccionadoId = (int) $request->input('pais_id');
        $estadoSeleccionadoId = (int) $request->input('estado_estudio_id');
        $areaSeleccionadaId = (int) $request->input('area_estudio_id');
        $nivelSeleccionadoId = (int) $request->input('nivel_estudio_id');

        // Identificar el estado académico seleccionado.
        $estadoEstudio = EstadoEstudio::find(
            $request->input('estado_estudio_id')
        );

        // Si el estudio está en curso, eliminar
        // cualquier fecha de finalización enviada.
        if ($estadoEstudio?->nombre === 'En Curso') {
            $request->merge([
                'fecha_finalizacion' => null,
            ]);
        }

        $graduadoId = EstadoEstudio::where('nombre', 'Graduado')
            ->value('id');

        // Para cada catálogo se permite conservar el valor
        // actual aunque esté desactivado.
        // Una selección diferente debe estar activa.
        $reglaPais = $paisSeleccionadoId === $paisActualId
            ? Rule::exists('paises', 'id')
            : Rule::exists('paises', 'id')->where('estado', true);

        $reglaEstado = $estadoSeleccionadoId === $estadoActualId
            ? Rule::exists('estado_estudios', 'id')
            : Rule::exists('estado_estudios', 'id')->where('estado', true);

        $reglaArea = $areaSeleccionadaId === $areaActualId
            ? Rule::exists('areas_estudio', 'id')
            : Rule::exists('areas_estudio', 'id')->where('estado', true);

        $reglaNivel = $nivelSeleccionadoId === $nivelActualId
            ? Rule::exists('niveles_estudio', 'id')
            : Rule::exists('niveles_estudio', 'id')->where('estado', true);

        $validated = $request->validate([
            'pais_id' => [
                'required',
                'integer',
                $reglaPais,
            ],

            'estado_estudio_id' => [
                'required',
                'integer',
                $reglaEstado,
            ],

            'area_estudio_id' => [
                'required',
                'integer',
                $reglaArea,
            ],

            'nivel_estudio_id' => [
                'required',
                'integer',
                $reglaNivel,
            ],

            'titulo' => [
                'required',
                'string',
                'max:150',
            ],

            'institucion' => [
                'required',
                'string',
                'max:150',
            ],

            'fecha_inicio' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'fecha_finalizacion' => [
                'nullable',
                Rule::requiredIf(
                    $graduadoId !== null
                    && (int) $request->input('estado_estudio_id') === (int) $graduadoId
                ),
                'date',
                'after_or_equal:fecha_inicio',
                'before_or_equal:today',
            ],
        ]);

        $estudio->update($validated);

        return back()->with('success', [
            'type' => 'updated',
            'message' => 'Estudio actualizado correctamente.',
        ]);
    }

    /**
     * Desactivar un estudio del candidato.
     */
    public function destroy(Estudio $estudio)
    {
        $candidato = $this->obtenerCandidato();

        // Verificar propiedad y estado.
        abort_unless(
            (int) $estudio->candidato_id === (int) $candidato->id
            && $estudio->estado,
            404
        );

        // Baja lógica: se conserva el registro.
        $estudio->update([
            'estado' => false,
        ]);

        return back()->with('success', [
            'type' => 'deleted',
            'message' => 'Estudio eliminado de tu perfil correctamente.',
        ]);
    }
}

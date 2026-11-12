<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\OfertaLaboral;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OfertaLaboralController extends Controller
{
    /**
     * Listar las ofertas laborales de una empresa.
     */
    public function index(Request $request, Empresa $empresa): Response
    {
        // 1. Autorizar el acceso a esta empresa.
        Gate::authorize('viewCompany', [
            OfertaLaboral::class,
            $empresa,
        ]);

        // 2. Validar los parámetros de búsqueda.
        $filtros = $request->validate([
            'buscar' => ['nullable', 'string', 'max:180'],

            'estado_id' => [
                'nullable',
                'integer',
                Rule::exists(
                    'estados_ofertas_laborales',
                    'id'
                ),
            ],

            'per_page' => [
                'nullable',
                'integer',
                Rule::in([5, 10, 20]),
            ],
        ]);

        $buscar = trim($filtros['buscar'] ?? '');
        $estadoId = $filtros['estado_id'] ?? null;
        $porPagina = (int) ($filtros['per_page'] ?? 10);

        // 3. Consulta base: exclusivamente esta empresa.
        $consultaEmpresa = OfertaLaboral::query()
            ->where('empresa_id', $empresa->id);

        // 4. Estadísticas sin aplicar filtros de búsqueda.
        $total = (clone $consultaEmpresa)->count();

        $conteosPorEstado = (clone $consultaEmpresa)
            ->join(
                'estados_ofertas_laborales',
                'ofertas_laborales.estado_oferta_id',
                '=',
                'estados_ofertas_laborales.id'
            )
            ->select(
                'estados_ofertas_laborales.nombre',
                DB::raw('COUNT(*) as cantidad')
            )
            ->groupBy('estados_ofertas_laborales.nombre')
            ->pluck('cantidad', 'nombre');

        $estadisticas = [
            'total' => $total,
            'publicadas' => (int) $conteosPorEstado->get(
                'Publicada',
                0
            ),
            'borradores' => (int) $conteosPorEstado->get(
                'Borrador',
                0
            ),
            'pausadas' => (int) $conteosPorEstado->get(
                'Pausada',
                0
            ),
        ];

        // 5. Aplicar filtros sobre la consulta empresarial.
        $consulta = OfertaLaboral::query()
            ->where('empresa_id', $empresa->id)
            ->with([
                'estadoOferta',
                'modalidadTrabajo',
                'areaLaboral',
                'subAreaLaboral',
            ]);

        if ($buscar !== '') {
            $consulta->where('titulo', 'like', '%'.$buscar.'%');
        }

        if ($estadoId !== null) {
            $consulta->where(
                'estado_oferta_id',
                $estadoId
            );
        }

        // 6. Obtener resultados paginados.
        $ofertas = $consulta
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($porPagina)
            ->withQueryString();

        // 7. Estados disponibles para los filtros.
        $estados = DB::table('estados_ofertas_laborales')
            ->where('estado', true)
            ->orderBy('id')
            ->get([
                'id',
                'nombre',
            ]);

        $ofertas->getCollection()->each(function (OfertaLaboral $oferta) {
            $oferta->setAttribute(
                'puede_editar',
                $oferta->estadoOferta?->nombre === 'Borrador'
                    && Gate::allows('update', $oferta)
            );
        });

        // 8. Enviar los datos a React mediante Inertia.
        return Inertia::render('Empresa/Ofertas/Index', [
            'empresa' => [
                'id' => $empresa->id,
                'nombre_comercial' => $empresa->nombre_comercial,
            ],

            'permisos' => [
                'crear' => Gate::allows('create', [
                    OfertaLaboral::class,
                    $empresa,
                ]),
            ],

            'ofertas' => $ofertas,

            'estadisticas' => $estadisticas,

            'estados' => $estados,

            'filtros' => [
                'buscar' => $buscar,
                'estado_id' => $estadoId,
                'per_page' => $porPagina,
            ],
        ]);
    }

    /**
     * Mostrar el formulario de creación de una oferta laboral.
     */

    /**
     * Mostrar el formulario para crear una oferta laboral.
     */
    public function create(Empresa $empresa): Response
    {
        // 1. Verificar que el usuario pueda crear ofertas
        // laborales para esta empresa.
        Gate::authorize('create', [
            OfertaLaboral::class,
            $empresa,
        ]);

        // 2. Modalidades de trabajo.
        $modalidades = DB::table('modalidades_trabajos')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        // 3. Áreas laborales.
        $areasLaborales = DB::table('areas_laborales')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        // 4. Subáreas laborales activas.
        $subAreasLaborales = DB::table('sub_areas_laborales')
            ->where('estado', true)
            ->whereIn('area_laboral_id', $areasLaborales->pluck('id'))
            ->orderBy('nombre')
            ->get([
                'id',
                'area_laboral_id',
                'nombre',
            ]);

        // 5. Países activos.
        $paises = DB::table('paises')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get([
                'id',
                'nombre',
                'codigo_iso',
            ]);

        // 6. Provincias activas de países activos.
        $provincias = DB::table('provincias')
            ->where('estado', true)
            ->whereIn('pais_id', $paises->pluck('id'))
            ->orderBy('nombre')
            ->get([
                'id',
                'pais_id',
                'nombre',
            ]);

        // 7. Ciudades activas de provincias activas.
        $ciudades = DB::table('ciudades')
            ->where('estado', true)
            ->whereIn('provincia_id', $provincias->pluck('id'))
            ->orderBy('nombre')
            ->get([
                'id',
                'provincia_id',
                'nombre',
            ]);

        // 8. Monedas activas.
        $monedas = DB::table('monedas')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get([
                'id',
                'nombre',
                'simbolo',
                'codigo',
            ]);

        // 9. Enviar los catálogos al formulario React.
        return Inertia::render('Empresa/Ofertas/Create', [
            'empresa' => [
                'id' => $empresa->id,
                'nombre_comercial' => $empresa->nombre_comercial,
            ],

            'modalidades' => $modalidades,
            'areasLaborales' => $areasLaborales,
            'subAreasLaborales' => $subAreasLaborales,

            'paises' => $paises,
            'provincias' => $provincias,
            'ciudades' => $ciudades,

            'monedas' => $monedas,
        ]);
    }

    /**
     * Guardar una nueva oferta laboral como borrador.
     */
    public function store(Request $request, Empresa $empresa): RedirectResponse
    {
        // 1. Autorizar la creación para esta empresa.
        Gate::authorize('create', [
            OfertaLaboral::class,
            $empresa,
        ]);

        // 2. Validar los datos editables del formulario.
        $datos = $request->validate([
            'titulo' => ['nullable', 'string', 'max:180'],
            'resumen' => ['nullable', 'string', 'max:300'],
            'descripcion' => ['nullable', 'string'],

            'area_laboral_id' => [
                'nullable',
                'integer',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'sub_area_laboral_id' => [
                'nullable',
                'integer',
                Rule::exists('sub_areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'modalidad_trabajo_id' => [
                'nullable',
                'integer',
                Rule::exists('modalidades_trabajos', 'id')
                    ->where('estado', true),
            ],

            'vacantes' => [
                'nullable',
                'integer',
                'min:1',
                'max:100000',
            ],

            'pais_id' => [
                'nullable',
                'integer',
                Rule::exists('paises', 'id')
                    ->where('estado', true),
            ],

            'provincia_id' => [
                'nullable',
                'integer',
                Rule::exists('provincias', 'id')
                    ->where('estado', true),
            ],

            'ciudad_id' => [
                'nullable',
                'integer',
                Rule::exists('ciudades', 'id')
                    ->where('estado', true),
            ],

            'salario_minimo' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999999.99',
            ],

            'salario_maximo' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999999.99',
            ],

            'moneda_id' => [
                'nullable',
                'integer',
                Rule::exists('monedas', 'id')
                    ->where('estado', true),
            ],
        ]);

        // 3. Validar la relación área/subárea.
        if (! empty($datos['sub_area_laboral_id'])) {
            $subAreaValida = DB::table('sub_areas_laborales')
                ->where('id', $datos['sub_area_laboral_id'])
                ->where('area_laboral_id', $datos['area_laboral_id'] ?? null)
                ->exists();

            if (! $subAreaValida) {
                throw ValidationException::withMessages([
                    'sub_area_laboral_id' => 'La subárea no corresponde al área seleccionada.',
                ]);
            }
        }

        // 4. Validar país y provincia.
        if (! empty($datos['provincia_id'])) {
            $provinciaValida = DB::table('provincias')
                ->where('id', $datos['provincia_id'])
                ->where('pais_id', $datos['pais_id'] ?? null)
                ->exists();

            if (! $provinciaValida) {
                throw ValidationException::withMessages([
                    'provincia_id' => 'La provincia no corresponde al país seleccionado.',
                ]);
            }
        }

        // 5. Validar provincia y ciudad.
        if (! empty($datos['ciudad_id'])) {
            $ciudadValida = DB::table('ciudades')
                ->where('id', $datos['ciudad_id'])
                ->where('provincia_id', $datos['provincia_id'] ?? null)
                ->exists();

            if (! $ciudadValida) {
                throw ValidationException::withMessages([
                    'ciudad_id' => 'La ciudad no corresponde a la provincia seleccionada.',
                ]);
            }
        }

        // 6. Validar rango salarial.
        if (
            isset($datos['salario_minimo'], $datos['salario_maximo'])
            && (float) $datos['salario_maximo']
                < (float) $datos['salario_minimo']
        ) {
            throw ValidationException::withMessages([
                'salario_maximo' => 'El salario máximo no puede ser menor que el mínimo.',
            ]);
        }

        // 7. Obtener el estado Borrador desde el catálogo.
        $estadoBorradorId = DB::table('estados_ofertas_laborales')
            ->where('nombre', 'Borrador')
            ->value('id');

        if (! $estadoBorradorId) {
            throw new \LogicException(
                'No existe el estado Borrador en el catálogo.'
            );
        }

        // 8. Generar un slug único cuando exista título.
        $titulo = $datos['titulo'] ?? null;

        $slug = $titulo
            ? Str::slug($titulo).'-'.Str::uuid()
            : null;

        // 9. Guardar exclusivamente los campos permitidos.
        DB::table('ofertas_laborales')->insert([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $estadoBorradorId,

            'titulo' => $titulo,
            'slug' => $slug,
            'resumen' => $datos['resumen'] ?? null,
            'descripcion' => $datos['descripcion'] ?? null,

            'area_laboral_id' => $datos['area_laboral_id'] ?? null,
            'sub_area_laboral_id' => $datos['sub_area_laboral_id'] ?? null,
            'modalidad_trabajo_id' => $datos['modalidad_trabajo_id'] ?? null,

            'vacantes' => $datos['vacantes'] ?? 1,

            'pais_id' => $datos['pais_id'] ?? null,
            'provincia_id' => $datos['provincia_id'] ?? null,
            'ciudad_id' => $datos['ciudad_id'] ?? null,

            'salario_minimo' => $datos['salario_minimo'] ?? null,
            'salario_maximo' => $datos['salario_maximo'] ?? null,
            'moneda_id' => $datos['moneda_id'] ?? null,

            'salario_visible' => false,
            'salario_negociable' => false,
            'identidad_empresa_visible' => true,
            'es_urgente' => false,

            'fecha_publicacion' => null,

            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 10. Volver al listado de la misma empresa.
        return redirect()
            ->route('empresa.ofertas.index', [
                'empresa' => $empresa->id,
            ])
            ->with(
                'success',
                'La oferta laboral se guardó como borrador.'
            );
    }

    /**
     * Mostrar el formulario para editar una oferta laboral.
     */
    public function edit(
        Empresa $empresa,
        OfertaLaboral $oferta
    ): Response {
        // 1. Verificar que la oferta pertenezca
        // a la empresa indicada en la URL.
        abort_unless(
            (int) $oferta->empresa_id === (int) $empresa->id,
            404
        );

        // 2. Autorizar la edición mediante la política.
        Gate::authorize('update', $oferta);

        // 3. Catálogos necesarios para el formulario.
        $modalidades = DB::table('modalidades_trabajos')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $areasLaborales = DB::table('areas_laborales')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $subAreasLaborales = DB::table('sub_areas_laborales')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'area_laboral_id', 'nombre']);

        $paises = DB::table('paises')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo_iso']);

        $provincias = DB::table('provincias')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'pais_id', 'nombre']);

        $ciudades = DB::table('ciudades')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'provincia_id', 'nombre']);

        $monedas = DB::table('monedas')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'simbolo', 'codigo']);

        // 4. Enviar la oferta y los catálogos a React.
        return Inertia::render('Empresa/Ofertas/Edit', [
            'empresa' => [
                'id' => $empresa->id,
                'nombre_comercial' => $empresa->nombre_comercial,
            ],

            'oferta' => [
                'id' => $oferta->id,
                'titulo' => $oferta->titulo,
                'resumen' => $oferta->resumen,
                'descripcion' => $oferta->descripcion,
                'area_laboral_id' => $oferta->area_laboral_id,
                'sub_area_laboral_id' => $oferta->sub_area_laboral_id,
                'modalidad_trabajo_id' => $oferta->modalidad_trabajo_id,
                'vacantes' => $oferta->vacantes,
                'pais_id' => $oferta->pais_id,
                'provincia_id' => $oferta->provincia_id,
                'ciudad_id' => $oferta->ciudad_id,
                'salario_minimo' => $oferta->salario_minimo,
                'salario_maximo' => $oferta->salario_maximo,
                'moneda_id' => $oferta->moneda_id,
            ],

            'modalidades' => $modalidades,
            'areasLaborales' => $areasLaborales,
            'subAreasLaborales' => $subAreasLaborales,
            'paises' => $paises,
            'provincias' => $provincias,
            'ciudades' => $ciudades,
            'monedas' => $monedas,
        ]);
    }

    /**
     * Actualizar una oferta laboral en estado Borrador.
     */
    public function update(
        Request $request,
        Empresa $empresa,
        OfertaLaboral $oferta
    ): RedirectResponse {
        // 1. Comprobar que la oferta pertenece a esta empresa.
        abort_unless(
            (int) $oferta->empresa_id === (int) $empresa->id,
            404
        );

        // 2. Comprobar permisos de edición.
        Gate::authorize('update', $oferta);

        // 3. Por ahora, solamente editaremos borradores.
        $estadoBorradorId = DB::table('estados_ofertas_laborales')
            ->where('nombre', 'Borrador')
            ->value('id');

        if (! $estadoBorradorId) {
            throw new \LogicException(
                'No existe el estado Borrador.'
            );
        }

        abort_unless(
            (int) $oferta->estado_oferta_id === (int) $estadoBorradorId,
            403,
            'Esta oferta no está en estado Borrador.'
        );

        // 4. Validar los campos que pueden modificarse.
        $datos = $request->validate([
            'titulo' => ['nullable', 'string', 'max:180'],
            'resumen' => ['nullable', 'string', 'max:300'],
            'descripcion' => ['nullable', 'string'],

            'area_laboral_id' => [
                'nullable',
                'integer',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'sub_area_laboral_id' => [
                'nullable',
                'integer',
                Rule::exists('sub_areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'modalidad_trabajo_id' => [
                'nullable',
                'integer',
                Rule::exists('modalidades_trabajos', 'id')
                    ->where('estado', true),
            ],

            'vacantes' => [
                'nullable',
                'integer',
                'min:1',
                'max:100000',
            ],

            'pais_id' => [
                'nullable',
                'integer',
                Rule::exists('paises', 'id')
                    ->where('estado', true),
            ],

            'provincia_id' => [
                'nullable',
                'integer',
                Rule::exists('provincias', 'id')
                    ->where('estado', true),
            ],

            'ciudad_id' => [
                'nullable',
                'integer',
                Rule::exists('ciudades', 'id')
                    ->where('estado', true),
            ],

            'salario_minimo' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999999.99',
            ],

            'salario_maximo' => [
                'nullable',
                'numeric',
                'min:0',
                'max:9999999999999.99',
            ],

            'moneda_id' => [
                'nullable',
                'integer',
                Rule::exists('monedas', 'id')
                    ->where('estado', true),
            ],
        ]);

        // 5. Validar que la subárea pertenezca al área.
        if (! empty($datos['sub_area_laboral_id'])) {
            $valida = DB::table('sub_areas_laborales')
                ->where('id', $datos['sub_area_laboral_id'])
                ->where('area_laboral_id', $datos['area_laboral_id'] ?? null)
                ->exists();

            if (! $valida) {
                throw ValidationException::withMessages([
                    'sub_area_laboral_id' => 'La subárea no corresponde al área seleccionada.',
                ]);
            }
        }

        // 6. Validar país y provincia.
        if (! empty($datos['provincia_id'])) {
            $valida = DB::table('provincias')
                ->where('id', $datos['provincia_id'])
                ->where('pais_id', $datos['pais_id'] ?? null)
                ->exists();

            if (! $valida) {
                throw ValidationException::withMessages([
                    'provincia_id' => 'La provincia no corresponde al país seleccionado.',
                ]);
            }
        }

        // 7. Validar provincia y ciudad.
        if (! empty($datos['ciudad_id'])) {
            $valida = DB::table('ciudades')
                ->where('id', $datos['ciudad_id'])
                ->where('provincia_id', $datos['provincia_id'] ?? null)
                ->exists();

            if (! $valida) {
                throw ValidationException::withMessages([
                    'ciudad_id' => 'La ciudad no corresponde a la provincia seleccionada.',
                ]);
            }
        }

        // 8. Validar el rango salarial.
        if (
            isset($datos['salario_minimo'], $datos['salario_maximo'])
            && (float) $datos['salario_maximo']
                < (float) $datos['salario_minimo']
        ) {
            throw ValidationException::withMessages([
                'salario_maximo' => 'El salario máximo no puede ser menor que el mínimo.',
            ]);
        }

        // 9. Actualizar exclusivamente los datos permitidos.
        // La empresa, el estado y la fecha de publicación no cambian.
        $campos = [
            'titulo',
            'resumen',
            'descripcion',
            'area_laboral_id',
            'sub_area_laboral_id',
            'modalidad_trabajo_id',
            'vacantes',
            'pais_id',
            'provincia_id',
            'ciudad_id',
            'salario_minimo',
            'salario_maximo',
            'moneda_id',
        ];

        $actualizacion = [];

        foreach ($campos as $campo) {
            if (array_key_exists($campo, $datos)) {
                $actualizacion[$campo] = $datos[$campo];
            }
        }

        // El título puede modificarse sin cambiar el slug existente.
        $actualizacion['updated_at'] = now();

        DB::table('ofertas_laborales')
            ->where('id', $oferta->id)
            ->where('empresa_id', $empresa->id)
            ->where('estado_oferta_id', $estadoBorradorId)
            ->whereNull('deleted_at')
            ->update($actualizacion);

        // 10. Regresar al listado empresarial.
        return redirect()
            ->route('empresa.ofertas.index', [
                'empresa' => $empresa->id,
            ])
            ->with(
                'success',
                'El borrador se actualizó correctamente.'
            );
    }
}

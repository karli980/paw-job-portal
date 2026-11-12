<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Agrupación de permisos para la interfaz administrativa.
     *
     * Cuando agreguemos nuevos módulos, podremos ampliar
     * este listado.
     */
    private const GRUPOS = [
        'Usuarios' => [
            'listar usuarios',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',
        ],

        'Roles y permisos' => [
            'listar roles',
            'gestionar roles',
            'listar permisos',
            'gestionar permisos',
        ],

        'Testimonios' => [
            'listar testimonios',
            'moderar testimonios',
            'destacar testimonios',
            'eliminar testimonios',
        ],

        'Ubicaciones' => [
            'listar ubicaciones',
            'gestionar ubicaciones',
        ],

        'Formación académica' => [
            'listar formacion',
            'gestionar formacion',
        ],

        'Experiencia laboral' => [
            'listar experiencia laboral',
            'gestionar experiencia laboral',
        ],

        'Competencias' => [
            'listar competencias',
            'gestionar competencias',
        ],

        'Empresas' => [
            'listar empresas',
            'gestionar empresas',
        ],

        'Datos generales' => [
            'listar datos generales',
            'gestionar datos generales',
        ],

        'Redes sociales' => [
            'listar redes sociales',
            'gestionar redes sociales',
        ],
    ];

    /**
     * Permisos reservados al Super Admin.
     */
    private const PERMISOS_RESERVADOS = [
        'gestionar roles',
        'gestionar permisos',
    ];

    /**
     * Mostrar los administradores y sus permisos.
     */
    public function index(Request $request): Response
    {
        $this->verificarSuperAdmin($request);

        $administradores = User::role('admin')
            ->with('roles')
            ->orderBy('nombre')
            ->orderBy('apellido')
            ->get([
                'id',
                'nombre',
                'apellido',
                'email',
                'estado',
            ])
            ->reject(
                fn (User $usuario) =>
                    $usuario->hasRole('super-admin')
                    || $usuario->is($request->user())
            )
            ->values();

        $idSolicitado = $request->integer('usuario');

        $seleccionado = $idSolicitado > 0
            ? $administradores->firstWhere('id', $idSolicitado)
            : $administradores->first();

        if ($idSolicitado > 0 && $seleccionado === null) {
            abort(404, 'Administrador no encontrado.');
        }

        return Inertia::render('Admin/Permisos/Index', [
            'administradores' => $administradores
                ->map(fn (User $usuario) => [
                    'id' => $usuario->id,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'email' => $usuario->email,
                    'estado' => $usuario->estado,
                ])
                ->all(),

            'administradorSeleccionado' => $seleccionado
                ? [
                    'id' => $seleccionado->id,
                    'nombre' => $seleccionado->nombre,
                    'apellido' => $seleccionado->apellido,
                    'email' => $seleccionado->email,

                    'permisosDirectos' => $seleccionado
                        ->getDirectPermissions()
                        ->pluck('name')
                        ->values()
                        ->all(),

                    'permisosHeredados' => $seleccionado
                        ->getPermissionsViaRoles()
                        ->pluck('name')
                        ->values()
                        ->all(),

                    'permisosEfectivos' => $seleccionado
                        ->getAllPermissions()
                        ->pluck('name')
                        ->values()
                        ->all(),
                ]
                : null,

            'gruposPermisos' => $this->obtenerGruposPermisos(),
        ]);
    }

    /**
     * Actualizar los permisos individuales de un administrador.
     *
     * No modifica los permisos asignados al rol admin.
     */
    public function update(
        Request $request,
        User $usuario
    ): RedirectResponse {
        $this->verificarSuperAdmin($request);
        $this->verificarAdministrador($request, $usuario);

        $datos = $request->validate([
            'permisos' => [
                'present',
                'array',
                'max:100',
            ],

            'permisos.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('permissions', 'name')
                    ->where('guard_name', 'web'),
            ],
        ]);

        $solicitados = collect($datos['permisos'])
            ->unique()
            ->values();

        $gestionables = collect(self::GRUPOS)
            ->flatten()
            ->diff(self::PERMISOS_RESERVADOS);

        $noPermitidos = $solicitados->diff($gestionables);

        if ($noPermitidos->isNotEmpty()) {
            throw ValidationException::withMessages([
                'permisos' => 'Se incluyeron permisos que no pueden asignarse desde este módulo.',
            ]);
        }

        /*
         * Conservamos cualquier permiso directo que esté
         * fuera del alcance de este formulario.
         */
        $noGestionablesActuales = $usuario
            ->getDirectPermissions()
            ->pluck('name')
            ->diff($gestionables);

        $permisosFinales = $solicitados
            ->merge($noGestionablesActuales)
            ->unique()
            ->values()
            ->all();

        /*
         * Spatie actualiza solamente los permisos directos
         * del usuario, sin alterar los permisos de su rol.
         */
        $usuario->syncPermissions($permisosFinales);

        return to_route('admin.permisos.index', [
            'usuario' => $usuario->id,
        ])->with(
            'success',
            'Los permisos del administrador se actualizaron correctamente.'
        );
    }

    /**
     * Verificar que el usuario autenticado sea Super Admin.
     */
    private function verificarSuperAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->hasRole('super-admin'),
            403,
            'No tenés autorización para gestionar permisos.'
        );
    }

    /**
     * Verificar que solamente se modifiquen administradores.
     */
    private function verificarAdministrador(
        Request $request,
        User $usuario
    ): void {
        abort_if(
            $usuario->is($request->user()),
            403,
            'No podés modificar tus propios permisos.'
        );

        abort_if(
            $usuario->hasRole('super-admin'),
            403,
            'No se pueden modificar los permisos de un Super Admin.'
        );

        abort_unless(
            $usuario->hasRole('admin'),
            403,
            'Solamente se pueden gestionar administradores.'
        );
    }

    /**
     * Preparar los permisos agrupados para React.
     */
    private function obtenerGruposPermisos(): array
    {
        $existentes = Permission::query()
            ->where('guard_name', 'web')
            ->get(['id', 'name'])
            ->keyBy('name');

        return collect(self::GRUPOS)
            ->map(function (array $nombres, string $grupo) use ($existentes) {
                $permisos = collect($nombres)
                    ->filter(fn (string $nombre) => $existentes->has($nombre))
                    ->map(fn (string $nombre) => [
                        'id' => $existentes->get($nombre)->id,
                        'nombre' => $nombre,
                        'reservado' => in_array(
                            $nombre,
                            self::PERMISOS_RESERVADOS,
                            true
                        ),
                    ])
                    ->values()
                    ->all();

                return [
                    'nombre' => $grupo,
                    'permisos' => $permisos,
                ];
            })
            ->filter(fn (array $grupo) => count($grupo['permisos']) > 0)
            ->values()
            ->all();
    }
}

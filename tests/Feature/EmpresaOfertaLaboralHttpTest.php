<?php

namespace Tests\Feature;

use App\Models\Empresa;
use App\Models\OfertaLaboral;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class EmpresaOfertaLaboralHttpTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Evitar que Vite intente resolver React
        // durante las pruebas HTTP.
        $this->withoutVite();

        // Limpiar la caché de permisos Spatie.
        app(PermissionRegistrar::class)
            ->forgetCachedPermissions();

        // Permiso para consultar ofertas.
        Permission::firstOrCreate([
            'name' => 'listar ofertas laborales',
            'guard_name' => 'web',
        ]);

        // Permiso para crear ofertas.
        Permission::firstOrCreate([
            'name' => 'crear ofertas laborales',
            'guard_name' => 'web',
        ]);

        // Rol empresarial.
        Role::firstOrCreate([
            'name' => 'representante_empresa',
            'guard_name' => 'web',
        ]);
    }

    public function test_representante_puede_acceder_al_listado_de_su_empresa(): void
    {
        // Usuario autenticado y con correo verificado.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');

        $usuario->givePermissionTo('listar ofertas laborales');

        // Crear empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Vincular al usuario con su empresa.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Realizar solicitud HTTP autenticada.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresa));

        // El representante debe poder acceder.
        $response->assertOk();

        // Comprobar que se devuelve la página Inertia correcta.

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('empresa.id', $empresa->id)
                ->where(
                    'empresa.nombre_comercial',
                    'Empresa de Prueba'
                )
                ->has('ofertas.data', 0)
        );

    }

    public function test_representante_no_puede_acceder_al_listado_de_otra_empresa(): void
    {
        // Crear representante con permiso de listado.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        // Crear empresa propia y empresa ajena.
        $empresaPropia = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
            'estado' => true,
        ]);

        $empresaAjena = Empresa::create([
            'nombre_comercial' => 'Empresa Ajena',
            'estado' => true,
        ]);

        // Vincular al usuario únicamente con su empresa.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresaPropia->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Intentar acceder al listado de la empresa ajena.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresaAjena));

        // El servidor debe rechazar el acceso.
        $response->assertForbidden();
    }

    public function test_el_listado_solo_incluye_ofertas_de_la_empresa_solicitada(): void
    {
        // Usuario autorizado para listar ofertas.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        // Crear dos empresas.
        $empresaPropia = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
            'estado' => true,
        ]);

        $empresaAjena = Empresa::create([
            'nombre_comercial' => 'Empresa Ajena',
            'estado' => true,
        ]);

        // Vincular el usuario únicamente a su empresa.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresaPropia->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Estado necesario para crear las ofertas.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        // Dos ofertas propias.
        $ofertaPropia1 = OfertaLaboral::create([
            'empresa_id' => $empresaPropia->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        $ofertaPropia2 = OfertaLaboral::create([
            'empresa_id' => $empresaPropia->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Diseñador UX/UI',
        ]);

        // Una oferta de otra empresa.
        $ofertaAjena = OfertaLaboral::create([
            'empresa_id' => $empresaAjena->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Analista de Sistemas',
        ]);

        // Solicitar el listado propio mediante Inertia.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresaPropia));

        $response->assertOk();

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->has('ofertas.data', 2)
                ->where('ofertas.total', 2)
                ->where('empresa.id', $empresaPropia->id)
        );

        // Comprobar los identificadores devueltos.
        $datos = $response->viewData('page')['props'];

        $ids = collect($datos['ofertas']['data'])
            ->pluck('id')
            ->all();

        $this->assertEqualsCanonicalizing(
            [$ofertaPropia1->id, $ofertaPropia2->id],
            $ids
        );

        $this->assertNotContains(
            $ofertaAjena->id,
            $ids
        );
    }

    public function test_representante_sin_permiso_no_puede_acceder_al_listado(): void
    {
        // Crear usuario representante, sin permiso de listado.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');

        // Comprobar que no tiene el permiso.
        $this->assertFalse(
            $usuario->hasPermissionTo('listar ofertas laborales')
        );

        // Crear empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Vincular al usuario con la empresa.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Intentar acceder al listado mediante HTTP.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresa));

        // El servidor debe denegar la solicitud.
        $response->assertForbidden();
    }

    public function test_visitante_no_autenticado_no_puede_acceder_al_listado(): void
    {
        // Crear una empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Realizar solicitud sin iniciar sesión.
        $response = $this->get(
            route('empresa.ofertas.index', $empresa)
        );

        // Laravel debe redirigir al inicio de sesión.
        $response->assertRedirect();
        $this->assertNotEquals(
            200,
            $response->getStatusCode()
        );
    }

    public function test_puede_buscar_ofertas_por_titulo_sin_incluir_otras_empresas(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
            'estado' => true,
        ]);

        $otraEmpresa = Empresa::create([
            'nombre_comercial' => 'Empresa Ajena',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        $ofertaBuscada = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Diseñador UX/UI',
        ]);

        OfertaLaboral::create([
            'empresa_id' => $otraEmpresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Especialista Laravel',
        ]);

        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', [
                'empresa' => $empresa->id,
                'buscar' => 'Laravel',
            ]));

        $response->assertOk();

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('filtros.buscar', 'Laravel')
                ->where('ofertas.total', 1)
                ->has('ofertas.data', 1)
                ->where(
                    'ofertas.data.0.id',
                    $ofertaBuscada->id
                )
                // Las estadísticas no deben cambiar por la búsqueda.
                ->where('estadisticas.total', 2)
                ->where('estadisticas.borradores', 2)
        );
    }

    public function test_puede_filtrar_ofertas_por_estado(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear los estados.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        $publicadaId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Publicada',
                'estado' => true,
            ]);

        $pausadaId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Pausada',
                'estado' => true,
            ]);

        // Crear ofertas de distintos estados.
        OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        $ofertaPublicada = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $publicadaId,
            'titulo' => 'Diseñador UX/UI',
        ]);

        OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $pausadaId,
            'titulo' => 'Analista de Sistemas',
        ]);

        // Solicitar únicamente ofertas publicadas.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', [
                'empresa' => $empresa->id,
                'estado_id' => $publicadaId,
            ]));

        $response->assertOk();

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('ofertas.total', 1)
                ->has('ofertas.data', 1)
                ->where('ofertas.data.0.id', $ofertaPublicada->id)
                ->where('estadisticas.total', 3)
                ->where('estadisticas.publicadas', 1)
                ->where('estadisticas.borradores', 1)
                ->where('estadisticas.pausadas', 1)
        );
    }

    public function test_paginacion_conserva_los_filtros_de_busqueda(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        // Crear 12 ofertas que coinciden con la búsqueda.
        for ($i = 1; $i <= 12; $i++) {
            OfertaLaboral::create([
                'empresa_id' => $empresa->id,
                'estado_oferta_id' => $borradorId,
                'titulo' => "Desarrollador Laravel {$i}",
            ]);
        }

        // Crear una oferta que no debe aparecer.
        OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Diseñador UX/UI',
        ]);

        // Consultar la segunda página con filtros.
        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', [
                'empresa' => $empresa->id,
                'buscar' => 'Laravel',
                'estado_id' => $borradorId,
                'per_page' => 5,
                'page' => 2,
            ]));

        $response->assertOk();

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('filtros.buscar', 'Laravel')
                ->where('filtros.estado_id', (string) $borradorId)
                ->where('filtros.per_page', 5)
                ->where('ofertas.current_page', 2)
                ->where('ofertas.per_page', 5)
                ->where('ofertas.total', 12)
                ->has('ofertas.data', 5)
                ->where('estadisticas.total', 13)
        );

        // Verificar que el enlace de la página siguiente
        // conserva todos los filtros.
        $datos = $response->viewData('page')['props'];

        $siguientePagina = $datos['ofertas']['next_page_url'];

        $this->assertNotNull($siguientePagina);

        $this->assertStringContainsString(
            'buscar=Laravel',
            $siguientePagina
        );

        $this->assertStringContainsString(
            'estado_id='.$borradorId,
            $siguientePagina
        );

        $this->assertStringContainsString(
            'per_page=5',
            $siguientePagina
        );

        $this->assertStringContainsString(
            'page=3',
            $siguientePagina
        );
    }

    public function test_inertia_informa_si_representante_puede_crear_ofertas(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');

        $usuario->givePermissionTo([
            'listar ofertas laborales',
            'crear ofertas laborales',
        ]);

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresa));

        $response->assertOk();

        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('permisos.crear', true)
        );
    }

    public function test_inertia_no_concede_creacion_a_representante_sin_permiso(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');

        // Puede listar, pero no crear.
        $usuario->givePermissionTo('listar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this
            ->actingAs($usuario)
            ->get(route('empresa.ofertas.index', $empresa));

        // Puede consultar el listado.
        $response->assertOk();

        // Pero React debe recibir crear = false.
        $response->assertInertia(
            fn ($page) => $page
                ->component('Empresa/Ofertas/Index', false)
                ->where('permisos.crear', false)
        );
    }
}

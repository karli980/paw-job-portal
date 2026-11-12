<?php

namespace Tests\Feature;

use App\Models\Empresa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class EmpresaOfertaLaboralStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['listar ofertas laborales', 'crear ofertas laborales'] as $nombre) {
            Permission::firstOrCreate([
                'name' => $nombre,
                'guard_name' => 'web',
            ]);
        }

        Role::firstOrCreate([
            'name' => 'representante_empresa',
            'guard_name' => 'web',
        ]);

        DB::table('estados_ofertas_laborales')->insert([
            ['nombre' => 'Borrador', 'estado' => true],
            ['nombre' => 'Publicada', 'estado' => true],
        ]);
    }

    private function crearEmpresa(string $nombre): Empresa
    {
        return Empresa::create([
            'nombre_comercial' => $nombre,
            'estado' => true,
        ]);
    }

    private function crearRepresentante(Empresa $empresa, bool $puedeCrear = true): User
    {
        $usuario = User::factory()->create();
        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        if ($puedeCrear) {
            $usuario->givePermissionTo('crear ofertas laborales');
        }

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $usuario;
    }

    public function test_representante_autorizado_puede_guardar_borrador_incompleto(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa);
        $borradorId = DB::table('estados_ofertas_laborales')
            ->where('nombre', 'Borrador')->value('id');

        $respuesta = $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $empresa),
            [
                'titulo' => 'Desarrollador Laravel',
                'resumen' => 'Oferta en preparación',
                'vacantes' => '2',
            ]
        );

        $respuesta->assertRedirect(route('empresa.ofertas.index', $empresa));
        $respuesta->assertSessionHas('success');

        $this->assertDatabaseHas('ofertas_laborales', [
            'empresa_id' => $empresa->id,
            'titulo' => 'Desarrollador Laravel',
            'resumen' => 'Oferta en preparación',
            'vacantes' => 2,
            'estado_oferta_id' => $borradorId,
            'fecha_publicacion' => null,
        ]);

        $oferta = DB::table('ofertas_laborales')->where('empresa_id', $empresa->id)->first();
        $this->assertNotNull($oferta);
        $this->assertNotEmpty($oferta->slug);
    }

    public function test_representante_no_puede_guardar_borrador_en_empresa_ajena(): void
    {
        $propia = $this->crearEmpresa('Empresa Propia');
        $ajena = $this->crearEmpresa('Empresa Ajena');
        $usuario = $this->crearRepresentante($propia);

        $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $ajena),
            ['titulo' => 'Oferta indebida']
        )->assertForbidden();

        $this->assertDatabaseCount('ofertas_laborales', 0);
    }

    public function test_representante_sin_permiso_de_creacion_no_puede_guardar(): void
    {
        $empresa = $this->crearEmpresa('Empresa de Prueba');
        $usuario = $this->crearRepresentante($empresa, false);

        $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $empresa),
            ['titulo' => 'Oferta no permitida']
        )->assertForbidden();

        $this->assertDatabaseCount('ofertas_laborales', 0);
    }

    public function test_servidor_ignora_empresa_estado_y_fecha_enviados_por_cliente(): void
    {
        $propia = $this->crearEmpresa('Empresa Propia');
        $ajena = $this->crearEmpresa('Empresa Ajena');
        $usuario = $this->crearRepresentante($propia);
        $borradorId = DB::table('estados_ofertas_laborales')
            ->where('nombre', 'Borrador')->value('id');
        $publicadaId = DB::table('estados_ofertas_laborales')
            ->where('nombre', 'Publicada')->value('id');

        $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $propia),
            [
                'titulo' => 'Oferta segura',
                'empresa_id' => $ajena->id,
                'estado_oferta_id' => $publicadaId,
                'fecha_publicacion' => '2026-11-12 12:00:00',
                'slug' => 'slug-manipulado',
            ]
        )->assertRedirect(route('empresa.ofertas.index', $propia));

        $oferta = DB::table('ofertas_laborales')->first();
        $this->assertNotNull($oferta);
        $this->assertSame($propia->id, (int) $oferta->empresa_id);
        $this->assertSame((int) $borradorId, (int) $oferta->estado_oferta_id);
        $this->assertNull($oferta->fecha_publicacion);
        $this->assertNotSame('slug-manipulado', $oferta->slug);
    }

    public function test_rechaza_subarea_que_no_pertenece_al_area_elegida(): void
    {
        $empresa = $this->crearEmpresa('Empresa de Prueba');
        $usuario = $this->crearRepresentante($empresa);

        $areaUno = DB::table('areas_laborales')->insertGetId([
            'nombre' => 'Tecnología', 'estado' => true,
        ]);
        $areaDos = DB::table('areas_laborales')->insertGetId([
            'nombre' => 'Comercial', 'estado' => true,
        ]);
        $subAreaDos = DB::table('sub_areas_laborales')->insertGetId([
            'area_laboral_id' => $areaDos,
            'nombre' => 'Ventas',
            'estado' => true,
        ]);

        $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $empresa),
            [
                'titulo' => 'Oferta inválida',
                'area_laboral_id' => $areaUno,
                'sub_area_laboral_id' => $subAreaDos,
            ]
        )->assertSessionHasErrors('sub_area_laboral_id');

        $this->assertDatabaseCount('ofertas_laborales', 0);
    }

    public function test_rechaza_ciudad_que_no_pertenece_a_la_provincia_elegida(): void
    {
        $empresa = $this->crearEmpresa('Empresa de Prueba');
        $usuario = $this->crearRepresentante($empresa);

        $paisId = DB::table('paises')->insertGetId([
            'nombre' => 'Argentina',
            'codigo_iso' => 'AR',
            'codigo_iso3' => 'ARG',
            'estado' => true,
        ]);

        $provinciaUno = DB::table('provincias')->insertGetId([
            'nombre' => 'Salta', 'pais_id' => $paisId, 'estado' => true,
        ]);
        $provinciaDos = DB::table('provincias')->insertGetId([
            'nombre' => 'Jujuy', 'pais_id' => $paisId, 'estado' => true,
        ]);
        $ciudadDos = DB::table('ciudades')->insertGetId([
            'nombre' => 'San Salvador de Jujuy',
            'provincia_id' => $provinciaDos,
            'estado' => true,
        ]);

        $this->actingAs($usuario)->post(
            route('empresa.ofertas.store', $empresa),
            [
                'pais_id' => $paisId,
                'provincia_id' => $provinciaUno,
                'ciudad_id' => $ciudadDos,
            ]
        )->assertSessionHasErrors('ciudad_id');

        $this->assertDatabaseCount('ofertas_laborales', 0);
    }
}

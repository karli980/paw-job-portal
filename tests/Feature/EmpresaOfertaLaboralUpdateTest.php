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

class EmpresaOfertaLaboralUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['listar ofertas laborales', 'editar ofertas laborales'] as $nombre) {
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

    private function crearRepresentante(Empresa $empresa, bool $puedeEditar = true): User
    {
        $usuario = User::factory()->create();
        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        if ($puedeEditar) {
            $usuario->givePermissionTo('editar ofertas laborales');
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

    private function crearOferta(Empresa $empresa, string $estado = 'Borrador'): int
    {
        $estadoId = DB::table('estados_ofertas_laborales')
            ->where('nombre', $estado)
            ->value('id');

        return DB::table('ofertas_laborales')->insertGetId([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $estadoId,
            'titulo' => 'Título anterior',
            'resumen' => 'Resumen anterior',
            'vacantes' => 1,
            'slug' => 'oferta-'.uniqid(),
            'fecha_publicacion' => $estado === 'Publicada' ? '2026-11-01 12:00:00' : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function urlEditar(Empresa $empresa, int $ofertaId): string
    {
        return route('empresa.ofertas.edit', [
            'empresa' => $empresa->id,
            'oferta' => $ofertaId,
        ]);
    }

    private function urlActualizar(Empresa $empresa, int $ofertaId): string
    {
        return route('empresa.ofertas.update', [
            'empresa' => $empresa->id,
            'oferta' => $ofertaId,
        ]);
    }

    public function test_representante_puede_abrir_la_edicion_de_su_oferta(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa);
        $ofertaId = $this->crearOferta($empresa);

        $this->actingAs($usuario)
            ->get($this->urlEditar($empresa, $ofertaId))
            ->assertOk()
            ->assertInertia(fn ($pagina) => $pagina
                ->component('Empresa/Ofertas/Edit', false)
                ->where('empresa.id', $empresa->id)
                ->where('oferta.id', $ofertaId)
                ->where('oferta.titulo', 'Título anterior')
                ->has('modalidades')
                ->has('areasLaborales'));
    }

    public function test_no_puede_abrir_una_oferta_de_otra_empresa(): void
    {
        $propia = $this->crearEmpresa('Empresa Propia');
        $ajena = $this->crearEmpresa('Empresa Ajena');
        $usuario = $this->crearRepresentante($propia);
        $ofertaId = $this->crearOferta($ajena);

        $this->actingAs($usuario)
            ->get($this->urlEditar($propia, $ofertaId))
            ->assertNotFound();
    }

    public function test_representante_autorizado_puede_actualizar_un_borrador(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa);
        $ofertaId = $this->crearOferta($empresa);
        $borradorId = DB::table('estados_ofertas_laborales')->where('nombre', 'Borrador')->value('id');

        $this->actingAs($usuario)
            ->put($this->urlActualizar($empresa, $ofertaId), [
                'titulo' => 'Título actualizado',
                'resumen' => 'Resumen actualizado',
                'vacantes' => '3',
            ])
            ->assertRedirect(route('empresa.ofertas.index', $empresa))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $ofertaId,
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Título actualizado',
            'resumen' => 'Resumen actualizado',
            'vacantes' => 3,
            'fecha_publicacion' => null,
        ]);
        $this->assertDatabaseCount('ofertas_laborales', 1);
    }

    public function test_no_puede_actualizar_una_oferta_de_otra_empresa(): void
    {
        $propia = $this->crearEmpresa('Empresa Propia');
        $ajena = $this->crearEmpresa('Empresa Ajena');
        $usuario = $this->crearRepresentante($propia);
        $ofertaId = $this->crearOferta($ajena);

        $this->actingAs($usuario)
            ->put($this->urlActualizar($propia, $ofertaId), [
                'titulo' => 'Intento de cambio',
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $ofertaId,
            'titulo' => 'Título anterior',
        ]);
    }

    public function test_representante_sin_permiso_no_puede_actualizar(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa, false);
        $ofertaId = $this->crearOferta($empresa);

        $this->actingAs($usuario)
            ->put($this->urlActualizar($empresa, $ofertaId), [
                'titulo' => 'Cambio prohibido',
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $ofertaId,
            'titulo' => 'Título anterior',
        ]);
    }

    public function test_no_puede_modificar_una_oferta_publicada_desde_edicion_de_borrador(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa);
        $ofertaId = $this->crearOferta($empresa, 'Publicada');

        $this->actingAs($usuario)
            ->put($this->urlActualizar($empresa, $ofertaId), [
                'titulo' => 'Cambio no permitido',
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $ofertaId,
            'titulo' => 'Título anterior',
        ]);
    }

    public function test_ignora_manipulacion_de_empresa_estado_fecha_y_slug(): void
    {
        $propia = $this->crearEmpresa('Empresa Propia');
        $ajena = $this->crearEmpresa('Empresa Ajena');
        $usuario = $this->crearRepresentante($propia);
        $ofertaId = $this->crearOferta($propia);
        $antes = DB::table('ofertas_laborales')->where('id', $ofertaId)->first();
        $publicadaId = DB::table('estados_ofertas_laborales')->where('nombre', 'Publicada')->value('id');

        $this->actingAs($usuario)
            ->put($this->urlActualizar($propia, $ofertaId), [
                'titulo' => 'Cambio permitido',
                'empresa_id' => $ajena->id,
                'estado_oferta_id' => $publicadaId,
                'fecha_publicacion' => '2026-11-12 12:00:00',
                'slug' => 'slug-manipulado',
            ])
            ->assertRedirect(route('empresa.ofertas.index', $propia));

        $despues = DB::table('ofertas_laborales')->where('id', $ofertaId)->first();
        $this->assertSame($propia->id, (int) $despues->empresa_id);
        $this->assertSame((int) $antes->estado_oferta_id, (int) $despues->estado_oferta_id);
        $this->assertNull($despues->fecha_publicacion);
        $this->assertSame($antes->slug, $despues->slug);
        $this->assertSame('Cambio permitido', $despues->titulo);
    }

    public function test_rechaza_subarea_de_otra_area_sin_modificar_borrador(): void
    {
        $empresa = $this->crearEmpresa('Empresa Propia');
        $usuario = $this->crearRepresentante($empresa);
        $ofertaId = $this->crearOferta($empresa);

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

        $this->actingAs($usuario)
            ->put($this->urlActualizar($empresa, $ofertaId), [
                'titulo' => 'Cambio inválido',
                'area_laboral_id' => $areaUno,
                'sub_area_laboral_id' => $subAreaDos,
            ])
            ->assertSessionHasErrors('sub_area_laboral_id');

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $ofertaId,
            'titulo' => 'Título anterior',
        ]);
    }
}


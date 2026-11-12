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

class OfertaLaboralPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app(PermissionRegistrar::class)
            ->forgetCachedPermissions();

        Role::firstOrCreate([
            'name' => 'representante_empresa',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'editar ofertas laborales',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'listar ofertas laborales',
            'guard_name' => 'web',
        ]);

        Permission::firstOrCreate([
            'name' => 'crear ofertas laborales',
            'guard_name' => 'web',
        ]);

    }

    public function test_representante_puede_editar_oferta_de_su_empresa(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('editar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
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

        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        $this->assertTrue(
            $usuario->can('update', $oferta)
        );
    }

    public function test_representante_no_puede_editar_oferta_de_otra_empresa(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('editar ofertas laborales');

        $empresaPropia = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
            'estado' => true,
        ]);

        $empresaAjena = Empresa::create([
            'nombre_comercial' => 'Empresa Ajena',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresaPropia->id,
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

        $ofertaAjena = OfertaLaboral::create([
            'empresa_id' => $empresaAjena->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Analista de Sistemas',
        ]);

        $this->assertFalse(
            $usuario->can('update', $ofertaAjena)
        );
    }

    public function test_representante_inactivo_no_puede_editar_ofertas(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('editar ofertas laborales');

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa Inactiva en Relación',
            'estado' => true,
        ]);

        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Programador PHP',
        ]);

        $this->assertFalse(
            $usuario->can('update', $oferta)
        );
    }

    public function test_no_permite_editar_ofertas_de_empresa_desactivada(): void
    {
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('editar ofertas laborales');

        // Empresa desactivada.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa Desactivada',
            'estado' => false,
        ]);

        // La asociación del representante sigue activa.
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

        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador PHP',
        ]);

        // La empresa desactivada no puede administrar ofertas.
        $this->assertFalse(
            $usuario->can('update', $oferta)
        );
    }

    public function test_representante_sin_permiso_no_puede_editar_ofertas(): void
    {
        // Crear usuario representante empresarial.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');

        // NO asignamos el permiso 'editar ofertas laborales'.

        // Crear empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Asociación empresarial válida.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear estado borrador.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        // Crear oferta perteneciente a su empresa.
        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        // Verificar que NO posee el permiso.
        $this->assertFalse(
            $usuario->hasPermissionTo('editar ofertas laborales')
        );

        // Verificar que la política deniega la edición.
        $this->assertFalse(
            $usuario->can('update', $oferta)
        );
    }

    public function test_superadmin_puede_editar_ofertas_de_cualquier_empresa(): void
    {
        // Crear el rol superadministrador.
        Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        // Crear usuario superadministrador.
        $usuario = User::factory()->create();

        $usuario->assignRole('super-admin');

        // Asignar al rol el permiso correspondiente.
        $rol = Role::findByName('super-admin', 'web');

        $rol->givePermissionTo('editar ofertas laborales');

        // Crear empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Crear estado borrador.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
            ]);

        // Crear oferta de una empresa ajena.
        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Full Stack',
        ]);

        // No existe asociación con la empresa.
        $this->assertDatabaseMissing('empresa_usuario', [
            'empresa_id' => $empresa->id,
            'user_id' => $usuario->id,
        ]);

        // Verificar permiso Spatie.
        $this->assertTrue(
            $usuario->hasPermissionTo('editar ofertas laborales')
        );

        // Verificar autorización mediante la política.
        $this->assertTrue(
            $usuario->can('update', $oferta)
        );
    }

    public function test_representante_solo_puede_listar_ofertas_de_su_empresa(): void
    {
        // Crear representante con permiso de lectura,
        // pero sin permiso de creación.
        $usuario = User::factory()->create();

        $usuario->assignRole('representante_empresa');
        $usuario->givePermissionTo('listar ofertas laborales');

        // Crear dos empresas activas.
        $empresaPropia = Empresa::create([
            'nombre_comercial' => 'Empresa Propia',
            'estado' => true,
        ]);

        $empresaAjena = Empresa::create([
            'nombre_comercial' => 'Empresa Ajena',
            'estado' => true,
        ]);

        // Asociar al representante únicamente con su empresa.
        DB::table('empresa_usuario')->insert([
            'empresa_id' => $empresaPropia->id,
            'user_id' => $usuario->id,
            'rol' => 'admin',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Puede consultar las ofertas de su empresa.
        $this->assertTrue(
            $usuario->can('viewCompany', [
                OfertaLaboral::class,
                $empresaPropia,
            ])
        );

        // No puede consultar las ofertas de otra empresa.
        $this->assertFalse(
            $usuario->can('viewCompany', [
                OfertaLaboral::class,
                $empresaAjena,
            ])
        );

        // El permiso de lectura no concede permiso de creación.
        $this->assertFalse(
            $usuario->can('create', [
                OfertaLaboral::class,
                $empresaPropia,
            ])
        );
    }
}

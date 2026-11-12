<?php

namespace Tests\Feature;

use App\Models\Empresa;
use App\Models\OfertaLaboral;
use App\Services\OfertaLaboralEstadoService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class OfertaLaboralEstadoTest extends TestCase
{
    use RefreshDatabase;

    public function test_no_permite_publicar_una_oferta_incompleta(): void
    {
        // Estados necesarios para la prueba.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        DB::table('estados_ofertas_laborales')->insert([
            'nombre' => 'Publicada',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Empresa de prueba.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Oferta incompleta.
        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
        ]);

        $servicio = app(OfertaLaboralEstadoService::class);

        try {
            $servicio->cambiarEstado(
                $oferta,
                'Publicada',
                null,
                'Intento de publicación'
            );

            $this->fail(
                'La oferta incompleta no debería poder publicarse.'
            );
        } catch (ValidationException $e) {
            $this->assertNotEmpty($e->errors());
        }

        // La oferta debe conservar su estado original.
        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $oferta->id,
            'estado_oferta_id' => $borradorId,
            'fecha_publicacion' => null,
        ]);

        // No debe registrarse una transición fallida.
        $this->assertDatabaseCount(
            'historial_estados_ofertas',
            0
        );
    }

    public function test_permite_publicar_una_oferta_valida(): void
    {
        // Estados necesarios para la prueba.
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        $publicadaId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Publicada',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        // Empresa activa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Catálogos requeridos.
        $areaId = DB::table('areas_laborales')->insertGetId([
            'nombre' => 'Tecnología',
            'estado' => true,
        ]);

        $subAreaId = DB::table('sub_areas_laborales')->insertGetId([
            'area_laboral_id' => $areaId,
            'nombre' => 'Desarrollo de Software',
            'estado' => true,
        ]);

        $modalidadId = DB::table('modalidades_trabajos')->insertGetId([
            'nombre' => 'Remoto',
            'estado' => true,
        ]);

        $paisId = DB::table('paises')->insertGetId([
            'nombre' => 'Argentina',
            'codigo_iso' => 'AR',
            'codigo_iso3' => 'ARG',
            'estado' => true,
        ]);

        // Oferta válida.
        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Desarrollador Laravel',
            'resumen' => 'Buscamos desarrollador para aplicaciones web.',
            'descripcion' => 'Desarrollo y mantenimiento de sistemas web.',
            'area_laboral_id' => $areaId,
            'sub_area_laboral_id' => $subAreaId,
            'modalidad_trabajo_id' => $modalidadId,
            'pais_id' => $paisId,
            'vacantes' => 2,
            'fecha_vencimiento' => now()->addMonth(),
        ]);

        // Publicar.
        $servicio = app(OfertaLaboralEstadoService::class);

        $servicio->cambiarEstado(
            $oferta,
            'Publicada',
            null,
            'Publicación inicial'
        );

        // Verificar estado y fecha.
        $oferta->refresh();

        $this->assertEquals(
            $publicadaId,
            $oferta->estado_oferta_id
        );

        $this->assertNotNull($oferta->fecha_publicacion);

        // Verificar historial.
        $this->assertDatabaseHas('historial_estados_ofertas', [
            'oferta_laboral_id' => $oferta->id,
            'estado_anterior_id' => $borradorId,
            'estado_nuevo_id' => $publicadaId,
            'motivo' => 'Publicación inicial',
        ]);

        $this->assertDatabaseCount(
            'historial_estados_ofertas',
            1
        );
    }

    public function test_no_permite_transiciones_de_estado_invalidas(): void
    {
        $borradorId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Borrador',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        DB::table('estados_ofertas_laborales')->insert([
            'nombre' => 'Archivada',
            'estado' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $borradorId,
            'titulo' => 'Oferta de prueba',
        ]);

        $servicio = app(OfertaLaboralEstadoService::class);

        try {
            $servicio->cambiarEstado(
                $oferta,
                'Archivada',
                null,
                'Transición no permitida'
            );

            $this->fail(
                'No debería permitirse archivar directamente un borrador.'
            );
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('estado', $e->errors());
        }

        $this->assertDatabaseHas('ofertas_laborales', [
            'id' => $oferta->id,
            'estado_oferta_id' => $borradorId,
        ]);

        $this->assertDatabaseCount('historial_estados_ofertas', 0);
    }

    public function test_permite_pausar_una_oferta_publicada(): void
    {
        // Crear estados para la prueba.
        $publicadaId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Publicada',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        $pausadaId = DB::table('estados_ofertas_laborales')
            ->insertGetId([
                'nombre' => 'Pausada',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        // Crear empresa.
        $empresa = Empresa::create([
            'nombre_comercial' => 'Empresa de Prueba',
            'estado' => true,
        ]);

        // Crear oferta ya publicada.
        $fechaOriginal = now()->subDays(2)->startOfSecond();

        $oferta = OfertaLaboral::create([
            'empresa_id' => $empresa->id,
            'estado_oferta_id' => $publicadaId,
            'titulo' => 'Desarrollador Full Stack',
            'fecha_publicacion' => $fechaOriginal,
            'fecha_vencimiento' => now()->addMonth(),
        ]);

        // Pausar la oferta.
        $servicio = app(OfertaLaboralEstadoService::class);

        $servicio->cambiarEstado(
            $oferta,
            'Pausada',
            null,
            'Suspensión temporal de postulaciones'
        );

        $oferta->refresh();

        // Verificar nuevo estado.
        $this->assertEquals(
            $pausadaId,
            $oferta->estado_oferta_id
        );

        // La fecha original de publicación no debe cambiar.
        $this->assertTrue(
            $fechaOriginal->equalTo($oferta->fecha_publicacion)
        );

        // Comprobar el historial.
        $this->assertDatabaseHas('historial_estados_ofertas', [
            'oferta_laboral_id' => $oferta->id,
            'estado_anterior_id' => $publicadaId,
            'estado_nuevo_id' => $pausadaId,
            'motivo' => 'Suspensión temporal de postulaciones',
        ]);

        $this->assertDatabaseCount(
            'historial_estados_ofertas',
            1
        );
    }

public function test_permite_reactivar_una_oferta_pausada(): void
{
    $pausadaId = DB::table('estados_ofertas_laborales')
        ->insertGetId([
            'nombre' => 'Pausada',
            'estado' => true,
        ]);

    $publicadaId = DB::table('estados_ofertas_laborales')
        ->insertGetId([
            'nombre' => 'Publicada',
            'estado' => true,
        ]);

    $empresa = Empresa::create([
        'nombre_comercial' => 'Empresa de Prueba',
        'estado' => true,
    ]);

    $areaId = DB::table('areas_laborales')->insertGetId([
        'nombre' => 'Tecnología',
        'estado' => true,
    ]);

    $subAreaId = DB::table('sub_areas_laborales')->insertGetId([
        'area_laboral_id' => $areaId,
        'nombre' => 'Desarrollo de Software',
        'estado' => true,
    ]);

    $modalidadId = DB::table('modalidades_trabajos')->insertGetId([
        'nombre' => 'Remoto',
        'estado' => true,
    ]);

    $paisId = DB::table('paises')->insertGetId([
        'nombre' => 'Argentina',
        'codigo_iso' => 'AR',
        'codigo_iso3' => 'ARG',
        'estado' => true,
    ]);

    $fechaOriginal = now()->subDays(2)->startOfSecond();

    $oferta = OfertaLaboral::create([
        'empresa_id' => $empresa->id,
        'estado_oferta_id' => $pausadaId,
        'titulo' => 'Desarrollador Laravel',
        'resumen' => 'Buscamos desarrollador para aplicaciones web.',
        'descripcion' => 'Desarrollo y mantenimiento de sistemas.',
        'area_laboral_id' => $areaId,
        'sub_area_laboral_id' => $subAreaId,
        'modalidad_trabajo_id' => $modalidadId,
        'pais_id' => $paisId,
        'vacantes' => 2,
        'fecha_publicacion' => $fechaOriginal,
        'fecha_vencimiento' => now()->addMonth(),
    ]);

    $servicio = app(OfertaLaboralEstadoService::class);

    $servicio->cambiarEstado(
        $oferta,
        'Publicada',
        null,
        'Reactivación de la oferta'
    );

    $oferta->refresh();

    $this->assertEquals(
        $publicadaId,
        $oferta->estado_oferta_id
    );

    $this->assertTrue(
        $fechaOriginal->equalTo($oferta->fecha_publicacion)
    );

    $this->assertDatabaseHas('historial_estados_ofertas', [
        'oferta_laboral_id' => $oferta->id,
        'estado_anterior_id' => $pausadaId,
        'estado_nuevo_id' => $publicadaId,
        'motivo' => 'Reactivación de la oferta',
    ]);

    $this->assertDatabaseCount('historial_estados_ofertas', 1);
}

}

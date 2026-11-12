<?php

namespace Tests\Feature;

use App\Http\Controllers\CiudadController;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\ProvinciaController;
use App\Models\Ciudad;
use App\Models\Pais;
use App\Models\Provincia;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CascadaPaisesTest extends TestCase
{
    use RefreshDatabase;

    public function test_desactivar_pais_desactiva_provincias_y_ciudades(): void
    {
        $fecha = now();

        // Crear país temporal.
        $paisId = DB::table('paises')->insertGetId([
            'nombre' => 'País Prueba Cascada',
            'codigo_iso' => 'XZ',
            'codigo_iso3' => 'XZZ',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        // Crear provincia temporal.
        $provinciaId = DB::table('provincias')->insertGetId([
            'pais_id' => $paisId,
            'nombre' => 'Provincia Prueba Cascada',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        // Crear ciudad temporal.
        $ciudadId = DB::table('ciudades')->insertGetId([
            'provincia_id' => $provinciaId,
            'nombre' => 'Ciudad Prueba Cascada',
            'codigo_postal' => '0000',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        // Ejecutar la desactivación desde el controlador.
        app(PaisController::class)->destroy(
            Pais::findOrFail($paisId)
        );

        // Comprobar los tres estados.
        $this->assertDatabaseHas('paises', [
            'id' => $paisId,
            'estado' => false,
        ]);

        $this->assertDatabaseHas('provincias', [
            'id' => $provinciaId,
            'estado' => false,
        ]);

        $this->assertDatabaseHas('ciudades', [
            'id' => $ciudadId,
            'estado' => false,
        ]);
    }

    public function test_desactivar_provincia_desactiva_sus_ciudades(): void
    {
        $fecha = now();

        $paisId = DB::table('paises')->insertGetId([
            'nombre' => 'País Prueba Provincial',
            'codigo_iso' => 'QZ',
            'codigo_iso3' => 'QZZ',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        $provinciaId = DB::table('provincias')->insertGetId([
            'pais_id' => $paisId,
            'nombre' => 'Provincia Prueba',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        $ciudadId = DB::table('ciudades')->insertGetId([
            'provincia_id' => $provinciaId,
            'nombre' => 'Ciudad Prueba Provincial',
            'codigo_postal' => '9999',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        app(ProvinciaController::class)
            ->destroy(
                Provincia::findOrFail($provinciaId)
            );

        // El país debe permanecer activo.
        $this->assertDatabaseHas('paises', [
            'id' => $paisId,
            'estado' => true,
        ]);

        // La provincia debe quedar inactiva.
        $this->assertDatabaseHas('provincias', [
            'id' => $provinciaId,
            'estado' => false,
        ]);

        // Su ciudad también debe quedar inactiva.
        $this->assertDatabaseHas('ciudades', [
            'id' => $ciudadId,
            'estado' => false,
        ]);
    }

    public function test_no_permite_activar_ciudad_con_ubicacion_inactiva(): void
    {
        $fecha = now();

        $paisId = DB::table('paises')->insertGetId([
            'nombre' => 'Pais Prueba Activacion',
            'codigo_iso' => 'YZ',
            'codigo_iso3' => 'YZZ',
            'estado' => true,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        $provinciaId = DB::table('provincias')->insertGetId([
            'pais_id' => $paisId,
            'nombre' => 'Provincia Prueba Activacion',
            'estado' => false,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        $ciudadId = DB::table('ciudades')->insertGetId([
            'provincia_id' => $provinciaId,
            'nombre' => 'Ciudad Prueba Activacion',
            'codigo_postal' => '8888',
            'estado' => false,
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ]);

        $controlador = app(
            CiudadController::class
        );

        // Verificar que la activación sea rechazada.
        $verificarBloqueo = function () use ($controlador, $ciudadId) {
            try {
                $controlador->toggleEstado(
                    Ciudad::findOrFail($ciudadId)
                );

                $this->fail(
                    'La activación debería haber sido rechazada.'
                );
            } catch (ValidationException $e) {
                $this->assertArrayHasKey('estado', $e->errors());
            }

            $this->assertDatabaseHas('ciudades', [
                'id' => $ciudadId,
                'estado' => false,
            ]);
        };

        // CASO 1: país activo, provincia inactiva.
        $verificarBloqueo();

        // CASO 2: provincia activa, país inactivo.
        // Simulamos esta inconsistencia para comprobar
        // la validación defensiva del controlador.
        DB::table('provincias')
            ->where('id', $provinciaId)
            ->update(['estado' => true]);

        DB::table('paises')
            ->where('id', $paisId)
            ->update(['estado' => false]);

        $verificarBloqueo();
    }
}

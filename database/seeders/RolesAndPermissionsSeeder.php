<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de permisos.
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | 1. Definición de permisos
        |--------------------------------------------------------------------------
        */

        $nombresPermisos = [

            // Usuarios.
            'listar usuarios',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',

            // Roles.
            'listar roles',
            'gestionar roles',

            // Permisos.
            'listar permisos',
            'gestionar permisos',

            // Testimonios.
            'listar testimonios',
            'moderar testimonios',
            'destacar testimonios',
            'eliminar testimonios',

            // Ubicaciones.
            'listar ubicaciones',
            'gestionar ubicaciones',

            // Formación académica.
            'listar formacion',
            'gestionar formacion',

            // Experiencia laboral.
            'listar experiencia laboral',
            'gestionar experiencia laboral',

            // Competencias.
            'listar competencias',
            'gestionar competencias',

            // Datos de empresas.
            'listar empresas',
            'gestionar empresas',

            // Datos generales.
            'listar datos generales',
            'gestionar datos generales',

            // Redes sociales institucionales.
            'listar redes sociales',
            'gestionar redes sociales',

            // Ofertas laborales.
            'listar ofertas laborales',
            'crear ofertas laborales',
            'editar ofertas laborales',
            'publicar ofertas laborales',
            'pausar ofertas laborales',
            'cerrar ofertas laborales',
            'archivar ofertas laborales',
            'eliminar ofertas laborales',
            'moderar ofertas laborales',
            'ver historial ofertas laborales',
        ];

        /*
        |--------------------------------------------------------------------------
        | 2. Crear permisos sin duplicarlos
        |--------------------------------------------------------------------------
        */

        $permisos = collect();

        foreach ($nombresPermisos as $nombre) {
            $permisos->push(
                Permission::firstOrCreate([
                    'name' => $nombre,
                    'guard_name' => 'web',
                ])
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Crear roles
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $moderador = Role::firstOrCreate([
            'name' => 'moderador',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'candidato',
            'guard_name' => 'web',
        ]);

        $representanteEmpresa = Role::firstOrCreate([
            'name' => 'representante_empresa',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | 4. Permisos del Super Admin
        |--------------------------------------------------------------------------
        |
        | Tiene todos los permisos definidos en este Seeder.
        |
        */

        $superAdmin->syncPermissions($permisos);

        /*
        |--------------------------------------------------------------------------
        | 5. Permisos iniciales del Administrador
        |--------------------------------------------------------------------------
        |
        | Los permisos adicionales de catálogos se asignarán
        | individualmente desde el panel del Super Admin.
        |
        */

        $admin->givePermissionTo([
            // Usuarios.
            'listar usuarios',
            'crear usuarios',
            'editar usuarios',

            // Testimonios.
            'listar testimonios',
            'moderar testimonios',
            'destacar testimonios',
        ]);

        /*
        |--------------------------------------------------------------------------
        | 6. Permisos del Moderador
        |--------------------------------------------------------------------------
        |
        | Su función inicial se limita a la moderación
        | de testimonios.
        |
        */

        $moderador->givePermissionTo([
            'listar testimonios',
            'moderar testimonios',
            'destacar testimonios',
        ]);

        /*
|--------------------------------------------------------------------------
| Permisos del representante empresarial
|--------------------------------------------------------------------------
| Las operaciones sobre una oferta también estarán sujetas
| a la asociación activa con la empresa propietaria.
|--------------------------------------------------------------------------
*/

        $representanteEmpresa->givePermissionTo([
            'listar ofertas laborales',
            'crear ofertas laborales',
            'editar ofertas laborales',
            'publicar ofertas laborales',
            'pausar ofertas laborales',
            'cerrar ofertas laborales',
            'archivar ofertas laborales',
            'eliminar ofertas laborales',
            'ver historial ofertas laborales',
        ]);
        /*
        |--------------------------------------------------------------------------
        | 7. Limpiar caché nuevamente
        |--------------------------------------------------------------------------
        */

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}

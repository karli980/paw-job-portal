<?php

use App\Http\Controllers\Empresa\DashboardController;
use App\Http\Controllers\Empresa\EmpresaContactoController;
use App\Http\Controllers\Empresa\EmpresaLogoController;
use App\Http\Controllers\Empresa\EmpresaRedSocialController;
use App\Http\Controllers\Empresa\PerfilEmpresaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| RUTAS EMPRESARIALES - TALENT MATCH
|--------------------------------------------------------------------------
|
| Acceso exclusivo para representantes empresariales
| autenticados y con correo verificado.
|
*/

Route::prefix('empresa')
    ->name('empresa.')
    ->middleware([
        'auth',
        'verified',
        'role:representante_empresa',
    ])
    ->group(function () {

        // Dashboard empresarial.
        Route::get(
            '/dashboard',
            [DashboardController::class, 'index']
        )->name('dashboard');

        // Consultar y editar el perfil empresarial.
        Route::get(
            '/{empresa}/perfil',
            [PerfilEmpresaController::class, 'edit']
        )
            ->whereNumber('empresa')
            ->name('perfil.edit');

        // Guardar los cambios del perfil empresarial.
        Route::put(
            '/{empresa}/perfil',
            [PerfilEmpresaController::class, 'update']
        )
            ->whereNumber('empresa')
            ->name('perfil.update');
        // Redes sociales empresariales.
        Route::post(
            '/{empresa}/redes-sociales',
            [EmpresaRedSocialController::class, 'store']
        )
            ->whereNumber('empresa')
            ->name('redes-sociales.store');

        Route::put(
            '/{empresa}/redes-sociales/{vinculo}',
            [EmpresaRedSocialController::class, 'update']
        )
            ->whereNumber('empresa')
            ->whereNumber('vinculo')
            ->name('redes-sociales.update');

        Route::delete(
            '/{empresa}/redes-sociales/{vinculo}',
            [EmpresaRedSocialController::class, 'destroy']
        )
            ->whereNumber('empresa')
            ->whereNumber('vinculo')
            ->name('redes-sociales.destroy');
        // ----------------------------------------------
        // LOGO EMPRESARIAL
        // ----------------------------------------------

        Route::post(
            '/{empresa}/logo',
            [EmpresaLogoController::class, 'store']
        )
            ->whereNumber('empresa')
            ->name('logo.store');

        Route::delete(
            '/{empresa}/logo',
            [EmpresaLogoController::class, 'destroy']
        )
            ->whereNumber('empresa')
            ->name('logo.destroy');
        Route::put(
            '{empresa}/contacto',
            [EmpresaContactoController::class, 'update']
        )->name('contacto.update');
    });

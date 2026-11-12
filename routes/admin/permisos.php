<?php

use App\Http\Controllers\Admin\PermissionController;
use Illuminate\Support\Facades\Route;

// Consultar permisos.
Route::get('/permisos', [
    PermissionController::class,
    'index',
])->name('permisos.index');

// Actualizar permisos individuales.
Route::put('/permisos/{usuario}', [
    PermissionController::class,
    'update',
])->name('permisos.update');

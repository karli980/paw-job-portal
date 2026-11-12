<?php

use App\Http\Controllers\Admin\UsuarioController;
use Illuminate\Support\Facades\Route;

// Listar administradores.
Route::get('/usuarios', [
    UsuarioController::class,
    'index',
])->name('usuarios.index');

// Crear administrador.
Route::post('/usuarios', [
    UsuarioController::class,
    'store',
])->name('usuarios.store');

// Actualizar administrador.
Route::put('/usuarios/{usuario}', [
    UsuarioController::class,
    'update',
])->name('usuarios.update');

// Activar o desactivar administrador.
Route::patch('/usuarios/{usuario}/estado', [
    UsuarioController::class,
    'toggleEstado',
])->name('usuarios.toggleEstado');

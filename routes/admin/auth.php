
<?php

use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\AdminNewPasswordController;
use App\Http\Controllers\Admin\Auth\AdminPasswordResetLinkController;
use Illuminate\Support\Facades\Route;

// Inicio de sesión administrativo.
Route::get('/login', [
    AdminAuthenticatedSessionController::class,
    'create',
])->name('login');

Route::post('/login', [
    AdminAuthenticatedSessionController::class,
    'store',
])->name('login.store');

// Recuperación de contraseña.
Route::get('/forgot-password', [
    AdminPasswordResetLinkController::class,
    'create',
])->name('password.request');

Route::post('/forgot-password', [
    AdminPasswordResetLinkController::class,
    'store',
])->name('password.email');

Route::get('/reset-password/{token}', [
    AdminNewPasswordController::class,
    'create',
])->name('password.reset');

Route::post('/reset-password', [
    AdminNewPasswordController::class,
    'store',
])->name('password.update');

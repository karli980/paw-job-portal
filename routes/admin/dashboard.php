
<?php

use App\Http\Controllers\Admin\Auth\AdminAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Cerrar sesión administrativa.
Route::post('/logout', [
    AdminAuthenticatedSessionController::class,
    'destroy',
])->name('logout');

// Panel administrativo.
Route::inertia(
    '/dashboard',
    'Admin/Dashboard'
)->name('dashboard');

<?php

use App\Http\Controllers\Empresa\OfertaLaboralController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('empresa/{empresa}')
    ->name('empresa.')
    ->group(function () {
        Route::get(
            '/ofertas',
            [OfertaLaboralController::class, 'index']
        )->name('ofertas.index');
    });

Route::get(
    'empresa/{empresa}/ofertas/crear',
    [OfertaLaboralController::class, 'create']
)->name('empresa.ofertas.create');
Route::post(
    'empresa/{empresa}/ofertas',
    [OfertaLaboralController::class, 'store']
)->name('empresa.ofertas.store');

Route::get(
    'empresa/{empresa}/ofertas/{oferta}/editar',
    [OfertaLaboralController::class, 'edit']
)->name('empresa.ofertas.edit');

Route::put(
    'empresa/{empresa}/ofertas/{oferta}',
    [OfertaLaboralController::class, 'update']
)->name('empresa.ofertas.update');

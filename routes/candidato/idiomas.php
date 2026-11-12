<?php

use App\Http\Controllers\CandidatoIdiomaController;
use Illuminate\Support\Facades\Route;

Route::prefix('idiomas')
    ->name('idiomas.')
    ->controller(CandidatoIdiomaController::class)
    ->group(function () {

        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{candidatoIdioma}', 'update')->name('update');
        Route::delete('/{candidatoIdioma}', 'destroy')->name('destroy');
    });

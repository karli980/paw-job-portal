<?php

use App\Http\Controllers\CandidatoExperienciaLaboralController;
use Illuminate\Support\Facades\Route;

Route::prefix('experiencias-laborales')
    ->name('experiencias-laborales.')
    ->controller(CandidatoExperienciaLaboralController::class)
    ->group(function () {

        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{experienciaLaboral}', 'update')->name('update');
        Route::delete('/{experienciaLaboral}', 'destroy')->name('destroy');
    });

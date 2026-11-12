<?php

use App\Http\Controllers\CandidatoEstudioController;
use Illuminate\Support\Facades\Route;

Route::prefix('estudios')
    ->name('estudios.')
    ->controller(CandidatoEstudioController::class)
    ->group(function () {

        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{estudio}', 'update')->name('update');
        Route::delete('/{estudio}', 'destroy')->name('destroy');
    });
